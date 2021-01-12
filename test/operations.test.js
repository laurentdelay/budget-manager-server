const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/server");

const {
  startDatabase,
  stopDatabase,
  getTestToken,
} = require("./test_database/testDabase");

const testToken = getTestToken();

describe("operations resolvers", () => {
  beforeEach(async () => {
    await startDatabase();
  });

  afterEach(async () => {
    await stopDatabase("operations");
  });

  describe("Query", () => {
    describe("userOperations", () => {
      it("should throw an error if no user is authenticated", (done) => {
        request(app)
          .post("/graphql")
          .send({ query: `{userOperations {id body}}` })
          .end((err, res) => {
            if (err) done(new Error(err));

            const errorCode = res.body.errors[0].extensions.code;

            expect(res.status, "Status code").to.be.equal(500);

            expect(errorCode, "Auth error").to.exist.and.be.equal(
              "UNAUTHENTICATED"
            );

            done();
          });
      });
    });
  });

  describe("Mutation", () => {
    describe("addOperation", () => {});
    describe("deleteOperation", () => {});
  });
});
