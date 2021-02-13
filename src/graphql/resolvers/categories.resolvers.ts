import { AuthenticationError } from "apollo-server";
import Category from "../../models/category.model";
import { checkAuth } from "../../utils/token";

const categoriesResolvers = {
  Query: {
    async categories(_, __, context) {
      // on vérifie que l'utilisateur est connecté
      const loggedUser = checkAuth(context);

      if (!loggedUser) {
        throw new AuthenticationError("Vous devez être connecté.");
      }

      try {
        const categories = await Category.find({
          $or: [({ user: loggedUser.id }, { user: null })],
        });

        return categories;
      } catch (error) {
        throw new Error();
      }
    },
  },
  Mutation: {
    async newCategory(_, { inputs }, context) {
      // on vérifie que l'utilisateur est connecté
      const loggedUser = checkAuth(context);

      if (!loggedUser) {
        throw new AuthenticationError("Vous devez être connecté.");
      }
    },
    async removeCategory() {},
  },
};

export default categoriesResolvers;
