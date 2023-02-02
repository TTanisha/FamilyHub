const express = require("express");
const app = express();
const cors = require("cors"); // Node.js package that allows cross origin resource sharing

require("dotenv").config({path: "config.env"}); // load environment variables
const port = process.env.PORT || 5000; // access the port variable from config.env

app.use(cors()); // cors middleware
app.use(express.json()); // express middleware, handles body parsing 

// routes
app.use(require("./routes/users"));

// driver connection
const database = require("./database/connection");

app.get('/api', (req, res) => {
  res.json({"message": ["Message", "from", "backend", "server"]})
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
  // when server starts, connect to the database
  database.connectToServer(function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("Connected.");
    }
  });
});
