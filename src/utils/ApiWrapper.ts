import { NextFunction, Response, Request } from 'express';
import { SuccessResponse } from './SuccessResponse';
import { RequestBody, RequestQuery } from '@/types/body.type';

type ApiFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;
export const ApiWrapper = (handler: ApiFunction) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handler(req, res, next))
    .then((response: SuccessResponse) => {
      return res.status(response.code).json(response);
    })
    .catch((err) => next(err));
};

export const ApiRedirectAuth = (handler: ApiFunction) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handler(req, res, next))
    .then((redirectTo: string) => {
      return res.redirect(redirectTo);
    })
    .catch((err) => next(err));
};

export const ClientWrapper = async <T>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T | null> => {
  try {
    return await Promise.resolve(fn(...args));
  } catch (err) {
    console.error('Client Error:', err);
    return null;
  }
};
