const DB = require("../database/database.js")

class Model {

    constructor(table) {
        this.table = table
        this.con = DB.getConnection()
    }

    all(){
        return new Promise((resolve, reject) => {
            const db = this.con
            db.serialize(() => {
                db.all(`SELECT * FROM ${this.table}`, (err, rows) => {
                    if (err) reject(err)
                    console.log(rows)
                    resolve(rows)
                })
            })
            db.close()
        })
    }

    find(id) {
        return new Promise((resolve,reject) => {
            const db = this.con
            let sql = `SELECT * FROM ${this.table} WHERE \`${this.table}\`.`
            sql += !isNaN(parseInt(id)) ? `\`id\` = ${id}` : `\`${this.index}\` = "${id}"`;
            
            db.serialize(() => {
                db.each(sql, (err,row) => {
                    if (err) reject(err)
                    console.log(row)
                    resolve(row)
                })
            })
            db.close()
        })
    }

    create(values) {
        let sql = `INSERT INTO ${this.table} VALUES (null,${values})`
        return new Promise((resolve, reject) => {
            const db = this.con
            db.serialize(() => {
                db.run(sql, err => {
                    reject(err)
                })
            })
            db.close()
            resolve(true)
        })
    }

}

/**
 * Création d'un nouveau model qui héritera du model principal ainsi que toutes ses méthodes
 * Il suffit juste de le déclarer, appeler le constructeur du parent (super()) avec le nom de la table
 * à laquelle il fait référence en paramètre et son CRUD sera dynamiquement généré.
 * 
 * Ne pas oublier d'exporter le model à la dernière ligne.
 */
class User extends Model {

    constructor() {
        super('users')
        this.index = "username"
    }
}

module.exports = {User}