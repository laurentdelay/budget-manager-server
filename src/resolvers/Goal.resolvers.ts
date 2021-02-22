import { UserInputError } from "apollo-server-express";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Goal, GoalModel } from "../entities/Goal";
import { User } from "../entities/User";
import { GoalInput } from "./types/Goal.inputs";

@Resolver((_of) => Goal)
export class GoalResolvers {
  @Authorized()
  @Query((_returns) => [Goal])
  async getGoals(@Ctx("user") user: Partial<User>) {
    const goals = await GoalModel.find({ userId: user._id });

    return goals;
  }

  @Authorized()
  @Mutation((_returns) => Goal)
  async createGoal(
    @Arg("goalInfo") goalInfo: GoalInput,
    @Ctx("user") user: Partial<User>
  ) {
    const existingGoal = await GoalModel.findOne({
      name: goalInfo.name,
      userId: user._id,
    });

    if (existingGoal != null) {
      throw new UserInputError("Existing Goal", {
        errors: {
          name: "Vous avez déjà un objectif avec ce nom.",
        },
      });
    }

    const newGoal = new GoalModel({
      ...goalInfo,
      userId: user._id,
      createdAt: new Date(),
    });

    try {
      return await newGoal.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Authorized()
  @Mutation((_returns) => String)
  async removeGoal(
    @Arg("goalId") goalId: string,
    @Ctx("user") user: Partial<User>
  ) {
    try {
      const result = await GoalModel.deleteOne({
        _id: goalId,
        userId: user._id,
      });

      if (result.ok == undefined) {
        throw new Error("Une erreur est survenue lors de la suppression.");
      }

      if (result.deletedCount === 0) {
        throw new Error("Erreur lors de la suppression: objectif introuvable.");
      }

      return "Delete success";
    } catch (err) {
      throw new Error(err);
    }
  }

  @Authorized()
  @Mutation((_returns) => Goal)
  async updateGoal(
    @Arg("goalInfo") goalInfo: GoalInput,
    @Arg("goalId") goalId: string,
    @Ctx("user") user: Partial<User>
  ) {
    const goal = await GoalModel.findOne({ _id: goalId, userId: user._id });

    if (goal == null) {
      throw new UserInputError("Goal Not Found", {
        errors: {
          goal: "Objectif introuvable",
        },
      });
    }

    goal.name = goalInfo.name;
    goal.amount = goalInfo.amount;

    return await goal.save();
  }
}
