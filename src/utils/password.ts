import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPass: string = await bcrypt.hash(password, 12);

  return hashedPass;
};

export const checkPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const match: boolean = await bcrypt.compare(password, hashedPassword);

  return match;
};
