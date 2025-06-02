import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { VendorFuseFinanceService } from '../common/services/vendor-fuse-finance/vendor-fuse-finance.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../common/orm/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [HttpModule, PrismaModule, UsersModule],
  providers: [StocksService, VendorFuseFinanceService],
  controllers: [StocksController],
})
export class StocksModule {}
