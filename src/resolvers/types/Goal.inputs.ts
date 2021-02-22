import { IsNumber, Min } from "class-validator";
import { Field, Float, InputType } from "type-graphql";

@InputType()
export class GoalInput {
  @Field((_type) => String)
  name: string;

  @Field((_type) => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  amount: number;
}
