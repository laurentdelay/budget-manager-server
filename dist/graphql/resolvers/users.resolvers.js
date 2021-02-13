"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const user_model_1 = __importDefault(require("../../models/user.model"));
const password_1 = require("../../utils/password");
const token_1 = require("../../utils/token");
const validators_1 = require("../../utils/validators");
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
        async register(_, { userInput: { email, password, confirmPassword, username = "", firstName = "", lastName = "", }, }) {
            // validation des données
            const { errors, valid } = validators_1.validateRegisterInput(email, password, confirmPassword);
            if (!valid) {
                throw new apollo_server_1.UserInputError("Input error", { errors });
            }
            // on retire les espaces inutiles
            email = email.trim();
            // vérification que l'email n'est pas déjà utilisé
            const user = await user_model_1.default.findOne({ email });
            if (user) {
                throw new apollo_server_1.UserInputError("Existing email", {
                    errors: { email: "L'email est déjà utilisé." },
                });
            }
            // on retire les espaces inutiles => le mot de passe est vérifié avant l'envoi
            firstName = firstName.trim();
            lastName = lastName.trim();
            username = username.trim();
            password = await password_1.hashPassword(password, 12);
            const newUser = new user_model_1.default({
                email,
                password,
                username,
                firstName,
                lastName,
                createdAt: new Date(),
            });
            try {
                const result = await newUser.save();
                const token = token_1.generateToken(result);
                return { ...result._doc, id: result._id, token };
            }
            catch (error) {
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
            const { errors, valid } = validators_1.validateLoginInput(email, password);
            if (!valid) {
                throw new apollo_server_1.UserInputError("Input error", { errors });
            }
            // récupération de l'uilisateur
            const user = await user_model_1.default.findOne({ email });
            // on vérifie qu'il existe
            if (!user) {
                throw new apollo_server_1.UserInputError("Wrong email", {
                    errors: { email: "L'utilisateur n'existe pas" },
                });
            }
            const validPassword = await password_1.checkPassword(password, user.password);
            if (!validPassword) {
                throw new apollo_server_1.UserInputError("Wrong password", {
                    errors: { password: "Le mot de passe ne correspond pas." },
                });
            }
            const token = token_1.generateToken(user);
            return { ...user._doc, id: user._id, token };
        },
        /**
         *
         *  changement de mot de passe
         *
         */
        async changePassword(_, { userInput: { oldPassword, newPassword, confirmNewPassword } }, context) {
            // on vérifie que l'utilisateur est connecté
            const loggedUser = token_1.checkAuth(context);
            if (!loggedUser) {
                throw new apollo_server_1.AuthenticationError("Vous devez être connecté.");
            }
            // on vérifie que la saisie est conforme
            const { valid, errors } = validators_1.validateChangePasswordInput(oldPassword, newPassword, confirmNewPassword);
            if (!valid) {
                throw new apollo_server_1.UserInputError("Input error", { errors });
            }
            // fetch complete user info
            let user = await user_model_1.default.findOne({ email: loggedUser.email });
            // vérification du mot de passe fourni
            const validPassword = await password_1.checkPassword(oldPassword, user.password);
            if (!validPassword) {
                throw new apollo_server_1.UserInputError("Wrong password", {
                    errors: { password: "Le mot de passe ne correspond pas." },
                });
            }
            // hash du nouveau mot de passe
            newPassword = await password_1.hashPassword(newPassword);
            user = await user_model_1.default.findOneAndUpdate({ email: loggedUser.email }, { password: newPassword });
            const token = token_1.generateToken(user);
            return { ...user._doc, id: user._id, token, password: newPassword };
        },
        /**
         *
         *  changement des informations utilisateur
         *
         */
        async updateInfo(_, { userInput: { username, firstName, lastName } }, context) {
            const loggedUser = token_1.checkAuth(context);
            if (!loggedUser) {
                throw new apollo_server_1.AuthenticationError("Vous devez être connecté.");
            }
            try {
                const updatedUser = await user_model_1.default.findOneAndUpdate({ email: loggedUser.email }, { username, firstName, lastName });
                const token = token_1.generateToken(updatedUser);
                return {
                    ...updatedUser._doc,
                    token,
                    id: updatedUser._id,
                    username,
                    firstName,
                    lastName,
                };
            }
            catch (error) {
                throw new Error();
            }
        },
    },
};
module.exports = usersResolvers;
