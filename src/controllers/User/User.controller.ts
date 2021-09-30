import { Common } from '@helpers/ControllerHelper';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MESSAGES } from '@constants/messages';
import { Request, Response } from 'express';
import { TControllerReturn } from '@src/commonTypes/controllers';
import { tokenValidationWS } from '@src/helpers/validations';
import { SOCKET_EVT } from '@constants/urls';
import { Users } from './User.model';
import { IUser } from './types';
import { TSocket } from '../Socket/type';

export class User extends Common {
  registration = async (req: Request, res: Response): Promise<TControllerReturn> => {
    const { login, password } = req.body;
    try {
      const candidate = await Users.findOne({ login });
      if (candidate) {
        return this.setResponse(res, 400, MESSAGES.user_already_reg);
      }
      const hashedPassword = await bcrypt.hash(password, +process.env.SALT);
      const user = new Users({ login, password: hashedPassword });
      await user.save();
      this.setResponse(res, 201, MESSAGES.success);
    } catch (e) {
      this.setResponse(res, 400, MESSAGES.abstract_err);
    }
  };

  login = async (req: Request, res: Response): Promise<TControllerReturn> => {
    try {
      const { login, password } = req.body;
      const user: IUser = await Users.findOne({ login });
      if (!user) {
        return this.setResponse(res, 400, MESSAGES.user_not_found);
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return this.setResponse(res, 401, MESSAGES.invalid_password);
      }
      const secret = process.env.TOKEN_SECRET;
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        secret,
        { expiresIn: '10h' },
      );
      res.json({ token, role: user.role });
    } catch (e) {
      this.setResponse(res, 400, MESSAGES.abstract_err);
    }
  };

  // getUserData = async (req: Request, res: Response): Promise<TControllerReturn> => {
  //   try {
  //     const userID = req.body.userId;
  //     const user = await Users.findOne({ _id: userID }, { password: false, __v: false, _id: false });
  //     return this.setResponse(res, 200, user);
  //   } catch (e) {
  //     this.setResponse(res, 400, MESSAGES.abstract_err);
  //   }
  // };
  static getUserData = async (socket: TSocket): Promise<void> => {
    try {
      const { userId } = tokenValidationWS(socket.handshake.auth.token, socket);
      const user = await Users.findOne({ _id: userId }, { password: false, __v: false, _id: false });
      socket.emit(SOCKET_EVT.user_info, { message: user });
    } catch (e) {
      socket.emit(SOCKET_EVT.user_info, { message: MESSAGES.abstract_err });
    }
  };
}
