import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('transactions')
  async getAllTransactions(): Promise<any> {
    return await this.usersService.getAllTransactions();
  }

  @Get('portfolios')
  async getPortfolios(): Promise<any> {
    return await this.usersService.getPortfolios();
  }
}
