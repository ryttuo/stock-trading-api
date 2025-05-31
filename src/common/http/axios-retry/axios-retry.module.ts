import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import axiosRetry from 'axios-retry';
import { HttpService } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const httpService = new HttpService();

        axiosRetry(httpService.axiosRef, {
          retries: 3,
          retryDelay: (retryCount) => {
            return retryCount * 1000;
          },
          retryCondition: (error) => {
            return !!(
              axiosRetry.isNetworkOrIdempotentRequestError(error) ||
              (error.response?.status && error.response?.status >= 500)
            );
          },
        });

        return {
          timeout: 5000,
          maxRedirects: 5,
        };
      },
    }),
  ],
  exports: [HttpModule],
})
export class AxiosRetryModule {}
