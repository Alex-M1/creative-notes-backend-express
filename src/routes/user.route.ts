import { Router } from 'express';
import { User } from '@controllers/User/User.controller';
import { URLS } from '@constants/urls';
import { authValidation, tokenValidation } from '@src/helpers/validations';

const route = Router();
const { registration, login, getUserData } = new User();

route.post(URLS.reg, authValidation, registration);
route.post(URLS.auth, authValidation, login);
route.get(URLS.userData, tokenValidation, getUserData);

export default route;
