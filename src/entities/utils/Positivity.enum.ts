import { registerEnumType } from "type-graphql";

export enum Positivity {
  NEGATIVE = -1,
  CHOICE,
  POSITIVE,
}

registerEnumType(Positivity, {
  name: "Positivity",
  description: "The effect of a category",
  valuesConfig: { CHOICE: { description: "This let user choose the effect." } },
});

export enum Action {
  SUBSTRACT = -1,
  ADD = 1,
}

registerEnumType(Action, {
  name: "Action",
  description: "The action linked to an event",
});
