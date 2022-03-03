const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
var dbname = "mystudents";
const dburl = `mongodb+srv://RajuRk:1234@rajkumar.bfgft.mongodb.net/${dbname}`;
module.exports = { dburl, mongodb, MongoClient };