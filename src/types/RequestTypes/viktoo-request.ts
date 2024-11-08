import { Request } from 'express';
import { ViktooReqUser } from './viktoo-req-user';

export interface ViktooRequest extends Omit<Request, 'user'> {
  user?: ViktooReqUser | undefined | null;
}
