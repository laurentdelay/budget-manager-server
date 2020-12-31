const supertest = require("supertest");

const app = require("../src/server");
const { stopDatabase, startDatabase } = require("../src/database");

const request = supertest(app);

beforeAll(async () => {
  await startDatabase();
});

afterAll(async () => {
  await stopDatabase();
});

test("fetch users", async (done) => {
  request
    .post("/graphql")
    .send({
      query: "{ users{id, email,first_name} }",
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      expect(res.body).toBeInstanceOf(Object);
      done();
    });
});
