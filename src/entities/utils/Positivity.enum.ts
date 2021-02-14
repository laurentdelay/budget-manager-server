import { registerEnumType } from "type-graphql";

export enum Positivity {
  NEGATIVE = -1,
  CHOICE,
  POSITIVE,
}

registerEnumType(Positivity, {
  name: "Positivity",
  description: "The effect of a catgory",
  valuesConfig: { CHOICE: { description: "This let user choose the effect." } },
});
