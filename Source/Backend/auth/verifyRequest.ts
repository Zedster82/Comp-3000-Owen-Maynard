import { Request, Response, NextFunction } from 'express';

const verifyRequest = (req: Request, res: Response, next: NextFunction) => {
  // Your authentication logic here
  next();
};

export default verifyRequest;