import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StocksModule } from './stocks/stocks.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AxiosRetryModule } from './common/http/axios-retry/axios-retry.module';
import { AppMailerModule } from './common/mail/app-mailer/app-mailer.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AxiosRetryModule,
    StocksModule,
    UsersModule,
    AppMailerModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
