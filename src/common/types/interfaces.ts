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
