import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStockTradingApi(): string {
    return 'Stock Trading API';
  }
}
