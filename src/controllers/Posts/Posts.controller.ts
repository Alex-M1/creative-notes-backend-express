import { MESSAGES } from '@constants/messages';
import { INITIAL_PAGE, PER_PAGE } from '@constants/posts';
import { Common } from '@helpers/ControllerHelper';
import { TControllerReturn, TRequest } from '@src/commonTypes/controllers';
import { Request, Response } from 'express';
import { Post } from './Posts.model';
import { IPostRequest, IPosts } from './types';

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

  getPublicPosts = async (req: Request, res: Response) => {
    try {
      const theme = req.query.theme as string;
      const page = +req.query.page || INITIAL_PAGE;
      const perPage = +req.query.per_page || 3;
      const range = page * perPage;
      let posts;
      let total_page;
      if (theme) {
        posts = await Post.find({ theme }, { __v: false });
        total_page = Math.ceil(posts.length / perPage);
        posts = posts.reverse().filter((_post: IPosts, i: number) => i >= range - perPage && i < range);
      }
      return this.setResponse(res, 200, {
        posts,
        page,
        total_page,
      });
    } catch (err) {
      console.log(err);
      return this.setResponse(res, 400, MESSAGES.abstract_err);
    }
  };
}
