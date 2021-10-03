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
    type: [Schema.Types.ObjectId],
    default: [],
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

export const Post = model('Posts', schema);
