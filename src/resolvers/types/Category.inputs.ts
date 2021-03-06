import { MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Category } from "../../entities/Category";
import { Positivity } from "../../entities/utils/Positivity.enum";

@InputType()
export class CategoryInput implements Partial<Category> {
  @Field()
  @MinLength(3, {
    message:
      "Le nom de la catégories doit comporter au moins $constraint1 caractères.",
  })
  @MaxLength(20, {
    message:
      "Le nom de la catégorie ne peut pas dépasser $constraint1 caractères.",
  })
  name: string;

  @Field((_type) => Positivity, { defaultValue: Positivity.CHOICE })
  action: Positivity;
}
