import { MESSAGES } from '@constants/messages';
import { SOCKET_EVT } from '@constants/urls';
import { Common } from '@src/helpers/ControllerHelper';
import { tokenValidationWS } from '@src/helpers/validations';
import { CommentModel } from './Comments.model';
import { TSocket } from '../Socket/type';
import * as T from './types';
import { Post } from '../Posts/Posts.model';

export class Comments extends Common {
  createComment(socket: TSocket): void {
    try {
      socket.on(SOCKET_EVT.create_comment, async ({ content, post }: T.TCreateComment) => {
        const { userId, isInvalid } = tokenValidationWS(socket);
        content = content.trim();
        if (isInvalid) return socket.emit(SOCKET_EVT.check_auth, { message: MESSAGES.un_autorized });
        if (!content) return socket.emit(SOCKET_EVT.error, { message: MESSAGES.no_content });
        const comment = new CommentModel({
          author: userId,
          content,
          post,
          created_at: Date.now(),
        });
        await comment.save();
        await Post.updateOne({ post }, { $inc: { comments: 1 } });
        const comments = await CommentModel.find({ post });
        socket.emit(SOCKET_EVT.post_has_been_update, {});
        socket.to(`post_${post}`).emit(SOCKET_EVT.get_comments, { message: comments });
      });
    } catch {
      socket.emit(SOCKET_EVT.error, { message: MESSAGES.abstract_err });
    }
  }

  getComments(socket: TSocket): void {
    try {
      const { isInvalid } = tokenValidationWS(socket);
      if (isInvalid) return socket.emit(SOCKET_EVT.check_auth, { message: MESSAGES.un_autorized });
      socket.on(SOCKET_EVT.get_comments, async ({ post }) => {
        const comments = await CommentModel.find({ post });
        socket.emit(SOCKET_EVT.get_comments, { message: comments });
      });
    } catch { socket.emit(SOCKET_EVT.error, { message: MESSAGES.abstract_err }); }
  }
}
