import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ReportsService } from './reports.service';
import { IUser } from 'src/common/types/interfaces';

@Processor('reports')
export class ReportsProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportsProcessor.name);

  constructor(private readonly reportsService: ReportsService) {
    super();
  }

  async process(job: Job<{ user: IUser }>): Promise<void> {
    this.logger.debug(
      `Processing report job ${job.id} for user ${job.data.user.email}`,
    );
    await this.reportsService.sendReport(job.data.user);
    this.logger.debug(`Completed report job ${job.id}`);
  }
}
