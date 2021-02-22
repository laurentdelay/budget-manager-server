import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsPositive,
  Length,
} from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class EventInput {
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

  @Field((_type) => Boolean)
  @IsBoolean()
  recurrent: boolean;

  @Field()
  categoryId: string;
}
