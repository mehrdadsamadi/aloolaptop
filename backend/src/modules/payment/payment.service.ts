import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { Model, Types } from 'mongoose';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentMessage } from '../../common/enums/message.enum';
import { ZarinpalService } from './gateways/zarinpal.service';
import { OrderService } from '../order/order.service';
import { PaymentGateway } from './enums/payment-gateway.enum';

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,

    private readonly orderService: OrderService,
    private readonly zarinpalService: ZarinpalService,

    @Inject(REQUEST) private req: Request,
  ) {}

  async create(orderId: string) {
    const userId = this.req.user?._id;
    const token = this.req.user?.token;

    const order = await this.orderService.findById(orderId);

    const amount = order.totalPrice;

    const zarinpalRes = await this.zarinpalService.requestPayment({
      amount,
      orderId,
      callbackUrl: `${process.env.FRONTEND_URL}/${process.env.GATEWAY_CALLBACK_ENDPOINT}?token=${token}`,
      description: `پرداخت سفارش ${order.trackingCode}`,
    });

    const { authority, fee, gatewayUrl } = zarinpalRes;

    const payment = await this.paymentModel.create({
      orderId: new Types.ObjectId(orderId),
      userId,
      amount,
      gateway: PaymentGateway.ZARINPAL,
      status: PaymentStatus.PENDING,
      authority: authority || null,
      meta: {
        fee,
        gatewayUrl,
      },
    });

    return {
      gatewayUrl,
      paymentId: payment._id,
    };
  }

  async findById(id: string) {
    const p = await this.paymentModel.findById(id);
    if (!p) throw new NotFoundException(PaymentMessage.Notfound);

    return p;
  }

  async findByAuthority(authority: string) {
    const p = await this.paymentModel.findOne({ authority });
    if (!p) throw new NotFoundException(PaymentMessage.Notfound);

    return p;
  }

  async findByRefId(refId: number) {
    const p = await this.paymentModel.findOne({ refId });
    if (!p) throw new NotFoundException(PaymentMessage.Notfound);

    return p;
  }

  async markPaid(paymentId: string, refId: number, meta: any = {}) {
    const payment = await this.findById(paymentId);

    payment.status = PaymentStatus.PAID;
    payment.refId = refId;

    payment.meta = { ...payment.meta, ...meta };

    await payment.save();

    return payment;
  }

  async markFailed(paymentId: string, meta: any = {}) {
    const payment = await this.findById(paymentId);

    payment.status = PaymentStatus.FAILED;
    payment.meta = { ...payment.meta, ...meta };

    await payment.save();

    return payment;
  }
}
