const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()
const PORT = 8000

const index = require('./routes/index.js')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Camouflage contre les pirates
app.disable("x-powered-by")

app.use(cors())
app.use(index)

app.listen(PORT, () => {
    console.log(`Application lancée sur a l'adresse http://localhost:${PORT}`)
})