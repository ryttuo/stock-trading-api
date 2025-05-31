import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { VendorFuseFinanceService } from '../common/services/vendor-fuse-finance/vendor-fuse-finance.service';
import { PrismaService } from '../common/orm/prisma/prisma.service';
import {
  IStockResponse,
  IStockTrading,
  IStockTradingResponse,
  ITransaction,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from '../common/types/interfaces';
import { AxiosError } from 'axios';
@Injectable()
export class StocksService {
  constructor(
    private readonly vendorFuseFinanceService: VendorFuseFinanceService,
    private readonly prisma: PrismaService,
  ) {}

  async getStocks(nextToken?: string): Promise<IStockResponse> {
    return await firstValueFrom(
      this.vendorFuseFinanceService.getStocks(nextToken),
    );
  }

  async buyStock(payload: IStockTrading): Promise<IStockTradingResponse> {
    try {
      const response = await firstValueFrom(
        this.vendorFuseFinanceService.buyStock(payload),
      );

      const transaction: ITransaction = {
        userId: '1',
        status:
          response.status === 200
            ? TRANSACTION_STATUS.SUCCESS
            : TRANSACTION_STATUS.FAILED,
        quantity: response.data.order.quantity,
        price: response.data.order.price,
        total: response.data.order.total,
        symbol: response.data.order.symbol,
        type: TRANSACTION_TYPE.BUY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.createTransaction(transaction);
      return response;
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response?.status === 400 &&
        error.response?.data.message === 'Price validation failed'
      ) {
        const failedTransaction: ITransaction = {
          userId: '1', // TODO TMP HARDCODE
          status: TRANSACTION_STATUS.FAILED,
          quantity: payload.quantity,
          price: payload.price,
          total: payload.price * payload.quantity,
          symbol: payload.symbol,
          type: TRANSACTION_TYPE.BUY,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await this.createTransaction(failedTransaction);
        throw new HttpException(
          error.response?.data?.message || error.message,
          error.response?.status,
        );
      }

      throw error;
    }
  }

  private async createTransaction(transaction: ITransaction): Promise<void> {
    return;
    const { symbol, quantity, price, total, status, type, userId } =
      transaction;
    await this.prisma.transactions.create({
      data: {
        symbol,
        quantity,
        price,
        total,
        status,
        type,
        userId,
      },
    });
  }
}
