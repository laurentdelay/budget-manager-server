import { DocumentType } from "@typegoose/typegoose";
import { UserInputError } from "apollo-server-express";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { GoalModel } from "../entities/Goal";
import { Savings, SavingsModel } from "../entities/Savings";
import { User } from "../entities/User";
import { SavingsInput } from "./types/Savings.types";

@Resolver((_of) => Savings)
export class SavingsResolvers {
  @Authorized()
  @Query((_results) => [Savings])
  async getSavings(@Ctx("user") user: Partial<User>) {
    return await SavingsModel.find({ userId: user.id });
  }

  @Authorized()
  @Query((_results) => [Savings])
  async getSavingsByGoal(
    @Arg("goalId") goalId: string,
    @Ctx("user") user: Partial<User>
  ) {
    return await SavingsModel.find({ goalId, userId: user.id });
  }

  @Authorized()
  @Mutation((_results) => Savings)
  async addSavings(
    @Arg("savingsInfo") savingsInfo: SavingsInput,
    @Ctx("user") user: Partial<User>
  ) {
    // on vérifie que l'objectif existe
    const goal = await GoalModel.findOne({
      _id: savingsInfo.goalId,
      userId: user.id,
    });

    if (goal == null) {
      throw new UserInputError("Goal not found", {
        errors: {
          goal: "Objectif introuvable",
        },
      });
    }

    const newSavings = new SavingsModel({
      ...savingsInfo,
      userId: user.id,
      createdAt: new Date(),
    });

    return await newSavings.save();
  }

  @Authorized()
  @Mutation((_results) => String)
  async removeSavings(
    @Arg("savingsId") savingsId: string,
    @Ctx("user") user: Partial<User>
  ) {
    const result = await SavingsModel.deleteOne({
      _id: savingsId,
      userId: user.id,
    });

    if (result.ok == undefined) {
      throw new Error("Une erreur est survenue lors de la suppression.");
    }

    if (result.deletedCount === 0) {
      throw new Error("Erreur lors de la suppression: épargne introuvable.");
    }

    return "Delete complete";
  }

  @FieldResolver()
  async goal(@Root() savings: DocumentType<Savings>) {
    return await GoalModel.findById(savings.goalId);
  }
}
