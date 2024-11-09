import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID
} from 'class-validator';
import { ComsOrderEnum } from '../../enums/coms-order.enum';

export class GetComsDto {
  @IsUUID() postId!: string;
  @IsNumber() currentPage!: number;
  @IsNumber() @IsPositive() perPage!: number;
  @IsString() files?: string;
  @IsOptional() @IsNotEmpty() comsOrder: ComsOrderEnum = ComsOrderEnum.ALL;
  @IsOptional() asc: boolean = true;
}
