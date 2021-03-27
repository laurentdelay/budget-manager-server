import { AuthenticationError, UserInputError } from "apollo-server-express";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";
import jwt from "jsonwebtoken";

import { User, UserModel } from "../entities/User";
import {
  ChangePasswordInput,
  LoginInput,
  PersonnalInfoInput,
  RegisterInput,
} from "./types/User.inputs";

import { SECRET_KEY } from "../utils/envVars";
import { DocumentType } from "@typegoose/typegoose";
import { EventModel } from "../entities/Event";

@Resolver((_of) => User)
export class UserResolvers {
  @Mutation((_returns) => User)
  async login(
    @Arg("userInput")
    { email, password }: LoginInput
  ) {
    const user = await UserModel.findOne({ email });

    if (user == undefined) {
      throw new UserInputError("Unknown email", {
        errors: { email: "Aucun utilisateur trouvé pour cet email." },
      });
    }

    if (!(await user.checkPassword(password))) {
      throw new UserInputError("Wrong password", {
        errors: { password: "Le mot de passe ne correspond pas." },
      });
    }

    return user;
  }

  @Mutation(() => User)
  async register(
    @Arg("userInput")
    {
      email,
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
    }: RegisterInput
  ) {
    // TODO: validation avec class-validator
    if (password != confirmPassword) {
      throw new UserInputError("Input error", {
        errors: { confirmPassword: "Les mots de passe ne correspondent pas." },
      });
    }

    const user = await UserModel.findOne({ email });

    if (user != undefined) {
      throw new UserInputError("Existing email", {
        errors: { email: "L'email est déjà utilisé." },
      });
    }

    // on retire les espaces inutiles
    firstName = firstName?.trim() ?? "";
    lastName = lastName?.trim() ?? "";
    username = username?.trim() ?? "";

    const newUser = new UserModel({
      email,
      username,
      firstName,
      lastName,
      createdAt: new Date(),
    });

    await newUser.hashPassword(password);

    try {
      const createdUser = await newUser.save();

      return createdUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Authorized()
  @Mutation((_returns) => User)
  async changePassword(
    @Arg("userInput")
    { oldPassword, newPassword, confirmNewPassword }: ChangePasswordInput,
    @Ctx("user") user: Partial<User>
  ) {
    if (newPassword != confirmNewPassword) {
      throw new UserInputError("Input error", {
        errors: {
          confirmNewPassword: "Les mots de passe ne correspondent pas.",
        },
      });
    }

    let dbUser = await UserModel.findOne({ email: user.email });

    if (dbUser == undefined) {
      throw new AuthenticationError("Something went wrong: user not found");
    }

    if (!(await dbUser.checkPassword(oldPassword))) {
      throw new UserInputError("Wrong password", {
        errors: { oldPassword: "Le mot de passe ne correspond pas." },
      });
    }

    await dbUser.hashPassword(newPassword);

    try {
      await dbUser.save();

      return dbUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Authorized()
  @Mutation((_returns) => User)
  async updateInfo(
    @Arg("userInput") { username, firstName, lastName }: PersonnalInfoInput,
    @Ctx("user") user: Partial<User>
  ) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: user.email },
        { username, firstName, lastName }
      );

      if (updatedUser == undefined) {
        throw new Error("something went wrong : could not update user");
      }

      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  @FieldResolver()
  token(
    @Root() { id, email, username, fullName, createdAt }: DocumentType<User>
  ) {
    const token = jwt.sign(
      {
        id,
        email,
        username,
        fullName,
        createdAt,
      },
      SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    return token;
  }

  @FieldResolver()
  async balance(@Root() { id: userId }: DocumentType<User>) {
    const events = await EventModel.find({ userId });

    let balance = 0;

    for (const event of events) {
      balance += event.amount * event.action;
    }

    return balance;
  }
}
