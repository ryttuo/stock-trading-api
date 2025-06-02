import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { PrismaModule } from 'src/common/orm/prisma/prisma.module';
import { ReportsCron } from './reports.cron';
import { UsersModule } from 'src/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [PrismaModule, UsersModule, ScheduleModule.forRoot()],
  providers: [ReportsService, ReportsCron],
})
export class ReportsModule {}
