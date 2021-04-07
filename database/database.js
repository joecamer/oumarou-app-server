const sqlite3 = require("sqlite3").verbose()
const path = require("path")

class Database {

    constructor(name = path.join(__dirname, "database.sqlite")) {
        this.database = name
    }

    getConnection() {
        return new sqlite3.Database(this.database, err => {
            if (err) throw err
            console.log(`Connecté à ${this.database}`)
        })
    }

}

module.exports = new Database()