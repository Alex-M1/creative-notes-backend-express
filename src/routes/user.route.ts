import { Router } from 'express';
import { User } from '@controllers/User/User.controller';
import { URLS } from '@constants/urls';
import { authValidation, tokenValidation } from '@src/helpers/validations';

const route = Router();
const user = new User();

route.post(URLS.user.reg, authValidation, user.registration);
route.post(URLS.user.auth, authValidation, user.login);
route.put(URLS.user.change_pass, tokenValidation, user.changePassword);
route.put(URLS.user.change_user_data, tokenValidation, user.changeUserData);
route.put(URLS.user.change_user_role, tokenValidation, user.upgradeUserRole);
route.get(URLS.user.get_users, tokenValidation, user.getUsersToSuperAdmin);

export default route;
