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

export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT_FAILED: 'P2002',
  FOREIGN_KEY_CONSTRAINT_FAILED: 'P2003',
  CONSTRAINT_FAILED: 'P2004',
  INVALID_VALUE: 'P2005',
  RECORD_NOT_FOUND: 'P2025',
  CONNECTED_RECORDS_NOT_FOUND: 'P2018',
  REQUIRED_FIELD_MISSING: 'P2012',
  INVALID_ID: 'P2023',
  INCONSISTENT_COLUMN_DATA: 'P2019',
  INPUT_ERROR: 'P2020',
  TABLE_NOT_FOUND: 'P2021',
  COLUMN_NOT_FOUND: 'P2022',
  TRANSACTION_FAILED: 'P2034',
} as const;

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

export interface IError {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface IPrismaError {
  status: number;
  message: string;
}
