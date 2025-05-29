import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { VendorFuseFinanceService } from '../common/services/vendor-fuse-finance/vendor-fuse-finance.service';
import {
  IStockResponse,
  IStockTrading,
  IStockTradingResponse,
} from '../common/types/interfaces';
@Injectable()
export class StocksService {
  constructor(
    private readonly vendorFuseFinanceService: VendorFuseFinanceService,
  ) {}

  async getStocks(nextToken?: string): Promise<IStockResponse> {
    return await firstValueFrom(
      this.vendorFuseFinanceService.getStocks(nextToken),
    );
  }

  async buyStock(payload: IStockTrading): Promise<IStockTradingResponse> {
    return await firstValueFrom(
      this.vendorFuseFinanceService.buyStock(payload),
    );
  }
}
