import supertest, { SuperTest, Test } from "supertest";
import { createServer } from "../src/server";
import { DBHelper } from "./testSetup";

let request: SuperTest<Test>;
const userDBHelper = new DBHelper();

describe("User resolvers", () => {
  beforeAll(async () => {
    await userDBHelper.startDB("userDB");
    userDBHelper.seedDB();
    const userApp = await createServer();

    request = supertest(userApp);
  });

  afterAll(async () => {
    await userDBHelper.stopDB();
  });

  beforeEach(async () => {
    await userDBHelper.seedDB();
  });

  afterEach(async () => {
    await userDBHelper.cleanUpDB();
  });
  describe("login", () => {
    it("should send an error with missing email", async (done) => {
      const email = "";
      const password = "password";
      request
        .post("/graphql")
        .send({
          query: `
            mutation {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    id
                }
            }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const retrievedError = res.body.errors[0];
          expect(retrievedError.message).toBe("Input error");
          const errorDetails = retrievedError.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("email");
          done();
        });
    });

    it("should send an error with missing password", async (done) => {
      const email = "test@mail.com";
      const password = "";
      request
        .post("/graphql")
        .send({
          query: `
            mutation {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    id
                }
            }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const retrievedError = res.body.errors[0];
          expect(retrievedError.message).toBe("Input error");
          const errorDetails = retrievedError.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("password");
          done();
        });
    });

    it("should send an error with bad email", async (done) => {
      const email = "badMail";
      const password = "password";
      request
        .post("/graphql")
        .send({
          query: `
            mutation {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    id
                }
            }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const retrievedError = res.body.errors[0];
          expect(retrievedError.message).toBe("Input error");
          const errorDetails = retrievedError.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("email");
          done();
        });
    });

    it("should send an error with inexisting email", async (done) => {
      const email = "unknown@mail.com";
      const password = "password";
      request
        .post("/graphql")
        .send({
          query: `
            mutation {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    id
                }
            }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const retrievedError = res.body.errors[0];
          expect(retrievedError.message).toBe("Unknown email");

          const errorDetails = retrievedError.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("email");
          done();
        });
    });

    it("should send an error with a wrong password", async (done) => {
      const email = "test@mail.com";
      const password = "wrongPass";
      request
        .post("/graphql")
        .send({
          query: `
            mutation {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    id
                }
            }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const retrievedError = res.body.errors[0];
          expect(retrievedError.message).toBe("Wrong password");

          const errorDetails = retrievedError.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("password");
          done();
        });
    });

    it("should send back a user for good credentials", async (done) => {
      const email = "test@mail.com";
      const password = "password";

      request
        .post("/graphql")
        .send({
          query: `
            mutation {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    id
                    email
                    password
                    username
                    firstName
                    lastName
                }
            }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const user = res.body.data.login;

          expect(user).toBeDefined();
          expect(user).toHaveProperty("id");
          expect(user).toHaveProperty("email");
          expect(user).toHaveProperty("password");
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("firstName");
          expect(user).toHaveProperty("lastName");
          done();
        });
    });

    it("should send back a user corresponding to credential", async (done) => {
      const email = "test@mail.com";
      const password = "password";

      request
        .post("/graphql")
        .send({
          query: `
            mutation {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    email
                    }
            }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const user = res.body.data.login;

          expect(user.email).toBe(email);

          done();
        });
    });

    it("should send back a user with a hashed password", async (done) => {
      const email = "test@mail.com";
      const password = "password";

      request
        .post("/graphql")
        .send({
          query: `
            mutation {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    password
                }
            }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const user = res.body.data.login;

          expect(user.password).not.toBe(password);
          done();
        });
    });

    it("should send back a user with a token", async (done) => {
      const email = "test@mail.com";
      const password = "password";

      request
        .post("/graphql")
        .send({
          query: `
            mutation {
                login(userInput: {email: "${email}", password: "${password}"}) {
                    token
                }
            }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const login = res.body.data.login;

          expect(login).toHaveProperty("token");
          done();
        });
    });
  });

  describe("register", () => {
    it("should send an error with missing email", async (done) => {
      const email = "";
      const password = "password";
      const confirmPassword = "password";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            register(userInput: {
              email: "${email}",
              password: "${password}",
              confirmPassword: "${confirmPassword}",
            }) {id}
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const errors = res.body.errors[0];
          expect(errors.message).toBe("Input error");

          const errorsDetails = errors.extensions;

          expect(errorsDetails.code).toBe("BAD_USER_INPUT");
          expect(errorsDetails.errors).toHaveProperty("email");
          done();
        });
    });
    it("should send an error with missing password", async (done) => {
      const email = "test@mail.com";
      const password = "";
      const confirmPassword = "password";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            register(userInput: {
              email: "${email}",
              password: "${password}",
              confirmPassword: "${confirmPassword}",
            }) {id}
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const errors = res.body.errors[0];
          expect(errors.message).toBe("Input error");

          const errorsDetails = errors.extensions;

          expect(errorsDetails.code).toBe("BAD_USER_INPUT");
          expect(errorsDetails.errors).toHaveProperty("password");
          done();
        });
    });
    it("should send an error with passwords not matching", async (done) => {
      const email = "test@mail.com";
      const password = "password";
      const confirmPassword = "otherword";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            register(userInput: {
              email: "${email}",
              password: "${password}",
              confirmPassword: "${confirmPassword}",
            }) {id}
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const errors = res.body.errors[0];
          expect(errors.message).toBe("Input error");

          const errorsDetails = errors.extensions;

          expect(errorsDetails.code).toBe("BAD_USER_INPUT");
          expect(errorsDetails.errors).toHaveProperty("confirmPassword");
          done();
        });
    });
    it("should send an error with bad email format", async (done) => {
      const email = "notEmail";
      const password = "password";
      const confirmPassword = "password";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            register(userInput: {
              email: "${email}",
              password: "${password}",
              confirmPassword: "${confirmPassword}"
          }) {id}
          }        
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const errors = res.body.errors[0];

          expect(errors.message).toBe("Input error");

          const errorDetails = errors.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("email");

          done();
        });
    });

    it("should send an error with already existing email", async (done) => {
      const email = "test@mail.com";
      const password = "password";
      const confirmPassword = "password";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            register(userInput: {
              email: "${email}",
              password: "${password}",
              confirmPassword: "${confirmPassword}",
            }) {id}
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const errors = res.body.errors[0];
          expect(errors.message).toBe("Existing email");

          const errorsDetails = errors.extensions;

          expect(errorsDetails.code).toBe("BAD_USER_INPUT");
          expect(errorsDetails.errors).toHaveProperty("email");
          done();
        });
    });

    it("should send back the newly created user", async (done) => {
      const email = "new@mail.com";
      const password = "password";
      const confirmPassword = "password";
      const username = "newUsername";
      const firstName = "new";
      const lastName = "user";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            register(userInput: {
              email: "${email}",
              password: "${password}",
              confirmPassword: "${confirmPassword}",
              username: "${username}",
              firstName: "${firstName}",
              lastName: "${lastName}"
            }) {
              id
              email
              password
              username
              firstName
              lastName
            }
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const newUser = res.body.data.register;

          expect(newUser).not.toBeUndefined();

          expect(newUser).toHaveProperty("id");
          expect(newUser).toHaveProperty("email");
          expect(newUser).toHaveProperty("password");
          expect(newUser).toHaveProperty("username");
          expect(newUser).toHaveProperty("firstName");
          expect(newUser).toHaveProperty("lastName");
          done();
        });
    });

    it("should send back the newly created user with corresponding info", async (done) => {
      const email = "new@mail.com";
      const password = "password";
      const confirmPassword = "password";
      const username = "newUsername";
      const firstName = "new";
      const lastName = "user";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            register(userInput: {
              email: "${email}",
              password: "${password}",
              confirmPassword: "${confirmPassword}",
              username: "${username}",
              firstName: "${firstName}",
              lastName: "${lastName}"
            }) {
              id
              email
              password
              username
              firstName
              lastName
            }
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const newUser = res.body.data.register;

          expect(newUser.email).toBe(email);
          expect(newUser.username).toBe(username);
          expect(newUser.firstName).toBe(firstName);
          expect(newUser.lastName).toBe(lastName);

          done();
        });
    });

    it("should send back a user with a hashed password", async (done) => {
      const email = "new@mail.com";
      const password = "password";
      const confirmPassword = "password";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            register(userInput: {
              email: "${email}",
              password: "${password}",
              confirmPassword: "${confirmPassword}",
            }) {
              password
            }
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const newUser = res.body.data.register;

          expect(newUser.password).not.toBe(password);
          done();
        });
    });

    it("should send back a user with a token", async (done) => {
      const email = "new@mail.com";
      const password = "password";
      const confirmPassword = "password";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            register(userInput: {
              email: "${email}",
              password: "${password}",
              confirmPassword: "${confirmPassword}",
            }) {
              token
            }
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const newUser = res.body.data.register;

          expect(newUser).toHaveProperty("token");

          done();
        });
    });

    it("should send back a user with a balance of 0", async (done) => {
      const email = "new@mail.com";
      const password = "password";
      const confirmPassword = "password";

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          register(userInput: {
            email: "${email}",
            password: "${password}",
            confirmPassword: "${confirmPassword}",
          }) {
            balance
          }
        }
      `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const newUser = res.body.data.register;

          expect(newUser.balance).not.toBeUndefined();

          expect(newUser.balance).toBe(0);

          done();
        });
    });
  });

  describe("changePassword", () => {
    it("should send an error when no user is authenticated", async (done) => {
      const oldPassword = "password";
      const newPassword = "newPassword";
      const confirmNewPassword = "newPassword";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            changePassword(userInput: {
              oldPassword: "${oldPassword}",
              newPassword: "${newPassword}",
              confirmNewPassword: "${confirmNewPassword}"
            }) {
              id
            }
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.extensions.code).toBe("UNAUTHENTICATED");
          done();
        });
    });

    it("should send an error with missing oldPassword", async (done) => {
      const oldPassword = "";
      const newPassword = "newPassword";
      const confirmNewPassword = "newPassword";

      request
        .post("/graphql")
        .set("Authorization", userDBHelper.authorizationHeader)
        .send({
          query: `
          mutation {
            changePassword(userInput: {
              oldPassword: "${oldPassword}",
              newPassword: "${newPassword}",
              confirmNewPassword: "${confirmNewPassword}"
            }) {
              id
            }
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.message).toBe("Input error");

          const errorDetails = error.extensions;
          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("oldPassword");
          done();
        });
    });

    it("should send an error with missing newPassword", async (done) => {
      const oldPassword = "password";
      const newPassword = "";
      const confirmNewPassword = "newPassword";

      request
        .post("/graphql")
        .set("Authorization", userDBHelper.authorizationHeader)
        .send({
          query: `
          mutation {
            changePassword(userInput: {
              oldPassword: "${oldPassword}",
              newPassword: "${newPassword}",
              confirmNewPassword: "${confirmNewPassword}"
            }) {
              id
            }
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.message).toBe("Input error");

          const errorDetails = error.extensions;
          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("newPassword");
          done();
        });
    });

    it("should send an error with wrong oldPassword", async (done) => {
      const oldPassword = "wrongPassword";
      const newPassword = "newPassword";
      const confirmNewPassword = "newPassword";

      request
        .post("/graphql")
        .set("Authorization", userDBHelper.authorizationHeader)
        .send({
          query: `
          mutation {
            changePassword(userInput: {
              oldPassword: "${oldPassword}",
              newPassword: "${newPassword}",
              confirmNewPassword: "${confirmNewPassword}"
            }) {
              id
            }
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.message).toBe("Wrong password");

          const errorDetails = error.extensions;
          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("oldPassword");
          done();
        });
    });

    it("should send an error with new passwords not matching", async (done) => {
      const oldPassword = "password";
      const newPassword = "newPassword";
      const confirmNewPassword = "otherNewPassword";

      request
        .post("/graphql")
        .set("Authorization", userDBHelper.authorizationHeader)
        .send({
          query: `
          mutation {
            changePassword(userInput: {
              oldPassword: "${oldPassword}",
              newPassword: "${newPassword}",
              confirmNewPassword: "${confirmNewPassword}"
            }) {
              id
            }
          }
        `,
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.message).toBe("Input error");

          const errorDetails = error.extensions;
          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("confirmNewPassword");
          done();
        });
    });
  });

  describe("updateInfo", () => {});
});
