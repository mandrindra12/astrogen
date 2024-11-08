import { Expose } from 'class-transformer';
import { UserEntity } from '../../users/entities/user.entity';

export class AuthEntity extends UserEntity {
  @Expose() error: boolean = false;
  @Expose() errorMessage?: string;
}
