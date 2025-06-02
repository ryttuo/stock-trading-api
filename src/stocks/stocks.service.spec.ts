import { Test, TestingModule } from '@nestjs/testing';
import { StocksService } from './stocks.service';
import { VendorFuseFinanceService } from '../common/services/vendor-fuse-finance/vendor-fuse-finance.service';
import { PrismaService } from 'src/common/orm/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

describe('StocksService', () => {
  let service: StocksService;
  let vendorFuseFinanceService: VendorFuseFinanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        {
          provide: VendorFuseFinanceService,
          useValue: {
            getStocks: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            transactions: {
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            $queryRaw: jest.fn(),
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

    service = module.get<StocksService>(StocksService);
    vendorFuseFinanceService = module.get<VendorFuseFinanceService>(VendorFuseFinanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
