import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportsService } from './reports.service';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/common/types/interfaces';

@Injectable()
export class ReportsCron {
  constructor(
    private readonly reports: ReportsService,
    private readonly usersService: UsersService,
  ) {}

  @Cron(process.env.CRON_RUN || CronExpression.EVERY_DAY_AT_10AM)
  async handle() {
    const users: IUser[] = await this.usersService.getUsers();
    for (const user of users) {
      try {
        await this.reports.sendReport(user);
        console.log(`🔥 Sending report to ${user.email}`);
      } catch (e) {
        console.error(`Failed to mail ${user.email}`, e);
      }
    }
  }
}
