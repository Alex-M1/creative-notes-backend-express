import { UsersRoles } from '@constants/users';
import { Schema, model } from 'mongoose';
import { IUserSchema } from './types';

const schema = new Schema<IUserSchema>({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  img: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  age: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    required: true,
    default: UsersRoles.user,
  },
}, { collection: 'users' });

export const Users = model('Users', schema);
