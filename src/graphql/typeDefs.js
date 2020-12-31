const fs = require("fs");
const path = require("path");
const { buildSchema } = require("graphql");

const schemaFile = path.join(__dirname, "schema.graphql");
const schemaString = fs.readFileSync(schemaFile, "utf-8");

const schema = buildSchema(schemaString);

module.exports = schema;
