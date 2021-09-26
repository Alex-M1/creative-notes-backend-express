import { Router } from 'express';
import { User } from '@controllers/User/User.controller';
import { URLS } from '@constants/urls';
import { authValidation } from '@src/helpers/validations';

const route = Router();
const auth = new User();
const { registration, login } = auth;

route.post(URLS.reg, authValidation, registration);
route.post(URLS.auth, authValidation, login);

export default route;
