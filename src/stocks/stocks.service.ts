import { Injectable } from '@nestjs/common';

@Injectable()
export class StocksService {
  getStocks() {
    return 'Stocks data 🛜';
  }
}
