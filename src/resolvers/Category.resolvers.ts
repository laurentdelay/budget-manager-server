import { UserInputError } from "apollo-server-express";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Category, CategoryModel } from "../entities/Category";
import { User } from "../entities/User";
import { CategoryInput } from "./types/Category.inputs";

@Resolver((_of) => Category)
export class CategoryResolvers {
  @Authorized()
  @Query((_returns) => [Category])
  async getCategories(@Ctx("user") user: Partial<User>) {
    const categories = await CategoryModel.find({
      $or: [{ userId: user._id }, { userId: undefined }],
    });

    return categories;
  }

  @Authorized()
  @Mutation((_returns) => Category)
  async addNewCategory(
    @Arg("categoryInfo") categoryInfo: CategoryInput,
    @Ctx("user") user: Partial<User>
  ) {
    // on vérifie si une catégorie avec ce nom existe déjà pour l'utilisateur
    const existingCategory = await CategoryModel.findOne({
      $or: [
        {
          name: categoryInfo.name,
          userId: user._id,
        },
        {
          name: categoryInfo.name,
          userId: undefined,
        },
      ],
    });

    if (existingCategory != undefined) {
      throw new UserInputError("Existing category", {
        errors: { category: "Cette catégorie existe déjà." },
      });
    }

    const newCategory = new CategoryModel({
      ...categoryInfo,
      userId: user._id,
    });

    return await newCategory.save();
  }

  @Authorized()
  @Mutation((_return) => String, { nullable: true })
  async removeCategory(
    @Arg("id") id: string,
    @Ctx("user") user: Partial<User>
  ) {
    try {
      const result = await CategoryModel.deleteOne({
        _id: id,
        userId: user._id,
      });

      if (result.ok == undefined) {
        throw new Error("Une erreur est survenue");
      }

      if (result.deletedCount == 0) {
        throw new Error(
          "Erreur lors de la suppression: catégorie introuvable."
        );
      }

      return "Delete success";
    } catch (err) {
      throw new Error(err);
    }
  }
}
