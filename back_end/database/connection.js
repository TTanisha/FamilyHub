const { MongoClient } = require("mongodb");
const database = process.env.FAMILYHUB_DB_URI

const client = new MongoClient(database, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

var _database;

module.exports = { 
  connectToServer: function (callback) {
    client.connect(database, function (err, db) {
      if (db) {
        _database = client.db("FamilyHub").collection("users");
        message = "Successfully connected to MongoDB.";
      } else {
        message = "Unable to connect to MongoDB.";
      }
      return callback(err);
    });
    return callback();
  },

  getDatabase: function () {
    return _database;
  }
}

