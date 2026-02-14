import { Roles } from '../enums/role.enum';
import { Types } from 'mongoose';

export interface IUserRequestType {
  _id: Types.ObjectId;
  token: string;
  role: Roles;
  mobile: string;
  mobileVerified: boolean;
}
