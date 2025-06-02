import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { IPortfolio, ITransaction } from 'src/common/types/interfaces';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('transactions')
  async getAllTransactions(): Promise<ITransaction[]> {
    return await this.usersService.getAllTransactions();
  }

  @Get('portfolios')
  async getPortfolios(): Promise<IPortfolio[]> {
    const user = await this.usersService.getTestUser();
    return await this.usersService.getPortfolios(user.id);
  }
}
