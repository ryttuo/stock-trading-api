import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportsService } from './reports.service';
import { PrismaService } from 'src/common/orm/prisma/prisma.service';

@Injectable()
export class ReportsCron {
  private readonly logger = new Logger(ReportsCron.name);

  constructor(
    private readonly reports: ReportsService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(process.env.CRON_RUN || CronExpression.EVERY_DAY_AT_5PM)
  async handle() {
    this.logger.log('Starting daily reports cron job');

    const users = await this.prisma.users.findMany();

    this.logger.log(`Found ${users.length} active users to process`);

    for (const user of users) {
      try {
        await this.reports.queueReport(user);
        this.logger.log(`Queued report for user ${user.email}`);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `Failed to queue report for user ${user.email}: ${errorMessage}`,
        );
      }
    }

    this.logger.log('Completed daily reports cron job');
  }
}
