import { TControllerReturn } from '@src/commonTypes/controllers';
import { Socket } from '@src/controllers/Socket/Socket.controller';
import { TSocket } from '@src/controllers/Socket/type';
import { Response } from 'express';

export class Common {
  Socket: Socket;

  constructor() {
    this.Socket = new Socket();
  }

  setResponse = (res: Response, status: number, message: string | any): TControllerReturn => {
    return res.status(status).json({
      message,
    });
  };

  getAllSockets = (): Array<TSocket> => {
    return [
      ...this.Socket.sockets.SuperAdmin,
      ...this.Socket.sockets.User,
      ...this.Socket.sockets.Manager,
    ];
  };
}
