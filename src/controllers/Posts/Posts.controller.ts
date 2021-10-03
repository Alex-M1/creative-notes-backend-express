import { MESSAGES } from '@constants/messages';
import { INITIAL_PAGE, MessageStatus, PER_PAGE } from '@constants/posts';
import { SOCKET_EVT } from '@constants/urls';
import { UsersRoles } from '@constants/users';
import { Common } from '@helpers/ControllerHelper';
import { TControllerReturn, TPostStatus, TRequest, TRoles } from '@src/commonTypes/controllers';
import { tokenValidationWS } from '@src/helpers/validations';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { TSocket } from '../Socket/type';
import { Post } from './Posts.model';
import { IFindPostOptions, IFindPostOptionsBySocket, IPages, IPostRequest, IPosts, IPostsQuery, ISocketPost, IUpdatePostRequest, TPrivatePostsRequest } from './types';

export class Posts extends Common {
  createPost = (socket: TSocket): void => {
    try {
      socket.on(SOCKET_EVT.create_post, async ({ theme, status, content }: ISocketPost) => {
        const { userId, isInvalid, role } = tokenValidationWS(socket);
        if (isInvalid) return socket.emit(SOCKET_EVT.check_auth, MESSAGES.un_autorized);
        const checkedStatus = this.checkMessageStatus(role, status);
        const post = new Post({
          theme,
          status: checkedStatus,
          content,
          author: userId,
          created_at: Date.now(),
        });
        await post.save();

        const posts = await this.findPostsBySocket(
          { author: userId, status: checkedStatus, theme },
        );
        if (checkedStatus === MessageStatus.private) {
          socket.emit(SOCKET_EVT.get_private_posts, { message: posts });
        } else if (checkedStatus === MessageStatus.pending) {
          socket.emit(SOCKET_EVT.get_pending_posts, { message: posts });
          this.Socket.sockets.Manager.concat(this.Socket.sockets.SuperAdmin).forEach(person => {
            person.emit(SOCKET_EVT.get_pending_posts, { message: posts });
          });
        }
      });
    } catch (err) {
      socket.emit(SOCKET_EVT.error, { message: MESSAGES.abstract_err });
    }
  };

  getPublicPosts = async (req: Request, res: Response): Promise<TControllerReturn> => {
    try {
      const theme = req.query.theme as string;
      const page = +req.query.page || INITIAL_PAGE;
      if (theme) {
        const { posts, total_page } = await this.findPosts(req.query, { theme, status: MessageStatus.public });
        return this.setResponse(res, 200, { posts, page, total_page });
      }
      const { posts, total_page } = await this.findPosts(req.query, { status: MessageStatus.public });
      return this.setResponse(res, 200, { posts, page, total_page });
    } catch (err) {
      return this.setResponse(res, 400, MESSAGES.abstract_err);
    }
  };

  getPublicPostsBySockets = (socket: TSocket): void => {
    try {
      socket.on(SOCKET_EVT.get_public_posts, async ({ page, per_page, theme }: IPostsQuery) => {
        const { isInvalid } = tokenValidationWS(socket);
        if (isInvalid) return socket.emit(SOCKET_EVT.check_auth, MESSAGES.un_autorized);
        const posts = await this.findPostsBySocket({ theme }, { page, per_page });
        socket.emit(SOCKET_EVT.get_public_posts, { message: posts });
      });
    } catch {
      socket.emit(SOCKET_EVT.error, { message: MESSAGES.abstract_err });
    }
  };

  getPrivatePosts = async (req: TRequest<IPostRequest>, res: Response): Promise<TControllerReturn> => {
    try {
      const { userRole, userId } = req.body;
      const page = +req.query.page || INITIAL_PAGE;
      const idFromQuery = req.query.id as unknown as Schema.Types.ObjectId;
      if (userRole === UsersRoles.user) {
        const { total_page, posts } = await this.findPosts(
          req.query,
          { author: userId, status: MessageStatus.private },
        );
        return this.setResponse(res, 200, { posts, page, total_page });
      }
      if (userRole === UsersRoles.superAdmin) {
        const { total_page, posts } = await this.findPosts(
          req.query,
          { author: idFromQuery, status: MessageStatus.private },
        );
        return this.setResponse(res, 200, { posts, page, total_page });
      }
      return this.setResponse(res, 403, MESSAGES.no_rights);
    } catch (err) {
      return this.setResponse(res, 400, MESSAGES.abstract_err);
    }
  };

  getPrivatePostsBySocket = (socket: TSocket): boolean => {
    try {
      const { userId, isInvalid, role } = tokenValidationWS(socket);
      if (isInvalid) return socket.emit(SOCKET_EVT.check_auth, MESSAGES.un_autorized);
      socket.on(SOCKET_EVT.get_private_posts, async ({ page, per_page, theme, author }: TPrivatePostsRequest) => {
        if (role === UsersRoles.superAdmin && author) {
          const posts = await this.findPostsBySocket({ author, theme }, { page, per_page });
          socket.emit(SOCKET_EVT.get_private_posts, { message: posts });
        } else {
          const posts = await this.findPostsBySocket({ author: userId, theme }, { page, per_page });
          socket.emit(SOCKET_EVT.get_private_posts, { message: posts });
        }
      });
    } catch {
      socket.emit(SOCKET_EVT.error, { message: MESSAGES.abstract_err });
    }
  };

