import { IsNumber, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class SavingsInput {
  @Field()
  @IsString()
  goalId: string;

  @Field()
  @IsNumber()
  amount: number;
}
