import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  IStockResponse,
  IStockTradingResponse,
} from '../common/types/interfaces';
import { StockDto } from './stocks.dto';
import { StocksService } from './stocks.service';
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks(
    @Query('nextToken') nextToken?: string,
  ): Promise<IStockResponse> {
    return await this.stocksService.getStocks(nextToken);
  }

  @Post('/buy')
  async buyStock(@Body() payload: StockDto): Promise<IStockTradingResponse> {
    return await this.stocksService.buyStock(payload);
  }
}
