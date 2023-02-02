const express = require('express')
const app = require("./app");
const PORT = 5000

// Connect to Database


// Demo response to make sure it is working
app.get('/', (req, res) => {
  res.json({"message": ["Message", "from", "backend", "server"]})
})

// Run the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})

module.exports = app;
