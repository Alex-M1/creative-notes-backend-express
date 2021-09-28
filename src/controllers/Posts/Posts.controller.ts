import { MESSAGES } from '@constants/messages';
import { INITIAL_PAGE, PER_PAGE } from '@constants/posts';
import { Common } from '@helpers/ControllerHelper';
import { TControllerReturn, TRequest } from '@src/commonTypes/controllers';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { Post } from './Posts.model';
import { IFindPostOptions, IPostRequest, IPosts } from './types';

export class Posts extends Common {
  createPost = async (req: TRequest<IPostRequest>, res: Response): Promise<TControllerReturn> => {
    try {
      const { content, status, theme, userId } = req.body;
      const post = new Post({
        theme,
        status,
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
        const { posts, total_page } = await this.findPosts(req.query, { theme });
        return this.setResponse(res, 200, { posts, page, total_page });
      }
      const { posts, total_page } = await this.findPosts(req.query, { theme });
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
      if (userRole === 'User') {
        const { total_page, posts } = await this.findPosts(req.query, { author: userId });
        return this.setResponse(res, 200, { posts, page, total_page });
      }
      if (userRole === 'SuperAdmin') {
        const { total_page, posts } = await this.findPosts(req.query, { author: idFromQuery });
        return this.setResponse(res, 200, { posts, page, total_page });
      }
      return this.setResponse(res, 403, MESSAGES.abstract_err);
    } catch (err) {
      return this.setResponse(res, 400, MESSAGES.abstract_err);
    }
  };

  private findPosts = async (query, options?: IFindPostOptions) => {
    const page = +query.page || INITIAL_PAGE;
    const perPage = +query.per_page || PER_PAGE;
    const range = page * perPage;
    let posts = await Post.find(options || {}, { __v: false });
    posts = posts.reverse().filter((_post: IPosts, i: number) => i >= range - perPage && i < range);
    const total_page = Math.ceil(posts.length / perPage);
    return { posts, total_page };
  };
}
