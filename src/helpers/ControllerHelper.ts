import { TControllerReturn } from '@src/commonTypes/controllers';
import { Response } from 'express';

export class Common {
  setResponse = (res: Response, status: number, message: string): TControllerReturn => {
    return res.status(status).json({
      message,
    });
  };
}
