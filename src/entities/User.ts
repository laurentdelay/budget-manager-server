import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Field, Float, ID, ObjectType } from "type-graphql";
import { SECRET_KEY } from "../utils/envVars";

@ObjectType({ description: "User model" })
export class User {
  @Field((_type) => ID)
  id: Types.ObjectId;

  @Field()
  @Property()
  email: string;

  @Field()
  @Property()
  password: string;

  @Field()
  @Property()
  username: string;

  @Field()
  @Property()
  firstName: string;

  @Field()
  @Property()
  lastName: string;

  @Field()
  @Property({ default: new Date() })
  createdAt: Date;

  @Field()
  token: string;

  @Field((_type) => Float)
  balance: number;

  get fullName(): string {
    // gestion de l'espace entre les parties du nom
    const space: string = this.firstName?.length > 0 ? " " : "";

    return `${this.firstName ?? ""}${space}${this.lastName ?? ""}`;
  }

  static decodeToken(token: string): Partial<User> {
    try {
      const user: Partial<User> = jwt.verify(
        token,
        SECRET_KEY
      ) as Partial<User>;

      return user;
    } catch (error) {
      throw new Error();
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    const match: boolean = await bcrypt.compare(password, this.password);

    return match;
  }

  async hashPassword(password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 12);

    this.password = hashedPassword;
  }
}

export const UserModel = getModelForClass(User);
