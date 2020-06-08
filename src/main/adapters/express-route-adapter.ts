import { Request, Response } from 'express';
import { Controller, HttpRequest } from '@/presentation/protocols';

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const httpResquest: HttpRequest = {
    body: req.body,
    params: req.params,
    accountId: req.accountId,
  };
  const httpResponse = await controller.handle(httpResquest);
  if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } else {
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    });
  }
};
