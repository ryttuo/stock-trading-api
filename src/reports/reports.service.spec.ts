import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from 'src/common/orm/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/common/types/interfaces';

describe('ReportsService', () => {
  let service: ReportsService;
  let mailerService: MailerService;

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
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendReport', () => {
    it('should send a report to a user', async () => {
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

      jest
        .spyOn(service, 'buildUserReport')
        .mockResolvedValue(mockReport);
      const sendMailSpy = jest
        .spyOn(mailerService, 'sendMail')
        .mockResolvedValue(undefined);

      await service.sendReport(mockUser);

      expect(sendMailSpy).toHaveBeenCalledWith({
        to: mockUser.email,
        subject: 'Stock Trading Report',
        template: 'daily-report',
        context: { report: mockReport },
      });
    });
  });
});
