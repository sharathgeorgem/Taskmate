const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.json())

app.listen(7460, () => {
  console.log('API up and running')
})

app.post('/add', (req, res) => {
  console.log('Post request received')
  console.log('The body is ', req.body)
  res.send('It works bruh')
})
