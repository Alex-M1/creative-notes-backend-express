import { TPostStatus, TRoles } from '@src/commonTypes/controllers';
import { Schema } from 'mongoose';

export interface IPostsSchema {
  content: string;
  author: Schema.Types.ObjectId;
  status: TPostStatus;
  theme: string;
  likes: Array<string>;
  created_at: number;
}

export interface IPages {
  per_page: number,
  page: number
}

export interface IPosts extends IPostsSchema {
  _id: string;
}

export interface IPostRequest extends Omit<IPostsSchema, 'author' | 'created_at'> {
  userId: Schema.Types.ObjectId;
  userRole: TRoles
}

export type ISocketPost = Omit<IPostsSchema, 'author' | 'created_at'> & IPages;

export interface IUpdatePostRequest extends IPostRequest {
  postId: Schema.Types.ObjectId;
}

export interface IPostsQuery {
  theme: string;
  page: number;
  per_page: number;
}

export type TPrivatePostsRequest = IPostsQuery & Partial<Pick<IPostsSchema, 'author'>>;

export type TAbstractObj = {
  [key: string]: Schema.Types.ObjectId;
};

export interface IFindPostOptionsBySocketWithSettings {
  author?: TAbstractObj;
  theme?: string;
  status?: TPostStatus;
}

export interface IUpdatePendingPosts extends Partial<Pick<IPostsSchema, 'content' | 'theme' | 'status'>>, IPages {
  postId: Schema.Types.ObjectId
}

export type IFindPostOptions = Partial<Pick<IPostsSchema, 'author' | 'theme' | 'status'>>;
export type IFindPostOptionsBySocket = Partial<Pick<IPostsSchema, 'author' | 'theme' | 'status'>> | IFindPostOptionsBySocketWithSettings;
