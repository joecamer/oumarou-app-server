const express = require("express")
const router = express.Router()
const Models = require('../models/model.js')
const bcrypt = require('bcrypt')
const session = require('express-session')
const db = require("../database/database.js")

/**
 * Cette route est la principale. Elle permet juste de tester la connexion à la BD
 * Donc elle ne sera jamais utilisée côté frontend
 */
router.get('/', (req, res) => {
    db.getConnection()
    res.status(200).end()
})

/**
 * Cette route permet de lister tous les utilisateurs. Juste en cas de besoin
 */
router.get('/users', (req, res) => {
    new Models.User().all()
        .then(response => res.json(response))
        .catch(() => res.status(500))
})

/**
 * Cette route permet d'obtenir les informations concernant un utilisateur précis
 * Il faut donc passer en paramètre l'`id` ou le `username` de l'utilisateur en question
 * 
 * Ex: http://localhost:3001/users/1 | http://localhost:3001/users/sidik
 */
router.get('/users/:user', (req, res) => {
    new Models.User().find(req.params.user)
        .then(u => res.json(u))
        .catch(() => res.status(500))
        .finally(() => res.end())
})

/**
 * Cette route est celle qui est retournée au cas où le endpoint auquel on veut accéder n'existe pas
 * (le fameux 404 Not found)
 */
router.get('*', (req, res) => {
    res.status(404)
        .send("404 Not Found")
})

/**
 * Cette route est appellée via la méthode POST et permet de créer un nouvel utilisateur (inscription)
 * Il faut donc lui passer les informations de l'utilisateur dans l'ordre des champs de la table users
 * à partir du deuxième champs car le premier champ (id) est auto incrémenté et n'a pas besoin d'être
 * rempli.
 * 
 * Bien évidemment le mot de passe est crypté
 * 
 * Ex (dans notre cas): axios.post('http://localhost:3001/users/create', {username: 'sidik', fullname: 'Sidik Faha', password: 'secret'})
 */
router.post('/users/create', async (req, res) => {
    const values = Object.values(Object.assign({}, req.body, {password: await bcrypt.hash(req.body.password, 10)}))
    const formatedValues = values.map(v => {
        return !isNaN(parseInt(v)) ? v : `"${v}"`
    }).join(",")
    new Models.User().create(formatedValues)
        .then(x => res.json(x))
        .catch(err => res.status(500).json(err))
        .finally(() => res.end())
})

/**
 * Cette route est celle permettant à un utilisateur de se connecter tout en créant les cookies
 * pour sauvegarder sa session
 * 
 */
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

/**
 * Cette route déconnecte l'utilisateur connecté. En supprimant les variables de session liées
 * à sa connexion
 */
router.post('/auth/logout', (req,res) => {
    req.session.destroy()
    res.send("Successfully logged out").end()
})

module.exports = router