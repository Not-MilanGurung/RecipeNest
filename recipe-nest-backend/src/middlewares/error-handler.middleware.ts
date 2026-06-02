import type { ErrorRequestHandler, RequestHandler } from "express";

export type CustomError = Error & { statusCode?: number; errorList?: string[],  };

type Output = {
  message: string;
  errors: string[] | null;
};

const errorHandler : ErrorRequestHandler = (err : CustomError, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const output: Output = {
    message: err.message || "Internal server error",
    errors : null,
  };

  if (err.errorList) output.errors = err.errorList;

  console.error("Error stack: ", err.stack);

  res.status(statusCode).json(output);
};

export default errorHandler;
