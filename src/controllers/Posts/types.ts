import { TPostStatus } from '@src/commonTypes/controllers';
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

export interface IPostRequest extends Omit<IPostsSchema, 'author' | 'likes' | 'created_at'> {
  userId: Schema.Types.ObjectId;
}

export interface IPostsQuery {
  theme: string;
  page: string;
  per_page: string;
}
