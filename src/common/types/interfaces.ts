export const TRANSACTION_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];

export const TRANSACTION_TYPE = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;

export type TransactionType =
  (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export interface IStock {
  lastUpdated: string;
  change: number;
  price: number;
  name: string;
  sector: string;
  symbol: string;
}

export interface IStockResponse {
  status: string;
  data: {
    items: IStock[];
    nextToken: string;
  };
}
export interface IStockPayload {
  price: number;
  quantity: number;
}

export interface IStockTrading extends IStockPayload {
  symbol: string;
}

export interface IStockTradingResponse {
  status: number;
  message: string;
  data: {
    order: {
      symbol: string;
      quantity: number;
      price: number;
      total: number;
    };
  };
}

export interface IPortfolio {
  symbol: string;
  quantity: number;
  total: number;
}

export interface ITransaction extends IPortfolio {
  userId: string;
  status: TransactionStatus;
  price: number;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}
