import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { User } from "../../entities/User";

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsEmail(undefined, { message: "Vous devez entrer un email valide." })
  email: string;

  @Field()
  @IsString()
  @MinLength(1, { message: "Vous devez entrer un mot de passe." })
  password: string;
}

@InputType()
export class RegisterInput extends LoginInput implements Partial<User> {
  @Field()
  @IsString()
  confirmPassword: string;

  @Field({ nullable: true })
  @MaxLength(12, {
    message:
      "Le nom d'utilisateur ne peut pas dépasser $constraint1 caractères",
  })
  username?: string;

  @Field({ nullable: true })
  @MaxLength(20, {
    message: "Le prénom ne peut pas dépasser $constraint1 caractères",
  })
  firstName?: string;

  @Field({ nullable: true })
  @MaxLength(20, {
    message: "Le nom ne peut pas dépasser $constraint1 caractères",
  })
  lastName?: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsString()
  oldPassword: string;

  @Field()
  @IsString()
  newPassword: string;

  @Field()
  @IsString()
  confirmNewPassword: string;
}

@InputType()
export class PersonnalInfoInput implements Partial<User> {
  @Field()
  @IsString()
  @MaxLength(20, {
    message: "Le $property ne peut pas dépasser $constraint1 caractères.",
  })
  username: string;

  @Field()
  @IsString()
  @MaxLength(20, {
    message: "Le $property ne peut pas dépasser $constraint1 caractères.",
  })
  firstName: string;

  @Field()
  @IsString()
  @MaxLength(20, {
    message: "Le $property ne peut pas dépasser $constraint1 caractères.",
  })
  lastName: string;
}
