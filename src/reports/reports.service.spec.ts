import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/common/orm/prisma/prisma.service';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { IUser } from 'src/common/types/interfaces';

describe('ReportsService', () => {
  let service: ReportsService;
  let mailerService: MailerService;
  let reportsQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
            transactions: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: getQueueToken('reports'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    mailerService = module.get<MailerService>(MailerService);
    reportsQueue = module.get<Queue>(getQueueToken('reports'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sendReport should send a report to a user', async () => {
    const mockUser: IUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockReport = {
      summary: { success: 1, failed: 0, total: 1 },
      items: [],
      user: mockUser,
    };

    const buildUserReportSpy = jest
      .spyOn(service as any, 'buildUserReport')
      .mockResolvedValue(mockReport);
    const sendMailSpy = jest
      .spyOn(mailerService, 'sendMail')
      .mockResolvedValue(undefined);

    await service.sendReport(mockUser);

    expect(sendMailSpy).toHaveBeenCalledWith({
      to: mockUser.email,
      subject: 'Stock Trading Report',
      template: 'daily-report',
      context: {
        report: mockReport,
      },
    });
  });

  it('queueReport should add a job to the queue', async () => {
    const mockUser: IUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const addSpy = jest
      .spyOn(reportsQueue, 'add')
      .mockResolvedValue({} as any);

    await service.queueReport(mockUser);

    expect(addSpy).toHaveBeenCalledWith('send-report', {
      user: mockUser,
    });
  });
});
