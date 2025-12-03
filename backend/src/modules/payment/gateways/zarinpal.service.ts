import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import axios from 'axios';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

interface ZarinpalPaymentResponse {
  data: {
    authority: string;
    fee: number;
    code: number;
  };
}

interface ZarinpalVerifyPaymentResponse {
  data: {
    code: number;
    ref_id: number;
    fee: number;
  };
}

type ZarinpalRequestPaymentDto = {
  amount: number;
  description: string;
  callbackUrl: string;
  orderId: string;
};

type ZarinpalVerifyPaymentDto = {
  amount: number;
  authority: string;
};

@Injectable({ scope: Scope.REQUEST })
export class ZarinpalService {
  constructor(@Inject(REQUEST) private req: Request) {}

  async requestPayment({
    amount,
    description,
    callbackUrl,
    orderId,
  }: ZarinpalRequestPaymentDto) {
    const mobile = this.req.user?.mobile;

    const res = await axios.post<ZarinpalPaymentResponse>(
      process.env.ZARINPAL_PAYMENT_REQUEST,
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount,
        currency: 'IRT',
        description,
        callback_url: callbackUrl,
        metadata: { mobile },
        mobile,
        orderId,
      },
    );

    const { code, authority, fee } = res.data.data;

    if (code !== 100)
      throw new BadRequestException(
        'خطا در اتصال به درگاه پرداخت، بار دیگر تلاش کنید',
      );

    const gatewayUrl = process.env.ZARINPAL_GATEWAY_URL + authority;

    return {
      authority,
      fee,
      gatewayUrl,
    };
  }

  async verifyPayment({ amount, authority }: ZarinpalVerifyPaymentDto) {
    const res = await axios.post<ZarinpalVerifyPaymentResponse>(
      process.env.ZARINPAL_VERIFY_PAYMENT_URL,
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount,
        authority,
      },
    );

    const { code, ref_id, fee } = res.data.data;

    return {
      refId: ref_id,
      fee,
      code,
    };
  }
}
