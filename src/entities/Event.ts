import { getModelForClass, prop as Property, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, Float, ID, ObjectType } from "type-graphql";
import { Category } from "./Category";
import { User } from "./User";

@ObjectType({ description: "Event model" })
export class Event {
  @Field((_type) => ID)
  _id: Types.ObjectId;

  @Field()
  @Property({})
  body: string;

  @Field((_type) => Float)
  @Property()
  amount: number;

  @Field((_type) => Date)
  @Property()
  date: Date;

  @Field()
  @Property()
  recurrent: boolean;

  @Field((_type) => String)
  @Property({ ref: User, required: true })
  userId: Ref<User>;

  @Field((_type) => String)
  @Property({ ref: Category, required: true })
  categoryId: Ref<Category>;

  @Field((_type) => Date)
  @Property({ default: new Date() })
  createdAt: Date;
}

export const EventModel = getModelForClass(Event);
