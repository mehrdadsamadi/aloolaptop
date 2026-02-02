import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { ValidateCouponDto } from '../coupon/dto/coupon.dto';
import { SwaggerConsumes } from '../../common/enums/swagger-consumes.enum';
import { EXAMPLE_CART } from './examples/cart.example';

@Controller('cart')
@ApiTags('Cart')
@AuthDecorator()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiCreatedResponse({
    schema: { example: [EXAMPLE_CART] },
  })
  async getOrCreateCart() {
    return this.cartService.getOrCreateCart();
  }

  @Post('add')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiCreatedResponse({
    schema: { example: [EXAMPLE_CART] },
  })
  async addItem(@Body() addItemDto: AddItemDto) {
    return this.cartService.addItem(addItemDto);
  }

  @Patch('update')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiCreatedResponse({
    schema: { example: [EXAMPLE_CART] },
  })
  async updateQuantity(@Body() updateQuantityDto: UpdateQuantityDto) {
    return this.cartService.updateQuantity(updateQuantityDto);
  }

  @Delete('remove/:itemId')
  @ApiCreatedResponse({
    schema: { example: [EXAMPLE_CART] },
  })
  async removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(itemId);
  }

  @Delete('clear')
  async clear() {
    return this.cartService.clearCart();
  }

  @Post('apply-coupon')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiCreatedResponse({
    schema: { example: [EXAMPLE_CART] },
  })
  async applyCoupon(@Body() validateCouponDto: ValidateCouponDto) {
    return this.cartService.applyCoupon(validateCouponDto);
  }
}
