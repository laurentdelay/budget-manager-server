import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { seeding } from "./seeds";
import { SECRET_KEY } from "../src/utils/envVars";

mongoose.Promise = Promise;

type TestDBHelper = {
  server: MongoMemoryServer;
  authorizationHeader: string;

  startDB(dbName: string): Promise<void>;
  stopDB(): Promise<void>;
  seedDB(): Promise<void>;
  cleanUpDB(): Promise<void>;
};

export class DBHelper implements TestDBHelper {
  server: MongoMemoryServer;

  constructor() {
    this.server = new MongoMemoryServer();
  }
  async startDB(dbName: string): Promise<void> {
    const url = await this.server.getUri(dbName);

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  async stopDB(): Promise<void> {
    await mongoose.connection.close();
    await this.server.stop();
  }

  async seedDB(): Promise<void> {
    await seeding();
  }

  async cleanUpDB(): Promise<void> {
    const collections = mongoose.connection.collections;
    for (const collectionName in collections) {
      const collection = collections[collectionName];

      await collection.deleteMany({});
    }
  }

  get authorizationHeader(): string {
    return `Bearer ${jwt.sign(
      {
        createdAt: new Date(),
        email: "test@mail.com",
        username: "",
        firstName: "Test",
        lastName: "User",
      },
      SECRET_KEY
    )}`;
  }
}

/* export const setupTestDB = () => {
  beforeAll(async (done) => {
    const mongoServer = new MongoMemoryServer();

    const mongoUri = await mongoServer.getUri();

    const mongooseOpts: ConnectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoose.connection.once("open", () => {
      console.log({ mongoUri });
      done();
    });
    mongoose.connect(mongoUri, mongooseOpts);
  });

  afterAll(async (done) => {
    await mongoose.connection.close(() => {
      console.log("connexion closed");

      done();
    });
  });
}; */
