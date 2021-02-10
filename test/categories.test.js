const { expect } = require("chai");
const request = require("supertest");

const app = require("../src/server");
const {
  startDatabase,
  resetCollections,
  stopDatabase,
  header,
} = require("./test_database/testDabase");

const positivity = {
  POSITIVE: "POSITIVE",
  NEGATIVE: "NEGATIVE",
  CHOISE: "CHOICE",
};

describe("Categories resolvers", () => {
  before(async () => {
    await startDatabase();
  });

  afterEach(async () => {
    await resetCollections("categories");
  });

  after(async () => {
    await stopDatabase();
  });

  describe("Categories", () => {
    it("should throw an error if no user is authenticated", (done) => {
      request(app)
        .post("/graphql")
        .send({ query: `categories {id name user}` })
        .end((err, res) => {
          if (err) done(new Error(err));

          const { errors } = res.body.errors;
          const errorCode = errors[0].extensions.code;

          expect(res.status, "Status code: 500").to.be.equal(500);
          expect(errors, "An error exists").to.exist;
          expect(errorCode, "Authentication error").to.exist.and.be.equal(
            "UNAUTHENTICATED"
          );

          done();
        });
    });

    it("should send an array of categories containing only user and default categories", (done) => {
      request(app)
        .post("/graphql")
        .set(header)
        .send({ query: "categories {id name action" })
        .end((err, res) => {
          if (err) done(new Error(err));

          const { categories } = res.body.data;

          expect(categories, "Categories defined").to.exist;
          expect(categories, "Array of 4 categories").to.have.lengthOf(4);
        });
    });
  });
});
