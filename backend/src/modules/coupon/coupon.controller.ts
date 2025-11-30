import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CanAccess } from '../../common/decorators/role.decorator';
import { Roles } from '../../common/enums/role.enum';
import { CreateCouponDto } from './dto/coupon.dto';
import { SwaggerConsumes } from '../../common/enums/swagger-consumes.enum';
import { EXAMPLE_COUPON, EXAMPLE_COUPON_CART } from './examples/coupon.example';

@Controller('coupon')
@ApiTags('Coupon')
@AuthDecorator()
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @CanAccess(Roles.ADMIN)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @ApiCreatedResponse({
    schema: { example: [EXAMPLE_COUPON, EXAMPLE_COUPON_CART] },
  })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @Pagination()
  @CanAccess(Roles.ADMIN)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.couponService.findAll(paginationDto);
  }

  @Get(':code')
  @CanAccess(Roles.ADMIN)
  findByCode(@Param('code') code: string) {
    return this.couponService.findByCode(code);
  }
}
