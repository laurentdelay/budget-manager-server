import { Ref } from "@typegoose/typegoose";
import { IsNumber, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Goal } from "../../entities/Goal";
import { Savings } from "../../entities/Savings";

@InputType()
export class SavingsInput implements Partial<Savings> {
  @Field((_type) => String)
  @IsString()
  goalId: Ref<Goal>;

  @Field()
  @IsNumber()
  amount: number;
}
