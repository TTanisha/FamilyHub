const app = require("./app");

const mongoose = require("mongoose");
require("dotenv").config({path: "config.env"}); // load environment variables

const PORT = process.env.PORT || 5000; // access the port variable from config.env

// Database connection
const DB = process.env.FAMILYHUB_DB_URI;
mongoose.set('strictQuery', false);// Preparation for deprecation 
const connectionOptions = {
  // Required due to changes in the MongoDB Node.js driver
  useNewUrlParser: true, 
  useUnifiedTopology: true
}

mongoose.connect(DB, connectionOptions).then(
  () => {console.log("Successfully connected to MongoDB.")},
  err => {console.error("Unable to connect to MongoDB.", err.message)}
);

// Demo response to make sure it is working
app.get('/', (req, res) => {
  res.json({"message": ["Message", "from", "backend", "server"]})
});

// Run the server
app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

module.exports = app;
