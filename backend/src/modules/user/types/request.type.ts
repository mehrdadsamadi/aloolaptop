import { Roles } from '../../../common/enums/role.enum';
import { Types } from 'mongoose';

export interface IUserRequestType {
  _id: Types.ObjectId;
  role: Roles;
  mobile: string;
  mobileVerified: boolean;
}
