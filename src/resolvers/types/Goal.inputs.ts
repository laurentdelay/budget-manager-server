import { IsNumber, Min } from "class-validator";
import { Field, Float, InputType } from "type-graphql";
import { Goal } from "../../entities/Goal";

@InputType()
export class GoalInput implements Partial<Goal> {
  @Field((_type) => String)
  name: string;

  @Field((_type) => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  amount: number;
}
