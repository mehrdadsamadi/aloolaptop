// statistics.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { StatisticsService } from './statistic.service';
import { CanAccess } from '../../common/decorators/role.decorator';
import { Roles } from '../../common/enums/role.enum';

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
}
