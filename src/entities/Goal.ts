import { getModelForClass, prop as Property, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, Float, ID, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType({ description: "Goal Model" })
export class Goal {
  @Field((_type) => ID)
  _id: Types.ObjectId;

  @Field((_type) => Float, { nullable: true })
  @Property({ required: false })
  amount: number;

  @Field((_type) => String)
  @Property()
  name: string;

  @Field((_type) => String)
  @Property({ ref: User })
  userId: Ref<User>;

  @Field((_type) => Date)
  @Property()
  createdAt: Date;

  @Field((_type) => Boolean)
  @Property({ default: false })
  completed: boolean;

  @Field((_type) => Date, { nullable: true })
  @Property({ required: false })
  completionDate: Date;

  @Field((_type) => Float)
  totalSavings: number;
}

export const GoalModel = getModelForClass(Goal);
