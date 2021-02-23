import { prop as Property, getModelForClass, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, Float, ID, ObjectType } from "type-graphql";
import { Goal } from "./Goal";
import { User } from "./User";

@ObjectType({ description: "Savings model" })
export class Savings {
  @Field((_type) => ID)
  _id: Types.ObjectId;

  @Field((_type) => Float)
  @Property()
  amount: number;

  @Field((_type) => String)
  @Property({ ref: User })
  userId: Ref<User>;

  @Field((_type) => String)
  @Property({ ref: Goal })
  goalId: Ref<Goal>;

  @Field((_type) => Date)
  @Property()
  createdAt: Date;
}

export const SavingsModel = getModelForClass(Savings);
