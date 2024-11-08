import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsUUID } from 'class-validator';

export class GetUserInfosDto {
  @Expose() @IsOptional() @IsEmail() email?: string;
  @Expose() @IsUUID('all', { always: true}) userId!: string;

  constructor(init?: Partial<GetUserInfosDto>) {
    Object.assign(this, init);
  }
}
