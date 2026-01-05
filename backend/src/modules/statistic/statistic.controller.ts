// statistics.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { StatisticsService } from './statistic.service';
import { CanAccess } from '../../common/decorators/role.decorator';
import { Roles } from '../../common/enums/role.enum';
import { FilterTopSellingProducts } from '../../common/decorators/filter.decorator';
import { FilterTopSellingProductsDto } from '../../common/dtos/filter.dto';

@Controller('statistics')
@ApiTags('Statistics')
@AuthDecorator()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('users')
  @CanAccess(Roles.ADMIN)
  async getUserStats() {
    return this.statisticsService.getUserStatistics();
  }

  @Get('products')
  async getProductStats() {
    return this.statisticsService.getProductStatistics();
  }

  @Get('orders')
  async getOrderStats() {
    return this.statisticsService.getOrderStatistics();
  }

  @Get('payments')
  async getPaymentStats() {
    return this.statisticsService.getPaymentStatistics();
  }

  @Get('top-selling-products')
  @CanAccess(Roles.ADMIN)
  @FilterTopSellingProducts()
  getTopSellingProducts(@Query() filterDto: FilterTopSellingProductsDto) {
    return this.statisticsService.getTopSellingProducts(filterDto);
  }
}
