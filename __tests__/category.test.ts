import supertest, { SuperTest, Test } from "supertest";
import { Category } from "../src/entities/Category";
import { createServer } from "../src/server";
import { DBHelper } from "./utils/testSetup";

let request: SuperTest<Test>;
const categoryDBHelper = new DBHelper();

describe("Category resolvers", () => {
  beforeAll(async () => {
    await categoryDBHelper.startDB("categoryDB");
    const categoryApp = await createServer();

    request = supertest(categoryApp);
  });

  afterAll(async () => {
    await categoryDBHelper.stopDB();
  });

  beforeEach(async () => {
    await categoryDBHelper.seedDB();
  });

  afterEach(async () => {
    await categoryDBHelper.cleanUpDB();
  });

  describe("getCategories", () => {
    it("should throw an error if no user is authenticated", async (done) => {
      request
        .post("/graphql")
        .send({
          query: `
            query {
              getCategories {
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

    it("should send back an array of 'Category'", async (done) => {
      request
        .post("/graphql")
        .send({
          query: `
            query {
              getCategories {
                id
              }
            }
          `,
        })
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const categories = res.body.data.getCategories;

          expect(categories).not.toBeUndefined();
          expect(categories).toHaveProperty("length");
          expect(categories.length).toBeGreaterThan(0);

          done();
        });
    });

    it("should only send back default and user's categories", async (done) => {
      request
        .post("/graphql")
        .send({
          query: `
            query {
              getCategories {
                id
                name
                userId
              }
            }
          `,
        })
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const categories: Partial<Category>[] = res.body.data.getCategories;

          expect(categories).toHaveLength(5);

          done();
        });
    });
  });

  describe("addNewCategory", () => {
    it("should send an error if no user is authenticated", async (done) => {
      const name: string = "newCategory";
      const action = "CHOICE";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            addNewCategory(categoryInfo: {
              name: "${name}",
              action: ${action}
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

          expect(res.body.errors[0].extensions.code).toBe("UNAUTHENTICATED");
          done();
        });
    });

    it("should send an error for name too short", async (done) => {
      const name: string = "";
      const action = "CHOICE";

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          addNewCategory(categoryInfo: {
            name: "${name}",
            action: ${action}
          }) {
            id
          }
        }
      `,
        })
        .set("Accept", "application/json")
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.message).toBe("Input error");

          const errorDetails = error.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("name");

          done();
        });
    });

    it("should send an error for name too long", async (done) => {
      const name: string = "abcdefghijklmnopqrstuvwxyz";
      const action = "CHOICE";

      request
        .post("/graphql")
        .send({
          query: `
      mutation {
        addNewCategory(categoryInfo: {
          name: "${name}",
          action: ${action}
        }) {
          id
        }
      }
    `,
        })
        .set("Accept", "application/json")
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.message).toBe("Input error");

          const errorDetails = error.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("name");

          done();
        });
    });

    it("should send an error for existing default category name", async (done) => {
      const name: string = "Default Category 1";
      const action = "CHOICE";

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          addNewCategory(categoryInfo: {
            name: "${name}",
            action: ${action}
          }) {
            id
          }
        }
      `,
        })
        .set("Accept", "application/json")
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.message).toBe("Existing category");

          const errorDetails = error.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("category");

          done();
        });
    });

    it("should send an error for existing user's category name", async (done) => {
      const name: string = "TestUserCat1";
      const action = "CHOICE";

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          addNewCategory(categoryInfo: {
            name: "${name}",
            action: ${action}
          }) {
            id
          }
        }
      `,
        })
        .set("Accept", "application/json")
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.message).toBe("Existing category");

          const errorDetails = error.extensions;

          expect(errorDetails.code).toBe("BAD_USER_INPUT");
          expect(errorDetails.errors).toHaveProperty("category");

          done();
        });
    });

    it("should send back the newly created category", async (done) => {
      const name: string = "newCategory";
      const action = "CHOICE";

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          addNewCategory(categoryInfo: {
            name: "${name}",
            action: ${action}
          }) {
            id
            name
            action
          }
        }
      `,
        })
        .set("Accept", "application/json")
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).toBeUndefined();

          expect(res.body.data).not.toBeUndefined();

          const newCategory: Partial<Category> = res.body.data.addNewCategory;

          expect(newCategory).toHaveProperty("id");
          expect(newCategory).toHaveProperty("name");
          expect(newCategory).toHaveProperty("action");

          expect(newCategory.name).toBe(name);
          expect(newCategory.action).toBe(action);

          done();
        });
    });

    it("should send back the newly created category for existing other user catergory name", async (done) => {
      const name: string = "AdminCat1";
      const action = "CHOICE";

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          addNewCategory(categoryInfo: {
            name: "${name}",
            action: ${action}
          }) {
            id
            name
            action
          }
        }
      `,
        })
        .set("Accept", "application/json")
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).toBeUndefined();

          expect(res.body.data).not.toBeUndefined();

          const newCategory: Partial<Category> = res.body.data.addNewCategory;

          expect(newCategory.name).toBe(name);
          expect(newCategory.action).toBe(action);

          done();
        });
    });
  });

  describe("removeCategory", () => {
    it("should send an error if no user is authenticated", async (done) => {
      const categoryId = "6029499e0f45d123649da0e8"; // TestUserCat1

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            removeCategory(id: "${categoryId}")
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

    it("should send an error for unexisting id", async (done) => {
      const categoryId = "7029499e0f45d123649da0e8";

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            removeCategory(id: "${categoryId}")
          }
        `,
        })
        .set("Accept", "application/json")
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");

          done();
        });
    });

    it("should send an error for other users category id", async (done) => {
      const categoryId = "6029499e0f45d123649da0f8"; // Default Category 1

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            removeCategory(id: "${categoryId}")
          }
        `,
        })
        .set("Accept", "application/json")
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).not.toBeUndefined();

          const error = res.body.errors[0];

          expect(error.extensions.code).toBe("INTERNAL_SERVER_ERROR");

          done();
        });
    });

    it("sould send back a message for successful delete", async (done) => {
      const categoryId = "6029499e0f45d123649da0e8"; // TestUserCat1

      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            removeCategory(id: "${categoryId}")
          }
        `,
        })
        .set("Accept", "application/json")
        .set("Authorization", categoryDBHelper.authorizationHeader)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).toBeUndefined();

          expect(res.body.data).not.toBeUndefined();

          const message = res.body.data.removeCategory;

          expect(message).toBe("Delete success");

          done();
        });
    });
  });
});
