const { UserInputError, AuthenticationError } = require("apollo-server-errors");

const User = require("../../models/user.model");
const { checkPassword, hashPassword } = require("../../utils/password");
const { generateToken, checkAuth } = require("../../utils/token");
const {
  validateRegisterInput,
  validateLoginInput,
  validateChangePasswordInput,
} = require("../../utils/validators");

const usersResolvers = {
  User: {
    // mise à jour auto du nom complet lors d'un changement
    fullName: (parent) => {
      const { firstName, lastName } = parent;
      return `${firstName}${firstName ? " " : ""}${lastName}`;
    },
  },
  Mutation: {
    /**
     *
     *  création de compte
     *
     */
    async register(
      _,
      {
        userInput: {
          email,
          password,
          confirmPassword,
          username = "",
          firstName = "",
          lastName = "",
        },
      }
    ) {
      // validation des données
      const { errors, valid } = validateRegisterInput(
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Input error", { errors });
      }

      // on retire les espaces inutiles
      email = email.trim();

      // vérification que l'email n'est pas déjà utilisé
      const user = await User.findOne({ email });

      if (user) {
        throw new UserInputError("Existing email", {
          errors: { email: "L'email est déjà utilisé." },
        });
      }

      // on retire les espaces inutiles => le mot de passe est vérifié avant l'envoi
      firstName = firstName.trim();
      lastName = lastName.trim();
      username = username.trim();

      password = await hashPassword(password, 12);

      const newUser = new User({
        email,
        password,
        username,
        firstName,
        lastName,
        createdAt: new Date(),
      });

      try {
        const result = await newUser.save();
        const token = generateToken(result);
        return { ...result._doc, id: result._id, token };
      } catch (error) {
        throw new Error(error);
      }
    },

    /**
     *
     *  connexion
     *
     */
    async login(_, { userInput: { email, password } }) {
      // validation des données
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Input error", { errors });
      }

      // récupération de l'uilisateur
      const user = await User.findOne({ email });

      // on vérifie qu'il existe
      if (!user) {
        throw new UserInputError("Wrong email", {
          errors: { email: "L'utilisateur n'existe pas" },
        });
      }

      const validPassword = await checkPassword(password, user.password);

      if (!validPassword) {
        throw new UserInputError("Wrong password", {
          errors: { password: "Le mot de passe ne correspond pas." },
        });
      }

      const token = generateToken(user);

      return { ...user._doc, id: user._id, token };
    },

    /**
     *
     *  changement de mot de passe
     *
     */
    async changePassword(
      _,
      { userInput: { oldPassword, newPassword, confirmNewPassword } },
      context
    ) {
      // on vérifie que l'utilisateur est connecté
      const loggedUser = checkAuth(context);

      if (!loggedUser) {
        throw new AuthenticationError("Vous devez être connecté.");
      }

      // on vérifie que la saisie est conforme
      const { valid, errors } = validateChangePasswordInput(
        oldPassword,
        newPassword,
        confirmNewPassword
      );

      if (!valid) {
        throw new UserInputError("Input error", { errors });
      }

      // fetch complete user info
      let user = await User.findOne({ email: loggedUser.email });

      // vérification du mot de passe fourni
      const validPassword = await checkPassword(oldPassword, user.password);

      if (!validPassword) {
        throw new UserInputError("Wrong password", {
          errors: { password: "Le mot de passe ne correspond pas." },
        });
      }

      // hash du nouveau mot de passe
      newPassword = await hashPassword(newPassword);

      user = await User.findOneAndUpdate(
        { email: loggedUser.email },
        { password: newPassword }
      );

      const token = generateToken(user);

      return { ...user._doc, id: user._id, token, password: newPassword };
    },

    /**
     *
     *  changement des informations utilisateur
     *
     */
    async updateInfo(
      _,
      { userInput: { username, firstName, lastName } },
      context
    ) {
      const loggedUser = checkAuth(context);

      if (!loggedUser) {
        throw new AuthenticationError("Vous devez être connecté.");
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { email: loggedUser.email },
          { username, firstName, lastName }
        );

        const token = generateToken(updatedUser);

        return {
          ...updatedUser._doc,
          token,
          id: updatedUser._id,
          username,
          firstName,
          lastName,
        };
      } catch (error) {
        throw new Error();
      }
    },
  },
};

module.exports = usersResolvers;
