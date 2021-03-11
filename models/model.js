const DB = require("../database/database.js")

class Model {

    constructor(table) {
        this.table = table
        this.con = DB.getConnection()
    }

    all(){
        return new Promise((resolve, reject) => {
            this.con.connect(err => {
                if (err) reject(err)
            })

            this.con.query(`SELECT * FROM ${this.table}`, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })

            this.con.end()
        })
    }

    find(id) {
        return new Promise((resolve,reject) => {
            let sql = `SELECT * FROM ${this.table} WHERE \`${this.table}\`.`
            sql += !isNaN(parseInt(id)) ? `\`id\` = ${id}` : `\`${this.index}\` = "${id}"`;
            this.con.connect(err => err ? reject(err) : null)

            this.con.query(sql, (err, result) => {
                if (err) reject(err)
                resolve(result[0])
            })
            this.con.end()
        })
    }

    create(values) {
        let sql = `INSERT INTO ${this.table} SET ?`
        return new Promise((resolve, reject) => {
            this.con.query(sql, values, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
            this.con.end()
        })
    }

}

class User extends Model {

    constructor() {
        super('users')
        this.index = "username"
    }
}

class Devices extends Model {

    constructor() {
        super('devices')
    }
}

module.exports = {User, Devices}