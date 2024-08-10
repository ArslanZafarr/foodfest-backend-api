import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const result = errors.mapped();

    const formattedErrors: Record<string, string[]> = {};
    for (const key in result) {
      formattedErrors[key.charAt(0).toLowerCase() + key.slice(1)] = [
        result[key].msg,
      ];
    }

    const errorCount = Object.keys(result).length;
    const errorSuffix =
      errorCount > 1
        ? ` (and ${errorCount - 1} more error${errorCount > 2 ? "s" : ""})`
        : "";

    const errorResponse = {
      success: false,
      message: `${result[Object.keys(result)[0]].msg}${errorSuffix}`,
      errors: formattedErrors,
    };

    return res.status(400).json(errorResponse);
  }
};
