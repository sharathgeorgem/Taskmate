const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const path = require('path')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'todo'
})

try {
  connection.connect()
} catch (err) {
  console.log('Connection to MySQL failed.')
  console.log(err)
}

const app = express()

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.json())

app.listen(7460, () => {
  console.log('API up and running')
})

app.get('/tasks', (req, res) => {
  connection.query('SELECT * FROM tasks ORDER BY created DESC', (error, results) => {
    if (error) return res.json({error: error})

    res.json(results)
  })
})

app.post('/add', (req, res) => {
  connection.query('INSERT INTO tasks (description) VALUES (?)', [req.body.taskName], (error, results) => {
    if (error) return res.json({error: error})

    connection.query('SELECT LAST_INSERT_ID() FROM tasks', (error, results) => {
      if (error) return res.json({error: error})

      // console.log(results[0]['LAST_INSERT_ID()'])
      res.json({
        id: results[0]['LAST_INSERT_ID()'],
        description: req.body.taskName
      })
    })
  })
})
