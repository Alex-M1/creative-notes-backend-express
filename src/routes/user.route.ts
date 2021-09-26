import { Router } from 'express';
import { User } from '@controllers/User/User.controller';
import { URLS } from '@constants/urls';
import { authValidation } from '@src/helpers/validations';

const route = Router();
const { registration, login } = new User();

route.post(URLS.reg, authValidation, registration);
route.post(URLS.auth, authValidation, login);

export default route;
