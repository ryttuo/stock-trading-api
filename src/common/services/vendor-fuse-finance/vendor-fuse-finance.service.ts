import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, catchError } from 'rxjs/operators';
import {
  IStockTrading,
  IStockResponse,
  IStockPayload,
  IStockTradingResponse,
} from '../../types/interfaces';
import { Observable, throwError } from 'rxjs';
import { AxiosError } from 'axios';
@Injectable()
export class VendorFuseFinanceService {
  private readonly apiUrl?: string;
  private readonly apiKey?: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('VENDOR_BASE_URL');
    this.apiKey = this.configService.get<string>('VENDOR_API_KEY');
  }

  getStocks(nextToken?: string): Observable<IStockResponse> {
    return this.httpService
      .get<IStockResponse>(`${this.apiUrl}/stocks`, {
        headers: {
          'X-API-KEY': this.apiKey,
        },
        params: {
          nextToken,
        },
      })
      .pipe(
        map((response) => {
          return response.data;
        }),
        catchError((error: AxiosError) => {
          return throwError(() => error);
        }),
      );
  }

  buyStock(payload: IStockTrading): Observable<IStockTradingResponse> {
    const stockPayload: IStockPayload = {
      price: payload.price,
      quantity: payload.quantity,
    };
    return this.httpService
      .post<IStockTradingResponse>(
        `${this.apiUrl}/stocks/${payload.symbol}/buy`,
        stockPayload,
        {
          headers: {
            'X-API-KEY': this.apiKey,
          },
        },
      )
      .pipe(
        map((response) => {
          return response.data;
        }),
        catchError((error: AxiosError) => {
          return throwError(() => error);
        }),
      );
  }
}
