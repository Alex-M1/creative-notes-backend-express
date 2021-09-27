import { Schema, model } from 'mongoose';
import { IPostsSchema } from './types';

const schema = new Schema<IPostsSchema>({
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
}, { collection: 'posts' });

export const Users = model('Posts', schema);
