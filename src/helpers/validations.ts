import { MESSAGES } from '@constants/messages';
import { AUTH_REGULAR } from '@constants/regulars';
import { SOCKET_EVT } from '@constants/urls';
import { ITokenValidation, TControllerReturn } from '@src/commonTypes/controllers';
import { TSocket } from '@src/controllers/Socket/type';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

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

export const tokenValidation = (req: Request, res: Response, next: NextFunction): TControllerReturn => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401).json(MESSAGES.un_autorized);
  jwt.verify(token, process.env.TOKEN_SECRET, (err: Error, user) => {
    if (err) return res.sendStatus(401).json(MESSAGES.un_autorized);
    req.body.userId = user.userId;
    req.body.userRole = user.role;
    next();
  });
};

export const tokenValidationWS = (token: string, socket: TSocket): ITokenValidation => {
  try {
    if (!token) {
      socket.emit(SOCKET_EVT.check_auth, { message: MESSAGES.un_autorized });
      return { isInvalid: true };
    }
    const { userId, role } = jwt.verify(token, process.env.TOKEN_SECRET) as jwt.JwtPayload;
    return { userId, role };
  } catch (err) {
    socket.emit(SOCKET_EVT.check_auth, { message: MESSAGES.un_autorized });
    return { isInvalid: true };
  }
};
