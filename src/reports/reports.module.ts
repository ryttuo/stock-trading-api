import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ReportsService } from './reports.service';
import { ReportsCron } from './reports.cron';
import { ReportsProcessor } from './reports.processor';
import { ScheduleModule } from '@nestjs/schedule';
import { bullConfig } from 'src/common/config/bullmq.config';
import { PrismaService } from 'src/common/orm/prisma/prisma.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRoot(bullConfig),
    BullModule.registerQueue({
      name: 'reports',
    }),
  ],
  providers: [ReportsService, ReportsCron, ReportsProcessor, PrismaService],
})
export class ReportsModule {}
