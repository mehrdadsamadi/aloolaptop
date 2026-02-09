import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Coupon, CouponDocument } from '../coupon/schema/coupon.schema';
import { DiscountMethod } from '../coupon/enums/discount-method.enum';
import { CouponType } from '../coupon/enums/coupon-type.enum';
import {
  CartMessage,
  CouponMessage,
  ProductMessage,
} from '../../common/enums/message.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AddItemDto } from './dto/add-item.dto';
import { ProductService } from '../product/product.service';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { ValidateCouponDto } from '../coupon/dto/coupon.dto';
import { CartItemDocument } from './schemas/cart-item.schema';

@Injectable({ scope: Scope.REQUEST })
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,

    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,

    private readonly productService: ProductService,

    @Inject(REQUEST) private req: Request,
  ) {}

  async getOrCreateCart() {
    const userId = this.req.user?._id;

    let cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      cart = await this.cartModel.create({
        userId,
        items: [],
        totalItems: 0,
        totalQuantity: 0,
        finalItemsPrice: 0,
        discountAmount: 0,
        totalPrice: 0,
        couponId: null,
      });
    }

    return cart;
  }

  async addItem(addItemDto: AddItemDto) {
    const { productId, quantity = 1 } = addItemDto;

    const product = await this.productService.findById(productId);

    if (quantity > product.stock) {
      throw new BadRequestException(CartMessage.MoreThanStock);
    }

    const cart = await this.getOrCreateCart();

    const existingItem = cart.items.find(
      (it) => it.productId.toString() === product._id.toString(),
    );

    if (existingItem) {
      // بررسی صحیح: مجموع تعداد قدیم و جدید نباید از موجودی بیشتر شود
      const newTotalQuantity = existingItem.quantity + quantity;

      if (newTotalQuantity > product.stock) {
        throw new BadRequestException(CartMessage.MoreThanStock);
      }

      existingItem.quantity += quantity;
      existingItem.totalPrice =
        existingItem.quantity * existingItem.finalUnitPrice;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        image: product.images[0].url,
        unitPrice: product.price,
        discountPercent: product.discountPercent,
        discountExpiresAt: product.discountExpiresAt,
        finalUnitPrice: product.finalPrice,
        quantity,
        stock: product.stock,
        totalPrice: quantity * product.finalPrice,
      });
    }

    this.invalidateCoupon(cart);
    this.recalculate(cart);

    await cart.save();

    return {
      message: CartMessage.Added,
      cart,
    };
  }

  async updateQuantity(updateQuantityDto: UpdateQuantityDto) {
    const { productId, quantity } = updateQuantityDto;

    const cart = await this.getOrCreateCart();

    const item = cart.items.find(
      (i) => i.productId.toString() === productId.toString(),
    );

    if (!item) {
      throw new NotFoundException(CartMessage.NotfoundItem);
    }

    // اگر مقدار 0 شد محصول حذف می‌شود
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId.toString(),
      );
    } else {
      item.quantity = quantity;
      item.totalPrice = item.finalUnitPrice * quantity; // یا unitPrice * quantity براساس نیاز
    }

    this.invalidateCoupon(cart);
    this.recalculate(cart);

    await cart.save();

    return {
      message: CartMessage.Updated,
      cart,
    };
  }

  async validateCart() {
    const userId = this.req.user?._id;

    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException(CartMessage.Notfound);
    if (cart.totalPrice < 1000)
      throw new BadRequestException(CartMessage.Empty);

    let priceChanged = false;

    for (const item of cart.items) {
      const product = await this.productService.findById(
        item.productId.toString(),
      );
      if (!product) throw new BadRequestException(ProductMessage.Notfound);

      if (product.stock < item.quantity)
        throw new BadRequestException(
          ProductMessage.OutOfStockByName(product.name),
        );

      const finalUnitPrice = product.finalPrice;

      if (finalUnitPrice !== item.finalUnitPrice) {
        item.unitPrice = product.price;
        item.discountPercent = product.discountPercent;
        item.finalUnitPrice = finalUnitPrice;
        item.totalPrice = item.quantity * finalUnitPrice;
        priceChanged = true;
      }
    }

    if (priceChanged) {
      cart.finalItemsPrice = cart.items.reduce(
        (sum, i) => sum + i.totalPrice,
        0,
      );
      cart.totalPrice = cart.finalItemsPrice - cart.discountAmount;

      await cart.save();

      return {
        updated: true,
        message: CartMessage.InvalidCartItemsPrice,
        cart,
      };
    }

    return { updated: false, cart };
  }

  async clearCart() {
    const cart = await this.getOrCreateCart();

    cart.items = [];
    cart.totalItems = 0;
    cart.totalQuantity = 0;
    cart.totalPrice = 0;

    // حتما کوپن رو هم پاک کن
    this.invalidateCoupon(cart);
    this.recalculate(cart); // اینجا finalPayableAmount به درستی خواهد شد (۰)

    await cart.save();

    return {
      message: CartMessage.Clear,
      cart,
    };
  }

  async removeItem(itemId: string) {
    const cart = await this.getOrCreateCart();

    cart.items = cart.items.filter(
      (item: CartItemDocument) => item._id.toString() !== itemId,
    );

    this.invalidateCoupon(cart);
    this.recalculate(cart);

    await cart.save();

    return {
      message: CartMessage.Deleted,
      cart,
    };
  }

  async applyCoupon(validateCouponDto: ValidateCouponDto) {
    const { code } = validateCouponDto;

    const cart = await this.getOrCreateCart();

    const coupon = await this.couponModel.findOne({ code });

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException(CouponMessage.Invalid);
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new BadRequestException(CouponMessage.Expire);
    }

    if (coupon.maxUses > 0 && coupon.usesCount >= coupon.maxUses) {
      throw new BadRequestException(CouponMessage.UsageLimit);
    }

    let discount = 0;

    // ♦ کوپن روی سبد (CART)
    if (coupon.type === CouponType.CART) {
      if (
        coupon.minOrderAmount &&
        coupon.minOrderAmount > 0 &&
        cart.finalItemsPrice < coupon.minOrderAmount
      ) {
        throw new BadRequestException(CouponMessage.MinimumOrder);
      }

      discount = this.calculateDiscount(cart.finalItemsPrice, coupon);
    }
    // ♦ کوپن روی محصول (PRODUCT)
    else if (
      coupon.type === CouponType.PRODUCT &&
      coupon.productIds &&
      coupon.productIds.length > 0
    ) {
      const applicableItems = cart.items.filter((item) =>
        coupon.productIds!.some(
          (pid) => pid.toString() === item.productId.toString(),
        ),
      );

      if (applicableItems.length === 0) {
        throw new BadRequestException(CouponMessage.CannotApplied);
      }

      const productTotal = applicableItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
      discount = this.calculateDiscount(productTotal, coupon);
    }

    // ذخیره در سبد
    cart.couponId = coupon._id;
    cart.discountAmount = discount;

    this.recalculate(cart);

    await cart.save();

    return {
      message: CartMessage.ApplyCoupon,
      cart,
    };
  }

  private invalidateCoupon(cart: CartDocument) {
    cart.couponId = null;
    cart.discountAmount = 0;
    cart.totalPrice = cart.finalItemsPrice;
  }

  private recalculate(cart: CartDocument) {
    cart.totalItems = cart.items.length;

    cart.totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    cart.finalItemsPrice = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    cart.totalPrice = cart.finalItemsPrice - cart.discountAmount;
  }

  private calculateDiscount(amount: number, coupon: CouponDocument) {
    if (coupon.method === DiscountMethod.PERCENT) {
      return Math.round((amount * coupon.value) / 100);
    }

    if (coupon.method === DiscountMethod.AMOUNT) {
      return Math.min(amount, coupon.value);
    }

    return 0;
  }
}
