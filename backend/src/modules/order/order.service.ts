import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { FilterQuery, Model, Types } from 'mongoose';
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
import { PaginationDto } from '../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../common/utils/pagination.util';
import {
  FilterOrderDto,
  FilterOrderExportDto,
} from '../../common/dtos/filter.dto';
import {
  ExportFormats,
  ExportOptions,
  ExportService,
} from '../common/services/export/export.service';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    private readonly cartService: CartService,

    private readonly exportService: ExportService,

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

    return {
      message: OrderMessage.ChangedStatus,
      order,
    };
  }

  async findAll({
    paginationDto,
    filter,
  }: {
    paginationDto: PaginationDto;
    filter?: FilterOrderDto;
  }) {
    const { page, limit, skip } = paginationSolver(paginationDto);

    const finalFilter: FilterQuery<OrderDocument> = {};

    if (filter?.status) {
      finalFilter.status = filter.status;
    }

    const count = await this.orderModel.countDocuments(finalFilter);

    const orders = await this.orderModel
      .find(finalFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        { path: 'addressId' },
        { path: 'userId', select: 'profile mobile' },
        { path: 'couponId', select: 'code' },
      ]);

    return {
      orders,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findAllUserOrders({
    paginationDto,
    filter,
  }: {
    paginationDto: PaginationDto;
    filter?: FilterOrderDto;
  }) {
    const userId = this.req.user?._id;

    const { page, limit, skip } = paginationSolver(paginationDto);

    const finalFilter: FilterQuery<OrderDocument> = { userId };

    if (filter?.trackingCode) {
      finalFilter.trackingCode = {
        $regex: filter.trackingCode,
        $options: 'i',
      };
    }

    if (filter?.status) {
      finalFilter.status = filter.status;
    } else {
      delete finalFilter.status;
    }

    const count = await this.orderModel.countDocuments(finalFilter);

    const orders = await this.orderModel
      .find(finalFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        { path: 'addressId' },
        { path: 'userId', select: 'profile mobile' },
        { path: 'couponId', select: 'code' },
      ]);

    return {
      orders,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate([
        { path: 'addressId' },
        { path: 'userId', select: 'profile mobile' },
        { path: 'couponId', select: 'code' },
      ]);

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
    const { order, message } = await this.updateStatus(
      orderId,
      OrderStatus.REFUNDED,
      {
        reason,
      },
    );

    if (order.status === OrderStatus.REFUNDED) {
      const payment = await this.paymentModel.findOne({
        refId: order?.meta?.payment?.refId,
      });
      if (!payment) throw new NotFoundException(PaymentMessage.Notfound);

      payment.status = PaymentStatus.REFUNDED;

      await payment.save();
    }

    return {
      message,
      order,
    };
  }

  async exportOrders(format: ExportFormats, filters: FilterOrderExportDto) {
    const { status } = filters;

    // ۱. دریافت داده‌ها
    const orders = await this.orderModel
      .find({ status })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'addressId' },
        { path: 'userId', select: 'profile mobile' },
        { path: 'couponId', select: 'code' },
      ]);

    // ۲. تعریف ستون‌های خروجی
    const exportOptions: ExportOptions = {
      filename: `orders-report-${new Date().toISOString().split('T')[0]}`,
      title: 'گزارش سفارشات',
      columns: [
        {
          key: '_id',
          title: 'شماره سفارش',
          width: 30,
        },
        {
          key: 'createdAt',
          title: 'تاریخ',
          format: (date) => new Date(date).toLocaleDateString('fa-IR'),
        },
        {
          key: 'userId',
          title: 'نام مشتری',
          format: (user) =>
            `${user?.profile?.firstName} ${user?.profile?.lastName}`,
        },
        {
          key: 'userId.mobile',
          title: 'شماره تماس',
        },
        {
          key: 'totalPrice',
          title: 'مبلغ (تومان)',
          format: (amount) => new Intl.NumberFormat('fa-IR').format(amount),
        },
        {
          key: 'status',
          title: 'وضعیت',
        },
      ],
    };

    // ۴. ایجاد خروجی
    return this.exportService.export(orders, format, exportOptions);
  }

  private generateTrackingCode() {
    const now = Date.now();
    return `ORD-${now.toString(36).toUpperCase()}`;
  }
}
