import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../common/orm/prisma/prisma.service';
import { VendorFuseFinanceService } from '../common/services/vendor-fuse-finance/vendor-fuse-finance.service';
import {
  IStockResponse,
  IStockTrading,
  IStockTradingResponse,
  ITransaction,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from '../common/types/interfaces';
import { UsersService } from '../users/users.service';
@Injectable()
export class StocksService {
  constructor(
    private readonly vendorFuseFinanceService: VendorFuseFinanceService,
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getStocks(nextToken?: string): Promise<IStockResponse> {
    return await firstValueFrom(
      this.vendorFuseFinanceService.getStocks(nextToken),
    );
  }

  async buyStock(payload: IStockTrading): Promise<IStockTradingResponse> {
    const user = await this.usersService.getTestUser();

    try {
      const response = await firstValueFrom(
        this.vendorFuseFinanceService.buyStock(payload),
      );

      const transaction: ITransaction = {
        userId: user.id,
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
      response.status = HttpStatus.CREATED;
      return response;
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response?.status === HttpStatus.BAD_REQUEST &&
        error.response?.data.message === 'Price validation failed'
      ) {
        const failedTransaction: ITransaction = {
          userId: user.id,
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
