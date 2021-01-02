const { expect } = require("chai");
const request = require("supertest");
const { startDatabase, stopDatabase } = require("../src/database");
const app = require("../src/server");

beforeEach(async () => {
  await startDatabase();
});

afterEach(async () => {
  await stopDatabase();
});

describe("Users", () => {
  describe("register", () => {
    it("should throw an error if an input is missing", (done) => {
      request(app)
        .post("/graphql")
        .send({
          query:
            'mutation { register(userInput: {email: "test@mail.com", password:"", confirmPassword: "testPass"}) { id } }',
        })
        .end((err, res) => {
          if (err) console.log(err);
          expect(res.status).to.be.equal(500);
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
          if (err) console.log(err);
          expect(res.status).to.be.equal(500);
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
          if (err) console.log(err);
          expect(res.status).to.be.equal(500);
          done();
        });
    });

    it("should return a user object containing a token", (done) => {
      const randomNum = Math.floor(Math.random() * 1000 * 1000);

      request(app)
        .post("/graphql")
        .send({
          query: `mutation { register(userInput: {email: "test${randomNum}@mail.com", password:"somePassword", confirmPassword: "somePassword"}) { token } }`,
        })
        .end((err, res) => {
          if (err) return err;

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
          if (err) return err;

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
});
