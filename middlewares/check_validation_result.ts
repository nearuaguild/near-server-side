import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const checkValidationResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0];

    return res.status(400).end(firstError.msg);
  }

  next();
};

export default checkValidationResult;
