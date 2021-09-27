import { MESSAGES } from '@constants/messages';
import { Common } from '@helpers/ControllerHelper';
import { TControllerReturn, TRequest } from '@src/commonTypes/controllers';
import { Response } from 'express';
import { Post } from './Posts.model';
import { IPostRequest } from './types';

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
}
