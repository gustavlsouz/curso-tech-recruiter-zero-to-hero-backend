const Indexer = require("./utils/Indexer");
const indexer = new Indexer();
const dependencies = indexer.load("./src");
module.exports = dependencies;
