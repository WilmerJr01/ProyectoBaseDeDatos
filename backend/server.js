const express = require('express')
const db_connection = require('./models/db_connection.js')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT ?? 3000

const dataRouters = require('./models/routes.js')

app.use(dataRouters)

db_connection();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})