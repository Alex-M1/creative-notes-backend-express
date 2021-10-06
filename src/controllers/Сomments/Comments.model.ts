import { Schema, model } from 'mongoose';
import { IComments } from './types';

const schema = new Schema<IComments>({
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Number,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Posts',
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
}, { collection: 'comments' });

export const CommentModel = model('Comments', schema);
