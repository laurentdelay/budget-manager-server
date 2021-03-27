import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { AuthChecker } from "type-graphql";
import { Context } from "../interfaces/Context.interface";

export const authCheck: AuthChecker<Context> = (
  { context: { user } },
  roles = []
) => {
  if (user == null) {
    throw new AuthenticationError(
      "You must be authenticated to perform this action"
    );
  }

  if (roles.length == 0) {
    return true;
  }

  throw new ForbiddenError("Vous n'êtes pas authorisé à faire ceci.");
};
