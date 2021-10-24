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
    type: [String],
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
  isAnonim: {
    type: Boolean,
    default: false,
  },
  comments: {
    type: Number,
    default: 0,
  },
}, { collection: 'posts' });

export const Post = model('Posts', schema);
