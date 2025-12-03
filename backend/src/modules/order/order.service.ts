import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { Model } from 'mongoose';
import { CartService } from '../cart/cart.service';
import { CartMessage, OrderMessage } from '../../common/enums/message.enum';
import { OrderStatus } from './enums/order-status.enum';
import { PaymentStatus } from '../payment/enums/payment-status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,

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
      addressId,
      status: OrderStatus.AWAITING_PAYMENT,
      paymentStatus: PaymentStatus.PENDING,
      trackingCode: this.generateTrackingCode(),
      meta: {},
    });
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

  private generateTrackingCode() {
    const now = Date.now();
    return `ORD-${now.toString(36).toUpperCase()}`;
  }
}
