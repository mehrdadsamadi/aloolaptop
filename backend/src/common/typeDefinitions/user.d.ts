import { IUserRequestType } from '../../modules/user/types/request.type';

declare global {
  namespace Express {
    interface Request {
      user?: IUserRequestType;
    }
  }
}

export {};
