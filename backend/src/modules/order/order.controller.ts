import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { OrderService } from './order.service';
import { CanAccess } from '../../common/decorators/role.decorator';
import { Roles } from '../../common/enums/role.enum';
import {
  ChangeToCanceledOrRefundDto,
  ChangeToShippedDto,
} from './dto/change-status.dto';
import { SwaggerConsumes } from '../../common/enums/swagger-consumes.enum';

@Controller('order')
@ApiTags('Order')
@AuthDecorator()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Patch(':id/processing')
  @CanAccess(Roles.ADMIN)
  markProcessing(@Param('id') id: string) {
    return this.orderService.markProcessing(id);
  }

  @Patch(':id/shipped')
  @CanAccess(Roles.ADMIN)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  markShipped(
    @Param('id') id: string,
    @Body() changeToShippedDto: ChangeToShippedDto,
  ) {
    return this.orderService.markShipped(id, changeToShippedDto.trackingCode);
  }

  @Patch(':id/delivered')
  @CanAccess(Roles.ADMIN)
  markDelivered(@Param('id') id: string) {
    return this.orderService.markDelivered(id);
  }

  @Patch(':id/cancel')
  @CanAccess(Roles.ADMIN)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  cancel(
    @Param('id') id: string,
    @Body() changeToCanceledOrRefundDto: ChangeToCanceledOrRefundDto,
  ) {
    return this.orderService.cancel(id, changeToCanceledOrRefundDto.reason);
  }

  @Patch(':id/refund')
  @CanAccess(Roles.ADMIN)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  refund(
    @Param('id') id: string,
    @Body() changeToCanceledOrRefundDto: ChangeToCanceledOrRefundDto,
  ) {
    return this.orderService.refund(id, changeToCanceledOrRefundDto.reason);
  }
}
