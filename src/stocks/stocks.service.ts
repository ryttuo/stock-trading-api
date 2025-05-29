import { Injectable } from '@nestjs/common';
import { VendorFuseFinanceService } from '../common/services/vendor-fuse-finance/vendor-fuse-finance.service';
@Injectable()
export class StocksService {
  constructor(
    private readonly vendorFuseFinanceService: VendorFuseFinanceService,
  ) {}

  getStocks(nextToken?: string) {
    return this.vendorFuseFinanceService.getStocks(nextToken);
  }
}
