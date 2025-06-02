import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/orm/prisma/prisma.service';
import {
  TRANSACTION_STATUS,
  ITransaction,
  IPortfolio,
  IUser,
} from 'src/common/types/interfaces';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllTransactions(): Promise<ITransaction[]> {
    return await this.prisma.transactions.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPortfolios(userId: string): Promise<IPortfolio[]> {
    return await this.prisma.transactions
      .findMany({
        where: {
          status: TRANSACTION_STATUS.SUCCESS,
          userId: userId,
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

  async getUsers(): Promise<IUser[]> {
    return await this.prisma.users.findMany();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.prisma.users.findUnique({
      where: { email },
    });
  }

  async getTestUser(): Promise<IUser> {
    const email = process.env.USER_EMAIL;
    if (!email) {
      throw new HttpException(
        'USER_EMAIL not found in environment variables',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
