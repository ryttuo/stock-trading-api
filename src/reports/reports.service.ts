import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/orm/prisma/prisma.service';
import { IUser } from 'src/common/types/interfaces';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ReportsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
    @InjectQueue('reports') private readonly reportsQueue: Queue,
  ) {}

  async sendReport(user: IUser) {
    const report = await this.buildUserReport(user);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Stock Trading Report',
      template: 'daily-report',
      context: {
        report,
      },
    });
    Logger.debug(`Report sent to ${user.email}`);
  }

  async queueReport(user: IUser) {
    await this.reportsQueue.add('send-report', { user });
  }

  async buildUserReport(user: IUser) {
    const summaryResults = await this.prisma.$queryRaw<
      { status: string; count: bigint }[]
    >`
      SELECT status, COUNT(*) AS count
      FROM "Transactions"
      WHERE "userId" = ${user.id}
        AND "createdAt" >= CURRENT_DATE - INTERVAL '1 day'
      GROUP BY status
    `;

    const summary = {
      success: Number(
        summaryResults.find((s) => s.status === 'SUCCESS')?.count || 0,
      ),
      failed: Number(
        summaryResults.find((s) => s.status === 'FAILED')?.count || 0,
      ),
      total: Number(
        summaryResults.reduce((acc, curr) => acc + curr.count, BigInt(0)),
      ),
    };

    const last24Hours = new Date(Date.now() - 86_400_000);
    const items = await this.prisma.transactions.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: last24Hours },
      },
      select: {
        symbol: true,
        price: true,
        quantity: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { summary, items, user };
  }
}
