import { User } from "../entities/User";

export interface Context {
  user?: Partial<User>;
}
