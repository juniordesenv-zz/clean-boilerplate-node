import { NextFunction, Request, Response } from 'express';
import { HttpRequest, Middleware } from '@/presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => async (req: Request,
  res: Response,
  next: NextFunction) => {
  const httpResquest: HttpRequest = {
    headers: req.headers,
  };
  const httpResponse = await middleware.handle(httpResquest);
  if (httpResponse.statusCode === 200) {
    Object.assign(req, httpResponse.body);
    next();
  } else {
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    });
  }
};