  getPendingPosts = async (req: TRequest<IPostRequest>, res: Response): Promise<TControllerReturn> => {
    try {
      const { userRole, userId } = req.body;
      const theme = req.query.theme as string;
      if (userRole === UsersRoles.user) {
        const { total_page, page, posts } = await this.findPosts(
          req.query,
          { author: userId, status: MessageStatus.pending, theme },
        );
        return this.setResponse(res, 200, { page, total_page, posts });
      }
      const { total_page, page, posts } = await this.findPosts(
        req.query,
        { status: MessageStatus.pending, theme },
      );
      return this.setResponse(res, 200, { page, total_page, posts, theme });
    } catch (err) {
      return this.setResponse(res, 400, MESSAGES.abstract_err);
    }
  };

  updatePublicPostsBySocket = (socket: TSocket): void => {
    try {
      socket.on(SOCKET_EVT.upd_public_post, async ({ likes, postId, page, per_page, theme }) => {
        const { isInvalid } = tokenValidationWS(socket);
        if (isInvalid) return socket.emit(SOCKET_EVT.check_auth, MESSAGES.un_autorized);
        await Post.updateOne({ _id: postId }, { $set: { likes } });
        const posts = this.findPostsBySocket({ status: MessageStatus.public, theme }, { page, per_page });
        this.getAllSockets().forEach(socket => {
          socket.emit(SOCKET_EVT.get_public_posts, { message: posts });
        });
      });
    } catch (err) {
      socket.emit(SOCKET_EVT.error, { message: MESSAGES.abstract_err });
    }
  };

  updatePendingPosts = async (req: TRequest<IUpdatePostRequest>, res: Response): Promise<TControllerReturn> => {
    try {
      const { userRole, userId, theme, content, status, postId } = req.body;
      if (userRole === UsersRoles.user) {
        await Post.updateOne({ _id: postId }, { $set: { content, theme } });
        return this.setResponse(res, 200, MESSAGES.success);
      }
      if (userRole === UsersRoles.manager) {
        const post = await Post.findById(postId);
        if (post._id?.toString() === userId?.toString()) {
          await Post.updateOne({ _id: postId }, { $set: { status } });
          return this.setResponse(res, 200, MESSAGES.success);
        }
        return this.setResponse(res, 403, MESSAGES.no_rights);
      }
      await Post.updateOne({ _id: postId }, { $set: { status } });
      return this.setResponse(res, 200, MESSAGES.success);
    } catch (err) {
      return this.setResponse(res, 400, MESSAGES.abstract_err);
    }
  };

  updatePrivatePosts = async (req: TRequest<IUpdatePostRequest>, res: Response): Promise<TControllerReturn> => {
    try {
      const { userRole, userId, status, postId } = req.body;
      const message = await Post.findById(postId);
      if (
        (userRole === UsersRoles.user || userRole === UsersRoles.manager)
        && message.author?.toString() === userId?.toString()
      ) {
        await Post.updateOne({ _id: postId }, { status: this.checkMessageStatus(userRole, status) });
        return this.setResponse(res, 200, 'success');
      }
      await Post.updateOne({ _id: postId }, { status });
    } catch (err) {
      return this.setResponse(res, 400, MESSAGES.abstract_err);
    }
  };

  private findPosts = async (query, options?: IFindPostOptions) => {
    const page = +query.page || INITIAL_PAGE;
    const perPage = +query.per_page || PER_PAGE;
    const range = page * perPage;
    let posts = await Post.find(options || {}, { __v: false, status: false })
      .populate({ path: 'author', select: 'login' });
    posts = posts.reverse().filter((_post: IPosts, i: number) => i >= range - perPage && i < range);
    const total_page = Math.ceil(posts.length / perPage);
    return { posts, total_page, page };
  };

  private findPostsBySocket = async (options?: IFindPostOptionsBySocket, pagesOption?: IPages) => {
    const page = +pagesOption.page || INITIAL_PAGE;
    const perPage = +pagesOption.per_page || PER_PAGE;
    const range = page * perPage;
    let posts = await Post.find(options || {}, { __v: false, status: false })
      .populate({ path: 'author', select: 'login' });
    posts = posts.reverse().filter((_post: IPosts, i: number) => i >= range - perPage && i < range);
    const total_page = Math.ceil(posts.length / perPage);
    return { posts, total_page, page };
  };

  private checkMessageStatus = (role: TRoles, status: TPostStatus) => {
    if (role === UsersRoles.user || role === UsersRoles.manager) {
      return status === MessageStatus.public || status === MessageStatus.rejected ? MessageStatus.pending : status;
    }
    return status === MessageStatus.pending || status === MessageStatus.rejected ? MessageStatus.private : status;
  };
}
