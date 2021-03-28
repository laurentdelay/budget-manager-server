import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { seeding } from "../seeds";
import { SECRET_KEY } from "../../src/utils/envVars";
import { User } from "../../src/entities/User";
const users = require("../seeds/user.seeds.json");

mongoose.Promise = Promise;

type TestDBHelper = {
  server: MongoMemoryServer;
  authorizationHeader: string;
  loggedUser: Partial<User>;

  startDB(dbName: string): Promise<void>;
  stopDB(): Promise<void>;
  seedDB(): Promise<void>;
  cleanUpDB(): Promise<void>;
};

export class DBHelper implements TestDBHelper {
  server: MongoMemoryServer;
  loggedUser: Partial<User>;

  constructor() {
    this.server = new MongoMemoryServer();
    this.loggedUser = users[0];
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
    return `Bearer ${jwt.sign(this.loggedUser, SECRET_KEY)}`;
  }
}
