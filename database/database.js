const mysql = require("mysql2");

class Database {

    constructor(options = {host: 'localhost', user: 'nelson_user', password: 'nelsondefanemtech.cf@2000', database: 'nelson_database'}) {
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