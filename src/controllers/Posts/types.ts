import { TPostStatus, TRoles } from '@src/commonTypes/controllers';
import { Schema } from 'mongoose';

export interface IPostsSchema {
  content: string;
  author: Schema.Types.ObjectId;
  status: TPostStatus;
  theme: string;
  likes: number;
  created_at: number;
}

export interface IPosts extends IPostsSchema {
  _id: string;
}

export interface IPostRequest extends Omit<IPostsSchema, 'author' | 'created_at'> {
  userId: Schema.Types.ObjectId;
  userRole: TRoles
}

export interface IUpdatePostRequest extends IPostRequest {
  postId: Schema.Types.ObjectId;
}

export interface IPostsQuery {
  theme: string;
  page: string;
  per_page: string;
}

export type IFindPostOptions = Partial<Pick<IPostsSchema, 'author' | 'theme' | 'status'>>;
