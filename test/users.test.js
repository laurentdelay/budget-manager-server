const { expect } = require("chai");
const request = require("supertest");
const {
  startDatabase,
  stopDatabase,
  getTestToken,
} = require("./test_database/testDabase");
const app = require("../src/server");

const testToken = getTestToken();

beforeEach(async () => {
  await startDatabase();
});

afterEach(async () => {
  await stopDatabase();
});

describe("Users resolvers", () => {
  describe("register", () => {
    it("should throw an error if email is missing", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query:
            'mutation { register(userInput: {email: "", password:"testPass", confirmPassword: "testPass"}) { id } }',
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved an 'Input error'")
            .to.have.property("message")
            .equal("Input error");
          expect(errorDetails, "Email missing").to.exist.and.have.property(
            "email"
          );
          done();
        });
    });

    it("should throw an error if password is missing", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query:
            'mutation { register(userInput: {email: "test@mail.com", password:"", confirmPassword: "testPass"}) { id } }',
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved an 'Input error'")
            .to.have.property("message")
            .equal("Input error");
          expect(errorDetails, "Password missing").to.exist.and.have.property(
            "password"
          );
          done();
        });
    });

    it("should throw an error if passwords do not match", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query:
            'mutation { register(userInput: {email: "test@mail.com", password:"somePassword", confirmPassword: "anotherPassword"}) { id } }',
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved an 'Input error'")
            .to.have.property("message")
            .equal("Input error");
          expect(
            errorDetails,
            "Passwords don't match"
          ).to.exist.and.have.property("confirmPassword");
          done();
        });
    });

    it("should throw an error if email is already used", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query:
            'mutation { register(userInput: {email: "test@mail.com", password:"password", confirmPassword: "password"}) { id } }',
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(retrievedError, "Retrieved an existing email error")
            .to.have.property("message")
            .equal("Existing email");
          expect(errorDetails, "Email error exists").to.exist.and.have.property(
            "email"
          );
          done();
        });
    });

    it("should return the created user as an object containing a token", (done) => {
      const randomNum = Math.floor(Math.random() * 1000 * 1000);

      request(app)
        .post("/graphql")
        .send({
          query: `mutation { register(userInput: {email: "test${randomNum}@mail.com", password:"somePassword", confirmPassword: "somePassword"}) { token } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const data = res.body.data.register;
          expect(res.status, "Status code").to.be.equal(200);
          expect(data, "Returned object").to.exist.and.be.a("object");
          done();
        });
    });

    it("should return the created user as an object containing a token", (done) => {
      const randomNum = Math.floor(Math.random() * 1000 * 1000);

      request(app)
        .post("/graphql")
        .send({
          query: `mutation { register(userInput: {email: "test${randomNum}@mail.com", password:"somePassword", confirmPassword: "somePassword"}) { token } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const { token } = res.body.data.register;
          expect(res.status, "Status code").to.be.equal(200);
          expect(token, "Returned token").to.exist.and.be.a("string");
          done();
        });
    });

    it("should return a user object containing an encrypted password", (done) => {
      const randomNum = Math.floor(Math.random() * 1000 * 1000);
      const providedPassword = "password";

      request(app)
        .post("/graphql")
        .send({
          query: `mutation { register(userInput: {email: "test${randomNum}@mail.com", password:"${providedPassword}", confirmPassword: "${providedPassword}"}) { password } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const returnedPassword = res.body.data.register.password;
          expect(res.status, "Status code").to.be.equal(200);
          expect(
            returnedPassword,
            "Provided password is encrypted"
          ).to.exist.and.be.not.equal(providedPassword);
          done();
        });
    });
  });

  describe("login", () => {
    it("should throw an error if email input is missing", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query:
            'mutation { login(userInput: {email: "", password:"password"}) { id } }',
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved an 'Input error'")
            .to.have.property("message")
            .equal("Input error");
          expect(errorDetails, "Email missing").to.exist.and.have.property(
            "email"
          );
          done();
        });
    });

    it("should throw an error if password input is missing", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query:
            'mutation { login(userInput: {email: "test@mail.com", password:""}) { id } }',
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved an 'Input error'")
            .to.have.property("message")
            .equal("Input error");
          expect(errorDetails, "Password missing").to.exist.and.have.property(
            "password"
          );
          done();
        });
    });

    it("should throw an error if the user doesn't exist", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query:
            'mutation { login(userInput: {email: "wrong@mail.com", password:"password"}) { id } }',
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved a wrong email error")
            .to.have.property("message")
            .equal("Wrong email");
          expect(
            errorDetails,
            "Email does not exist"
          ).to.exist.and.have.property("email");
          done();
        });
    });

    it("should throw an error if the password doesn't match", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query:
            'mutation { login(userInput: {email: "test@mail.com", password:"wrongPassword"}) { id } }',
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved a wrong password error")
            .to.have.property("message")
            .equal("Wrong password");
          expect(errorDetails, "Password is wrong").to.exist.and.have.property(
            "password"
          );
          done();
        });
    });

    it("should return a user object containing a token", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query: `mutation { login(userInput: {email: "test@mail.com", password:"password"}) { token } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const { token } = res.body.data.login;
          expect(res.status, "Status code").to.be.equal(200);
          expect(token, "Returned token").to.exist.and.be.a("string");
          done();
        });
    });

    it("should return a user object with corresponding email", (done) => {
      const providedMail = "test@mail.com";
      request(app)
        .post("/graphql")
        .send({
          query: `mutation { login(userInput: {email: "${providedMail}", password:"password"}) { email } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const { email } = res.body.data.login;
          expect(res.status, "Status code").to.be.equal(200);
          expect(email, "Returned email").to.exist.and.be.equal(providedMail);
          done();
        });
    });
  });

  describe("change password", () => {
    it("should throw an error if user is not logged in", (done) => {
      const oldPassword = "oldPassword";
      const newPassword = "newPassword";
      const confirmNewPassword = "newPassword";

      request(app)
        .post("/graphql")
        .send({
          query: `mutation { changePassword(userInput: {oldPassword: "${oldPassword}", newPassword:"${newPassword}", confirmNewPassword:"${confirmNewPassword}"}) { id } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const errorCode = res.body.errors[0].extensions.code;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(errorCode, "Auth required").to.exist.and.be.equal(
            "UNAUTHENTICATED"
          );
          done();
        });
    });

    it("should throw an error if old password is not provided", (done) => {
      const oldPassword = "";
      const newPassword = "newPassword";
      const confirmNewPassword = "newPassword";

      request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          query: `mutation { changePassword(userInput: {oldPassword: "${oldPassword}", newPassword:"${newPassword}", confirmNewPassword:"${confirmNewPassword}"}) { id } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved an Input error")
            .to.have.property("message")
            .equal("Input error");
          expect(
            errorDetails,
            "Old password missing"
          ).to.exist.and.have.property("oldPassword");
          done();
        });
    });

    it("should throw an error if new password is not provided", (done) => {
      const oldPassword = "password";
      const newPassword = "";
      const confirmNewPassword = "newPassword";

      request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          query: `mutation { changePassword(userInput: {oldPassword: "${oldPassword}", newPassword:"${newPassword}", confirmNewPassword:"${confirmNewPassword}"}) { id } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved an Input error")
            .to.have.property("message")
            .equal("Input error");
          expect(
            errorDetails,
            "New password missing"
          ).to.exist.and.have.property("newPassword");
          done();
        });
    });

    it("should throw an error if new passwords are different", (done) => {
      const oldPassword = "password";
      const newPassword = "newPassword";
      const confirmNewPassword = "differentPassword";

      request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          query: `mutation { changePassword(userInput: {oldPassword: "${oldPassword}", newPassword:"${newPassword}", confirmNewPassword:"${confirmNewPassword}"}) { id } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved an Input error")
            .to.have.property("message")
            .equal("Input error");
          expect(
            errorDetails,
            "New passwords different"
          ).to.exist.and.have.property("confirmNewPassword");
          done();
        });
    });

    it("should throw an error if old password does not match", (done) => {
      const oldPassword = "wrongOldPassword";
      const newPassword = "newPassword";
      const confirmNewPassword = "newPassword";

      request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          query: `mutation { changePassword(userInput: {oldPassword: "${oldPassword}", newPassword:"${newPassword}", confirmNewPassword:"${confirmNewPassword}"}) { id } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const retrievedError = res.body.errors[0];
          const errorDetails = retrievedError.extensions.errors;

          expect(res.status, "Error Code").to.be.equal(500);
          expect(retrievedError, "Retrieved an Input error")
            .to.have.property("message")
            .equal("Wrong password");
          expect(
            errorDetails,
            "Password not matching"
          ).to.exist.and.have.property("password");
          done();
        });
    });

    it("should return a user with a token", (done) => {
      const oldPassword = "password";
      const newPassword = "newPassword";
      const confirmNewPassword = "newPassword";

      request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          query: `mutation { changePassword(userInput: {oldPassword: "${oldPassword}", newPassword:"${newPassword}", confirmNewPassword:"${confirmNewPassword}"}) { token password } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const { token } = res.body.data.changePassword;

          expect(res.status, "Error Code").to.be.equal(200);
          expect(token, "Retrieved a token").to.exist.and.be.a("string");
          done();
        });
    });
  });

  describe("update info", () => {
    it("should throw an error if user is not logged in", (done) => {
      const username = "Superman";
      const firstName = "Clark";
      const lastName = "Kent";

      request(app)
        .post("/graphql")
        .send({
          query: `mutation { updateInfo(userInput: {username: "${username}", firstName:"${firstName}", lastName:"${lastName}"}) { id } }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const errorCode = res.body.errors[0].extensions.code;
          expect(res.status, "Error Code").to.be.equal(500);
          expect(errorCode, "Auth required").to.exist.and.be.equal(
            "UNAUTHENTICATED"
          );
          done();
        });
    });

    it("should return a user with updated info", (done) => {
      const usernameInput = "Superman";
      const firstNameInput = "Clark";
      const lastNameInput = "Kent";

      request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          query: `mutation { updateInfo(userInput: {username: "${usernameInput}", firstName:"${firstNameInput}", lastName:"${lastNameInput}"}) { id username firstName lastName} }`,
        })
        .end((err, res) => {
          if (err) done(new Error(err));

          const { username, firstName, lastName } = res.body.data.updateInfo;

          expect(username).to.exist.and.be.equal(usernameInput);
          expect(firstName).to.exist.and.be.equal(firstNameInput);
          expect(lastName).to.exist.and.be.equal(lastNameInput);
          done();
        });
    });
  });
});
