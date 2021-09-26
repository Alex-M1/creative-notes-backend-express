import { TRoles } from '@src/commonTypes/controllers';

export interface IAuthBody {
  login: string;
  password: string;
}

export interface IUserSchema extends IAuthBody {
  online?: boolean;
  name?: string;
  lastName?: string;
  age?: string;
  img?: string;
  city?: string;
  role?: TRoles;
}

export interface IUser extends IUserSchema {
  _id: string;
}
