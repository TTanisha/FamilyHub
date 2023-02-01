const express = require('express')
const app = express()
const port = 5000

app.get('/api', (req, res) => {
  res.json({"message": ["Message", "from", "backend", "server"]})
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})