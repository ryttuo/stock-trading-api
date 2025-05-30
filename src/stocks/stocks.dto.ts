import { IsInt, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
export class StockDto {
  @IsString()
  symbol: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  quantity: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price: number;
}
