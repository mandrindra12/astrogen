import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class GetUserInfosDto {
  // @Expose() @IsOptional() @IsEmail() email?: string;
  @Expose() @IsUUID('all', { always: true}) userId!: string;

  constructor(init?: Partial<GetUserInfosDto>) {
    Object.assign(this, init);
  }
}
