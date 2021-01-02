const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcrypt");

const User = require("../../models/user.model");
const { generateToken } = require("../../utils/functions");
const { validateRegisterInput } = require("../../utils/validators");

const usersResolvers = {
  Mutation: {
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
        throw new UserInputError("Erreurs saisie", errors);
      }
      try {
        // vérification que l'email n'est pas déjà utilisé
        const user = await User.findOne({ email });

        if (user) {
          throw new UserInputError("Email déjà utilisé", {
            errors: { email: "L'email est déjà utilisé." },
          });
        }
      } catch (error) {
        throw new Error(error);
      }

      password = await bcrypt.hash(password, 12);
      let fullName = `${firstName}${firstName ? " " : ""}${lastName}`;
      const newUser = new User({
        email,
        password,
        username,
        firstName,
        lastName,
        fullName,
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
  },
};

module.exports = usersResolvers;
