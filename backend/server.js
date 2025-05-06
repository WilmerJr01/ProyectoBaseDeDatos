const express = require('express')
const db_connection = require('./models/db_connection.js')
const cors = require('cors')
const { actualizarLigas } = require('./controllers/api.js')
const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT ?? 3000

const dataRouters = require('./models/routes.js')

app.use(dataRouters)

db_connection();

actualizarLigas()

setInterval(actualizarLigas, 10 * 60 * 1000)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})