import { MESSAGES } from '@constants/messages';
import { SOCKET_EVT } from '@constants/urls';
import { Common } from '@src/helpers/ControllerHelper';
import { tokenValidationWS } from '@src/helpers/validations';
import { CommentModel } from './Comments.model';
import { TSocket } from '../Socket/type';
import * as T from './types';

export class Comments extends Common {
  createComment = (socket: TSocket): void => {
    try {
      socket.on(SOCKET_EVT.create_comment, async ({ content, post }: T.TCreateComment) => {
        const { userId, isInvalid } = tokenValidationWS(socket);
        if (isInvalid) return socket.emit(SOCKET_EVT.check_auth, MESSAGES.un_autorized);
        if (!content) return socket.emit(SOCKET_EVT.error, MESSAGES.no_content);
        const comment = new CommentModel({
          author: userId,
          content,
          post,
          created_at: Date.now(),
        });
        await comment.save();
      });
    } catch {
      socket.emit(SOCKET_EVT.error, { message: MESSAGES.abstract_err });
    }
  };
}
