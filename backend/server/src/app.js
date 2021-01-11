const express = require('express')
const routes = require('./routes')
const cors = require('cors')

require('dotenv').config()
require('./db/database/index')
const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN)
    res.header("Access-Control-Allow-Methods", "GET")
    app.use(cors())
    next()
})

app.use(express.json())

app.use(routes)



app.listen(process.env.PORT || 5000)