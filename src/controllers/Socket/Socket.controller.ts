import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { tokenValidationWS } from '@src/helpers/validations';
import { SOCKET_EVT } from '@constants/urls';
import { MESSAGES } from '@constants/messages';
import { ISockets } from './type';
import { Users } from '../User/User.model';
import { User } from '../User/User.controller';
import { Posts } from '../Posts/Posts.controller';
import { Comments } from '../Сomments/Comments.controller';

let instance: Socket;

let io: Server = null;
export class Socket {
  io: Server;

  instance: Socket;

  sockets: ISockets;

  constructor() {
    if (!instance) {
      instance = this;
    }
    this.io = io;
    this.sockets = {
      User: [],
      Manager: [],
      SuperAdmin: [],
    };
    return instance;
  }

  connect = (app: HttpServer): void => {
    try {
      const posts = new Posts();
      const comments = new Comments();
      io = new Server(app, { cors: { origin: '*' } });
      io.on('connection', async (socket) => {
        const { userId, isInvalid, role } = tokenValidationWS(socket);
        this.sockets[role].push(socket);

        if (isInvalid) return socket.emit(SOCKET_EVT.check_auth, MESSAGES.un_autorized);
        await Users.updateOne({ _id: userId }, { $set: { online: true } });
        User.getUserData(socket);
        socket.on('disconnect', async () => {
          await Users.updateOne({ _id: userId }, { $set: { online: false } });
          this.sockets[role].splice(this.sockets[role].indexOf(socket), 1);
        });
        posts.createPost(socket);
        posts.getPublicPostsBySockets(socket);
        posts.getPendingPostsBySockets(socket);
        posts.getPrivatePostsBySocket(socket);
        posts.updatePublicPostsBySocket(socket);
        posts.updatePendingPostsBySockets(socket);
        posts.updatePrivatePostsBySocket(socket);
        comments.getComments(socket);
        comments.createComment(socket);
        comments.joinToPostRoom(socket);
        comments.leaveRoom(socket);
      });
    } catch (err) {
      console.log(err);
    }
  };
}
