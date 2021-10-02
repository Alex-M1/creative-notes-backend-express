import { Response, Request } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { Schema } from 'mongoose';

export type TControllerReturn = Response<any, Record<string, any>>;
export type TRoles = 'User' | 'Manager' | 'SuperAdmin';
export type TPostStatus = 'private' | 'pending' | 'public' | 'rejected';
export type TRequest<B> = Request<ParamsDictionary, any, B, Query, Record<string, any>>;
export interface ITokenValidation {
  userId?: Schema.Types.ObjectId;
  role?: TRoles;
  isInvalid?: boolean;
}
