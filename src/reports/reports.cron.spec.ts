import { Test, TestingModule } from '@nestjs/testing';
import { ReportsCron } from './reports.cron';
import { ReportsService } from './reports.service';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/common/types/interfaces';

describe('ReportsCron', () => {
  let service: ReportsCron;
  let reportsService: ReportsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsCron,
        {
          provide: ReportsService,
          useValue: {
            sendReport: jest.fn(),
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

    service = module.get<ReportsCron>(ReportsCron);
    reportsService = module.get<ReportsService>(ReportsService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    it('should send reports to all users', async () => {
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

      jest.spyOn(usersService, 'getUsers').mockResolvedValue(mockUsers);
      const sendReportSpy = jest
        .spyOn(reportsService, 'sendReport')
        .mockResolvedValue(undefined);

      await service.handle();

      expect(usersService.getUsers).toHaveBeenCalled();
      expect(sendReportSpy).toHaveBeenCalledTimes(2);
      expect(sendReportSpy).toHaveBeenCalledWith(mockUsers[0]);
      expect(sendReportSpy).toHaveBeenCalledWith(mockUsers[1]);
    });

    it('should handle errors when sending reports', async () => {
      const mockUsers: IUser[] = [
        {
          id: '1',
          email: 'user1@example.com',
          password: 'hashed_password',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(usersService, 'getUsers').mockResolvedValue(mockUsers);
      jest
        .spyOn(reportsService, 'sendReport')
        .mockRejectedValue(new Error('Failed to send report'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.handle();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to mail user1@example.com',
        expect.any(Error),
      );
    });
  });
}); 