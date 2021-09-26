import { MESSAGES } from '@constants/messages';
import { AUTH_REGULAR } from '@constants/regulars';
import { TControllerReturn } from '@src/commonTypes/controllers';
import { NextFunction, Request, Response } from 'express';

export const authValidation = (req: Request, res: Response, next: NextFunction): TControllerReturn => {
  const { loginReg, passwordReg } = AUTH_REGULAR;
  const { login, password } = req.body;
  if (!loginReg.test(login.trim())) {
    return res.status(400).json({
      message: MESSAGES.invalid_login,
    });
  }
  if (!passwordReg.test(password.trim())) {
    return res.status(400).json({
      message: MESSAGES.invalid_password,
    });
  }
  next();
};
