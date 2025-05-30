import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/orm/prisma/prisma.service';
import {
  TRANSACTION_STATUS,
  ITransaction,
  IPortfolio,
} from 'src/common/types/interfaces';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllTransactions(): Promise<ITransaction[]> {
    return await this.prisma.transactions.findMany();
  }

  async getPortfolios(): Promise<IPortfolio[]> {
    return await this.prisma.transactions
      .findMany({
        where: {
          status: TRANSACTION_STATUS.SUCCESS,
        },
        select: {
          symbol: true,
          quantity: true,
          total: true,
        },
        orderBy: {
          symbol: 'asc',
        },
      })
      .then((transactions: IPortfolio[]) => {
        const portfolios = transactions.reduce(
          (acc: IPortfolio[], transaction: IPortfolio) => {
            const existing = acc.find(
              (item: IPortfolio) => item.symbol === transaction.symbol,
            );
            if (existing) {
              existing.quantity += transaction.quantity;
              existing.total += transaction.total;
            } else {
              acc.push({
                symbol: transaction.symbol,
                quantity: transaction.quantity,
                total: transaction.total,
              });
            }
            return acc;
          },
          [],
        );
        return portfolios;
      });
  }
}
