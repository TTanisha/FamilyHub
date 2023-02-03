const express = require("express");
const app = require("./app");

require("dotenv").config({path: "config.env"}); // load environment variables
const PORT = process.env.PORT || 5000; // access the port variable from config.env

// driver connection
const database = require("./database/connection");

// Demo response to make sure it is working
app.get('/', (req, res) => {
  res.json({"message": ["Message", "from", "backend", "server"]})
});

// Run the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  // when server starts, connect to the database
  database.connectToServer(function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("Connected.");
    }
  });
});

module.exports = app;
