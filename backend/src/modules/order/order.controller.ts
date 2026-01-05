import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
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
import { Pagination } from '../../common/decorators/pagination.decorator';
import {
  FilterOrder,
  FilterOrderExport,
} from '../../common/decorators/filter.decorator';
import {
  FilterOrderDto,
  FilterOrderExportDto,
} from '../../common/dtos/filter.dto';
import { extractFilters } from '../../common/utils/functions.util';
import { Response } from 'express';

@Controller('orders')
@ApiTags('Orders')
@AuthDecorator()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Pagination()
  @CanAccess(Roles.ADMIN)
  @FilterOrder()
  findAll(@Query() filterDto: FilterOrderDto) {
    const { paginationDto, filter } = extractFilters(filterDto);

    return this.orderService.findAll({ paginationDto, filter });
  }

  @Get('export')
  @CanAccess(Roles.ADMIN)
  @FilterOrderExport()
  async exportOrders(
    @Query() filterDto: FilterOrderExportDto,
    @Res() res: Response,
  ) {
    const { format } = filterDto;

    const result = await this.orderService.exportOrders(format, filterDto);

    // ارسال فایل به کاربر
    const contentType = {
      excel:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
      pdf: 'application/pdf',
    }[format];

    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result?.filename}"`,
    );
    res.send(result?.buffer);
  }

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

  @Patch(':id/canceled')
  @CanAccess(Roles.ADMIN)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  cancel(
    @Param('id') id: string,
    @Body() changeToCanceledOrRefundDto: ChangeToCanceledOrRefundDto,
  ) {
    return this.orderService.cancel(id, changeToCanceledOrRefundDto.reason);
  }

  @Patch(':id/refunded')
  @CanAccess(Roles.ADMIN)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  refund(
    @Param('id') id: string,
    @Body() changeToCanceledOrRefundDto: ChangeToCanceledOrRefundDto,
  ) {
    return this.orderService.refund(id, changeToCanceledOrRefundDto.reason);
  }
}
