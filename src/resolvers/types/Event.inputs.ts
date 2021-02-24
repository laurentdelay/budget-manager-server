import { Ref } from "@typegoose/typegoose";
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from "class-validator";
import { Field, InputType } from "type-graphql";
import { Category } from "../../entities/Category";
import { Event } from "../../entities/Event";
import { Action } from "../../entities/utils/Positivity.enum";

@InputType()
export class EventInput implements Partial<Event> {
  @Field()
  @Length(1, 50)
  body: string;

  @Field((_type) => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @Field((_type) => Date)
  @IsDate()
  date: Date;

  @Field((_type) => Action)
  action: Action;

  @Field((_type) => Boolean)
  @IsBoolean()
  recurrent: boolean;

  @Field((_type) => String)
  @IsString()
  categoryId: Ref<Category>;
}
