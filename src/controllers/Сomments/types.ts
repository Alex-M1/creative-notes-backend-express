import { Schema } from 'mongoose';

export interface IComments {
  post: Schema.Types.ObjectId,
  author: Schema.Types.ObjectId,
  content: string;
  created_at: number;
}

export type TCreateComment = Omit<IComments, 'author' | 'created_at'>;
