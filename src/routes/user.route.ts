import { Router } from 'express';
import { User } from '@controllers/User/User.controller';
import { URLS } from '@constants/urls';
import { authValidation, tokenValidation } from '@src/helpers/validations';

const route = Router();
const { registration, login, getUserData } = new User();

route.post(URLS.user.reg, authValidation, registration);
route.post(URLS.user.auth, authValidation, login);
route.get(URLS.user.userData, tokenValidation, getUserData);

export default route;