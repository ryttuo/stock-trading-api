import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

describe('StocksController', () => {
  let controller: StocksController;
  let stocksService: StocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [
        {
          provide: StocksService,
          useValue: {
            getStocks: jest.fn(),
            buyStock: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StocksController>(StocksController);
    stocksService = module.get<StocksService>(StocksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
