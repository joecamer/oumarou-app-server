const mysql = require("mysql2");

class Database {

    constructor(options = {host: 'localhost', user: 'sidik', password: 'ltbonadoumbe', database: 'nelson'}) {
        this.host = options.host
        this.user = options.user
        this.password = options.password
        this.database = options.database
    }

    getConnection() {
        return mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
        })
    }

}

module.exports = new Database()