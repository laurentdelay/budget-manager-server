export interface ITokenUser {
  id: string;
  email: string;
  createdAt: Date;
}

export interface IUser extends ITokenUser {
  password: string;
  firstName: string;
  lastName: string;
  fullname: string;
  token: string;
}
