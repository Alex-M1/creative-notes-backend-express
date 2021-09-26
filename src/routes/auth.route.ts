import { Router } from 'express';
import { User } from '@controllers/User/User.controller';
import { URLS } from '@constants/urls';

const route = Router();
const auth = new User();
const { registration, login } = auth;

route.post(URLS.reg, registration);
route.post(URLS.auth, login);

export default route;
