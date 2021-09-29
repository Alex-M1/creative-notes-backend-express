import { MESSAGES } from '@constants/messages';
import { INITIAL_PAGE, MessageStatus, PER_PAGE } from '@constants/posts';
import { UsersRoles } from '@constants/users';
import { Common } from '@helpers/ControllerHelper';
import { TControllerReturn, TPostStatus, TRequest, TRoles } from '@src/commonTypes/controllers';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { Post } from './Posts.model';
import { IFindPostOptions, IPostRequest, IPosts, IUpdatePostRequest } from './types';

export class Posts extends Common {
  createPost = async (req: TRequest<IPostRequest>, res: Response): Promise<TControllerReturn> => {
    try {
      const { content, status, theme, userId, userRole } = req.body;
      const checkedStatus = this.checkMessageStatus(userRole, status);
      const post = new Post({
        theme,
        status: checkedStatus,
        content,
        author: userId,
        created_at: Date.now(),
      });
      await post.save();
      return this.setResponse(res, 200, MESSAGES.success);
    } catch (err) {
      return this.setResponse(res, 400, MESSAGES.abstract_err);
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

  updatePublicPosts = async (req: TRequest<IUpdatePostRequest>, res: Response): Promise<TControllerReturn> => {
    try {
      const { likes, postId } = req.body;
      await Post.updateOne({ _id: postId }, { $set: { likes } });
      return this.setResponse(res, 200, MESSAGES.success);
    } catch (err) {
      return this.setResponse(res, 400, MESSAGES.abstract_err);
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

  private checkMessageStatus = (role: TRoles, status: TPostStatus) => {
    if (role === UsersRoles.user || role === UsersRoles.manager) {
      return status === MessageStatus.public || status === MessageStatus.rejected ? MessageStatus.pending : status;
    }
    return status === MessageStatus.pending || status === MessageStatus.rejected ? MessageStatus.private : status;
  };
}
