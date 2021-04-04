import supertest, { SuperTest, Test } from "supertest";
import { EventModel } from "../src/entities/Event";
import { createServer } from "../src/server";
import { DBHelper } from "./utils/testSetup";

let request: SuperTest<Test>;
const eventDBHelper = new DBHelper();

describe.only("Event resolvers", () => {
  beforeAll(async () => {
    await eventDBHelper.startDB("userDB");
    const userApp = await createServer();

    request = supertest(userApp);
  });

  afterAll(async () => {
    await eventDBHelper.stopDB();
  });

  beforeEach(async () => {
    await eventDBHelper.seedDB();
  });

  afterEach(async () => {
    await eventDBHelper.cleanUpDB();
  });

  describe("getUserEvents", () => {
    it("should throw an error if no user is authenticated", async (done) => {
      request
        .post("/graphql")
        .send({
          query: `
          query {
            getUserEvents {
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

    it("should send back an array of Events", async (done) => {
      request
        .post("/graphql")
        .send({
          query: `
            query {
              getUserEvents {
                id
              }
            }
          `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).toBeUndefined();

          const userEvents = res.body.data.getUserEvents;

          expect(userEvents).not.toBeUndefined();
          expect(userEvents).toHaveProperty("length");
          expect(userEvents.length).toBeGreaterThan(0);

          done();
        });
    });

    it("should send back authenticated user Events only", async (done) => {
      request
        .post("/graphql")
        .send({
          query: `
            query {
              getUserEvents {
                userId
              }
            }
          `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          const userEvents = res.body.data.getUserEvents;

          expect(userEvents.length).toBe(4);

          for (const event of userEvents) {
            expect(event.userId).toBe(eventDBHelper.loggedUser.id);
          }

          done();
        });
    });
  });

  describe("createEvent", () => {
    it("should throw an error if no user is authenticated", async (done) => {
      const body = "event text";
      const amount = 100;
      const date = new Date();
      const action = "SUBSTRACT";
      const recurrent = false;
      const categoryId = "6029499e0f45d123649da0e9"; //TestUserCat2

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          createEvent(eventInput: {
            body: "${body}",
            amount: ${amount},
            date: "${date}",
            action: ${action},
            recurrent: ${recurrent},
            categoryId: "${categoryId}",
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

    it("should throw an error for body too short", async (done) => {
      const body = "";
      const amount = 100;
      const date = new Date();
      const action = "SUBSTRACT";
      const recurrent = false;
      const categoryId = "6029499e0f45d123649da0e9"; //TestUserCat2

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          createEvent(eventInput: {
            body: "${body}",
            amount: ${amount},
            date: "${date}",
            action: ${action},
            recurrent: ${recurrent},
            categoryId: "${categoryId}",
          }) {
            id
          }
        }
      `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
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
          expect(errorDetails.errors).toHaveProperty("body");

          done();
        });
    });

    it("should throw an error for body too long", async (done) => {
      const body = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
      const amount = 100;
      const date = new Date();
      const action = "SUBSTRACT";
      const recurrent = false;
      const categoryId = "6029499e0f45d123649da0e9"; //TestUserCat2

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          createEvent(eventInput: {
            body: "${body}",
            amount: ${amount},
            date: "${date}",
            action: ${action},
            recurrent: ${recurrent},
            categoryId: "${categoryId}",
          }) {
            id
          }
        }
      `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
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
          expect(errorDetails.errors).toHaveProperty("body");

          done();
        });
    });

    it("should throw an error for negative amount", async (done) => {
      const body = "event text";
      const amount = -100;
      const date = new Date();
      const action = "SUBSTRACT";
      const recurrent = false;
      const categoryId = "6029499e0f45d123649da0e9"; //TestUserCat2

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          createEvent(eventInput: {
            body: "${body}",
            amount: ${amount},
            date: "${date}",
            action: ${action},
            recurrent: ${recurrent},
            categoryId: "${categoryId}",
          }) {
            id
          }
        }
      `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
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
          expect(errorDetails.errors).toHaveProperty("amount");

          done();
        });
    });

    it("should throw an error for amount of 0", async (done) => {
      const body = "event text";
      const amount = 0;
      const date = new Date();
      const action = "SUBSTRACT";
      const recurrent = false;
      const categoryId = "6029499e0f45d123649da0e9"; //TestUserCat2

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          createEvent(eventInput: {
            body: "${body}",
            amount: ${amount},
            date: "${date}",
            action: ${action},
            recurrent: ${recurrent},
            categoryId: "${categoryId}",
          }) {
            id
          }
        }
      `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
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
          expect(errorDetails.errors).toHaveProperty("amount");

          done();
        });
    });

    it("should send back the created event", async (done) => {
      const body = "event text";
      const amount = 100;
      const date = new Date();
      const action = "SUBSTRACT";
      const recurrent = false;
      const categoryId = "6029499e0f45d123649da0e9"; //TestUserCat2

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          createEvent(eventInput: {
            body: "${body}",
            amount: ${amount},
            date: "${date}",
            action: ${action},
            recurrent: ${recurrent},
            categoryId: "${categoryId}",
          }) {
            id
            body
            amount
            date
            action
            recurrent
            category { id }
            userId
            createdAt
          }
        }
      `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).toBeUndefined();

          const newEvent = res.body.data.createEvent;

          expect(newEvent).not.toBeUndefined();

          expect(newEvent).toHaveProperty("id");
          expect(newEvent.body).toBe(body);
          expect(newEvent.amount).toBe(amount);
          expect(newEvent).toHaveProperty("date");
          expect(newEvent.action).toBe(action);
          expect(newEvent.category.id).toBe(categoryId);
          expect(newEvent.userId).toBe(eventDBHelper.loggedUser.id);
          expect(newEvent.recurrent).toBe(recurrent);
          expect(newEvent).toHaveProperty("createdAt");

          done();
        });
    });

    it("should save the new event", async (done) => {
      const body = "event text";
      const amount = 100;
      const date = new Date();
      const action = "SUBSTRACT";
      const recurrent = false;
      const categoryId = "6029499e0f45d123649da0e9"; //TestUserCat2
      const eventsCountBefore = await EventModel.countDocuments();

      request
        .post("/graphql")
        .send({
          query: `
        mutation {
          createEvent(eventInput: {
            body: "${body}",
            amount: ${amount},
            date: "${date}",
            action: ${action},
            recurrent: ${recurrent},
            categoryId: "${categoryId}",
          }) {
            id
            body
            amount
            date
            action
            recurrent
            category { id }
            userId
            createdAt
          }
        }
      `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(async (err, _) => {
          if (err != null) return done(err);

          const eventsCountAfter = await EventModel.countDocuments();

          expect(eventsCountAfter).toBe(eventsCountBefore + 1);
          done();
        });
    });
  });

  describe("removeEvent", () => {
    it("should throw an error if no user is authenticated", async (done) => {
      const eventId = "6033d2c024b35e4cf0df847e"; // TestEvent3
      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            removeEvent(eventId: "${eventId}")
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

    it("should throw an error if a wrong event id is provided", async (done) => {
      const eventId = "7033d2c024b35e4cf0df847e";
      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            removeEvent(eventId: "${eventId}")
          }
        `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
        .set("Accept", "application/json")
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

    it("should throw an error if event provided is from another user", async (done) => {
      const eventId = "6036588007c1bc56f062ec9f"; //AdminEvent1
      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            removeEvent(eventId: "${eventId}")
          }
        `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
        .set("Accept", "application/json")
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

    it("should send back a success message", async (done) => {
      const eventId = "6033d2c024b35e4cf0df847e"; // TestEvent3
      request
        .post("/graphql")
        .send({
          query: `
          mutation {
            removeEvent(eventId: "${eventId}")
          }
        `,
        })
        .set("Authorization", eventDBHelper.authorizationHeader)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err != null) return done(err);

          expect(res.body.errors).toBeUndefined();

          const success = res.body.data.removeEvent;

          expect(success).toBe("Delete success");

          done();
        });
    });
  });
});
