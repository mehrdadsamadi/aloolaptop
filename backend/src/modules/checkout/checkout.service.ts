import { Injectable } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { OrderService } from '../order/order.service';
import { ZarinpalService } from '../payment/gateways/zarinpal.service';
import { CheckoutMessage } from '../../common/enums/message.enum';
import { CartService } from '../cart/cart.service';
import { CouponService } from '../coupon/coupon.service';
import { StartCheckoutDto, VerifyCheckoutDto } from './dto/checkout.dto';
import { VerifyStatus } from './enums/verify-status.enum';
import { ProductService } from '../product/product.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly cartService: CartService,
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
    private readonly couponService: CouponService,
    private readonly productService: ProductService,
    private readonly zarinpalService: ZarinpalService,

    @InjectConnection() private readonly connection: Connection,
  ) {}

  async startCheckout(startCheckoutDto: StartCheckoutDto) {
    // چک کردن عوض نشدن قیمت ها
    const result = await this.cartService.validateCart();

    if (result.updated) {
      return result;
    }

    const { addressId } = startCheckoutDto;

    // قیمت‌ها تایید شده → ساخت سفارش
    const order = await this.orderService.createFromCart(addressId);

    return this.paymentService.create(order._id.toString());
  }

  async verify(verifyCheckoutDto: VerifyCheckoutDto) {
    const { authority, status } = verifyCheckoutDto;

    const payment = await this.paymentService.findByAuthority(authority);
    const order = await this.orderService.findById(payment.orderId.toString());

    if (status !== VerifyStatus.OK) {
      await this.paymentService.markFailed(payment._id.toString(), { status });

      return {
        success: false,
        message: CheckoutMessage.Failed,
        gatewayUrl: payment.meta?.gatewayUrl,
      };
    }

    // verify از زرین پال
    const verify = await this.zarinpalService.verifyPayment({
      amount: payment.amount,
      authority,
    });

    const { refId, code } = verify;

    if (code !== 100 && code !== 101) {
      await this.paymentService.markFailed(payment._id.toString(), { verify });

      return {
        success: false,
        message: CheckoutMessage.VerifyFailed,
      };
    }

    // موفق
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      await this.paymentService.markPaid(payment._id.toString(), refId, verify);
      await this.orderService.markPaid(order._id.toString(), verify);

      // کاهش موجودی + خالی کردن سبد خرید
      await this.cartService.clearCart();

      // کاهش تعداد محصول
      for (const item of order.items) {
        await this.productService.decreaseStock(
          item.productId.toString(),
          item.quantity,
        );
      }

      // درصورت وجود تخفیف، یکی به تخفیف اضافه کن
      if (order.couponId) {
        const coupon = await this.couponService.findById(
          order.couponId.toString(),
        );

        await this.couponService.increaseUsage(coupon.code);
      }

      await session.commitTransaction();
      await session.endSession();

      return {
        success: true,
        message: CheckoutMessage.Verify,
        trackingCode: order.trackingCode,
      };
    } catch (error) {
      console.log('error', error);
      await session.abortTransaction();
      await session.endSession();

      await this.paymentService.markFailed(payment._id.toString(), {
        verify,
      });

      return {
        success: false,
        message: CheckoutMessage.VerifyFailed,
      };
    }
  }
}
