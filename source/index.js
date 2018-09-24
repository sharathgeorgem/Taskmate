// Load express
const express = require('express')
const bodyParser = require('body-parser')

// Run express method
const api = express()

// Serve static pages
api.use(express.static(__dirname + '/public'))
api.use(bodyParser.json())

api.listen(3000, () => {
  console.log('API up and running')
})

api.post('/add', (req, res) => {
  console.log(req.body)
  res.send('It works bruh')
})