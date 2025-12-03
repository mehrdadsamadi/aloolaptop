import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Model, Types } from 'mongoose';
import { CartService } from '../cart/cart.service';
import {
  CartMessage,
  OrderMessage,
  PaymentMessage,
} from '../../common/enums/message.enum';
import { OrderStatus } from './enums/order-status.enum';
import { PaymentStatus } from '../payment/enums/payment-status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Payment, PaymentDocument } from '../payment/schema/payment.schema';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    private readonly cartService: CartService,

    @Inject(REQUEST) private req: Request,
  ) {}

  async createFromCart(addressId: string) {
    const userId = this.req.user?._id;

    const cart = await this.cartService.getOrCreateCart();
    if (!cart) throw new NotFoundException(CartMessage.Notfound);

    // 1) بررسی وجود Order منتظر پرداخت
    const existingOrder = await this.orderModel.findOne({
      userId,
      status: OrderStatus.AWAITING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
    });

    if (existingOrder) {
      return existingOrder;
    }

    // 2) ساخت order جدید
    return this.orderModel.create({
      userId: cart.userId,
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      totalItems: cart.totalItems,
      finalItemsPrice: cart.finalItemsPrice,
      discountAmount: cart.discountAmount,
      totalPrice: cart.totalPrice,
      couponId: cart.couponId,
      addressId: new Types.ObjectId(addressId),
      status: OrderStatus.AWAITING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      trackingCode: this.generateTrackingCode(),
      meta: {},
    });
  }

  async updateStatus(orderId: string, newStatus: OrderStatus, meta: any = {}) {
    const order = await this.findById(orderId);

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.AWAITING_PAYMENT]: [OrderStatus.CANCELED, OrderStatus.PAID],
      [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.REFUNDED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [], // نهایی است
      [OrderStatus.CANCELED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    const current = order.status;
    const allowed = validTransitions[current] ?? [];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        OrderMessage.InvalidChangeStatus(current, newStatus),
      );
    }

    // آپدیت وضعیت
    order.status = newStatus;

    // ثبت لاگ در meta
    order.meta = {
      ...order.meta,
      history: [
        ...(order.meta.history || []),
        {
          from: current,
          to: newStatus,
          at: new Date(),
          meta,
        },
      ],
    };

    await order.save();

    return order;
  }

  async findById(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException(OrderMessage.Notfound);

    return order;
  }

  async markPaid(orderId: string, paymentMeta: any = {}) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException(OrderMessage.Notfound);

    order.paymentStatus = PaymentStatus.PAID;
    order.status = OrderStatus.PAID;

    order.meta = { ...order.meta, payment: paymentMeta };

    await order.save();

    return order;
  }

  async markProcessing(orderId: string) {
    return this.updateStatus(orderId, OrderStatus.PROCESSING);
  }

  async markShipped(orderId: string, trackingCode: string) {
    return this.updateStatus(orderId, OrderStatus.SHIPPED, { trackingCode });
  }

  async markDelivered(orderId: string) {
    return this.updateStatus(orderId, OrderStatus.DELIVERED);
  }

  async cancel(orderId: string, reason: string) {
    return this.updateStatus(orderId, OrderStatus.CANCELED, { reason });
  }

  async refund(orderId: string, reason: string) {
    const order = await this.updateStatus(orderId, OrderStatus.REFUNDED, {
      reason,
    });

    if (order.status === OrderStatus.REFUNDED) {
      const payment = await this.paymentModel.findOne({
        refId: order.meta.payment.refId,
      });
      if (!payment) throw new NotFoundException(PaymentMessage.Notfound);

      payment.status = PaymentStatus.REFUNDED;

      await payment.save();
    }

    return order;
  }

  private generateTrackingCode() {
    const now = Date.now();
    return `ORD-${now.toString(36).toUpperCase()}`;
  }
}
