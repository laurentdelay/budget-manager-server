import { UserInputError } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";

export const ErrorInterceptor: MiddlewareFn<any> = async (_, next) => {
  try {
    return await next();
  } catch (err) {
    // conversion des erreurs de validation en UserInputError
    if (err.validationErrors != undefined) {
      let errors: Object = {};
      for (const validationError of err.validationErrors) {
        const property: string = validationError.property;

        errors = {
          ...errors,
          [property]: Object.values(validationError.constraints)[0],
        };
      }
      throw new UserInputError("Input error", { errors });
    }

    throw err;
  }
};
