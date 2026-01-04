import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/modules/user.module';
import { StatisticsController } from './statistic.controller';
import { StatisticsService } from './statistic.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
