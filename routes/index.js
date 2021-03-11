const express = require("express")
const router = express.Router()
const Models = require('../models/model.js')
const bcrypt = require('bcrypt')
const session = require('express-session')

router.get('/', (req, res) => {
    res.contentType("text/json")
    res.send({
        moi: "Sidik Nembot",
        notes: [15, 12, 13, 18, 20]
    })
})

router.get('/users', (req, res) => {
    new Models.User().all()
        .then(response => res.json(response))
        .catch(() => res.status(500))
})

router.get('/users/:user', (req, res) => {
    new Models.User().find(req.params.user)
        .then(u => res.json(u))
        .catch(() => res.status(500))
        .finally(() => res.end())
})

router.get('/devices', (req, res) => {
    new Models.Devices().all()
        .then(result => {
            res.json(result)
        })
        .catch(() => res.status(500))
        .finally(() => res.end())
})

router.get('/devices/:device', (req, res) => {
    new Models.Devices().find(req.params.device)
        .then(device => res.json(device))
        .catch(() => res.status(500))
        .finally(() => res.end())
})

router.get('*', (req, res) => {
    res.status(404)
        .send("404 Not Found man")
})

router.post('/devices/create', (req, res) => {
    new Models.Devices().create(req.body).then(() => res.json(true))
        .catch(err => res.status(500).json(err))
        .finally(() => res.end())
})

router.post('/users/create', async (req, res) => {
    new Models.User().create(Object.assign({}, req.body, {password: await bcrypt.hash(req.body.password, 10)}))
        .then(x => res.json(x))
        .catch(err => res.status(500).json(err))
        .finally(() => res.end())
})

router.post('/auth/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (username && password) {
        if (req.session.isLogged) {
            res.send("Already logged on.").end()
        } else {
            new Models.User().find(username)
                .then(async user => {
                    let rep = await bcrypt.compare(password, user.password)

                    if (rep) {
                        req.session.isLogged = true
                        req.session.user = user
                        res.json(req.session.user)
                    } else {
                        res.send("Username or password invalid").status(401)
                    }
                })
                .catch(err => res.send(err).status(500))
                .finally(() => res.end())
        }
    }
})

router.post('/auth/logout', (req,res) => {
    req.session.destroy()
    res.send("Successfully logged out").end()
})

module.exports = router