import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { tokenValidationWS } from '@src/helpers/validations';
import { SOCKET_EVT } from '@constants/urls';
import { MESSAGES } from '@constants/messages';
import { TSocket } from './type';
import { Users } from '../User/User.model';
import { User } from '../User/User.controller';
import { Posts } from '../Posts/Posts.controller';

let instance;

let io: Server = null;
export class Socket {
  io: Server;

  instance: Socket;

  sockets: Array<TSocket>;

  constructor() {
    if (!instance) {
      instance = this;
    }
    this.io = io;
    this.sockets = [];
    return instance;
  }

  connect = (app: HttpServer): void => {
    const posts = new Posts();
    io = new Server(app, { cors: { origin: '*' } });
    io.on('connection', async (socket) => {
      this.sockets.push(socket);
      const { userId, isInvalid } = tokenValidationWS(socket);
      if (isInvalid) return socket.emit(SOCKET_EVT.check_auth, MESSAGES.un_autorized);
      await Users.updateOne({ _id: userId }, { $set: { online: true } });
      User.getUserData(socket);
      socket.on('disconnect', async () => {
        await Users.updateOne({ _id: userId }, { $set: { online: false } });
        this.sockets.splice(this.sockets.indexOf(socket), 1);
      });
      posts.createPost(socket);
      posts.updatePublicPostsBySocket(socket);
    });
  };
}
