import { Test, TestingModule } from '@nestjs/testing';
import { ReportsCron } from './reports.cron';
import { ReportsService } from './reports.service';
import { PrismaService } from 'src/common/orm/prisma/prisma.service';
import { IUser } from 'src/common/types/interfaces';
import { Logger } from '@nestjs/common';

describe('ReportsCron', () => {
  let service: ReportsCron;
  let reportsService: ReportsService;
  let prismaService: PrismaService;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsCron,
        {
          provide: ReportsService,
          useValue: {
            queueReport: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            users: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReportsCron>(ReportsCron);
    reportsService = module.get<ReportsService>(ReportsService);
    prismaService = module.get<PrismaService>(PrismaService);

    loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('handle should send reports to all users', async () => {
    const mockUsers: IUser[] = [
      {
        id: '1',
        email: 'user1@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        email: 'user2@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const findManySpy = jest
      .spyOn(prismaService.users, 'findMany')
      .mockResolvedValue(mockUsers);
    const queueReportSpy = jest
      .spyOn(reportsService, 'queueReport')
      .mockResolvedValue(undefined);

    await service.handle();

    expect(findManySpy).toHaveBeenCalled();
    expect(queueReportSpy).toHaveBeenCalledTimes(2);
    expect(queueReportSpy).toHaveBeenCalledWith(mockUsers[0]);
    expect(queueReportSpy).toHaveBeenCalledWith(mockUsers[1]);
  });

  it('handle should handle errors when sending reports', async () => {
    const mockUsers: IUser[] = [
      {
        id: '1',
        email: 'user1@example.com',
        password: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const findManySpy = jest
      .spyOn(prismaService.users, 'findMany')
      .mockResolvedValue(mockUsers);
    const queueReportSpy = jest
      .spyOn(reportsService, 'queueReport')
      .mockRejectedValue(new Error('TEST_ERROR: Simulated queue failure'));

    await service.handle();

    expect(findManySpy).toHaveBeenCalled();
    expect(queueReportSpy).toHaveBeenCalledWith(mockUsers[0]);
    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed to queue report for user user1@example.com: TEST_ERROR: Simulated queue failure',
      ),
    );
  });
});
