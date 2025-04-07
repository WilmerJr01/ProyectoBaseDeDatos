const express = require('express')
const db_connection = require('./models/db_connection.js')

const app = express()

app.use(express.json())

db_connection();

const PORT = process.env.PORT ?? 3000

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})