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
