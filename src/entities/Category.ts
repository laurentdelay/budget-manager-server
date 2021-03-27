import { getModelForClass, prop as Property, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";
import { Positivity } from "./utils/Positivity.enum";

@ObjectType({ description: "Category model" })
export class Category {
  @Field((_type) => ID)
  readonly id: Types.ObjectId;

  @Field()
  @Property()
  name: string;

  @Field((_type) => Positivity)
  @Property()
  action: Positivity;

  @Field((_type) => String, { nullable: true })
  @Property({ ref: User, required: true })
  userId?: Ref<User>;
}

export const CategoryModel = getModelForClass(Category);
