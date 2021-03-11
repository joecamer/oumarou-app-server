const Model = require('./model.js')

module.exports = class User extends Model {

    constructor() {
        super('users')
    }

    all() {
        return 1;
    }
}