import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IStockTrading } from 'src/common/types/interfaces';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  async getStocks(@Query('nextToken') nextToken?: string) {
    return await this.stocksService.getStocks(nextToken);
  }

  @Post('/buy')
  async buyStock(@Body() payload: IStockTrading) {
    return await this.stocksService.buyStock(payload);
  }
}
