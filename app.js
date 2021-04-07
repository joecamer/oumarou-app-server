const express = require("express")
const cors = require("cors")
const bodyParser = require('body-parser')
const session = require('express-session')
const app = express()
const HOST = '0.0.0.0'
const PORT = 30001

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

app.listen(PORT,HOST, () => {
    console.clear()
    const bcrypt = require("bcrypt")
    console.log(bcrypt.hashSync("secret",10))
    console.log(`Application lancée sur a l'adresse http://${HOST}:${PORT}`)
})