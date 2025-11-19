import { IUserRequestType } from '../types/request.type';

declare global {
  namespace Express {
    interface Request {
      user?: IUserRequestType;
    }
  }
}

export {};
