import { Response } from 'express';

export type TControllerReturn = Response<any, Record<string, any>>;
export type TRoles = 'User' | 'Admin' | 'SuperAdmin';
export type TPostStatus = 'private' | 'pending' | 'public' | 'rejected';
