import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import util from "util";

const readDir = util.promisify(fs.readdir);

export const seeding = async () => {
  const dirContent = await readDir(__dirname);

  const dataFiles = dirContent.filter((fileName) =>
    fileName.endsWith(".seeds.json")
  );

  for (const file of dataFiles) {
    const fileName = file.split(".seeds.json")[0];

    const modelName =
      fileName.charAt(0).toUpperCase() + fileName.substring(1).toLowerCase();

    const mongoModel = mongoose.models[modelName];

    if (!mongoModel) {
      throw new Error(`Model ${modelName} not found`);
    }

    const fileContent = require(path.join(__dirname, file));

    mongoModel.insertMany(fileContent);
  }
};
