const fs = require('fs');
const crypto = require('crypto');

function readObject(path) {
    const text = fs.readFileSync(path, {encoding: 'utf-8'});
    return JSON.parse(text);
}

function writeObject(path, obj) {
    const text = JSON.stringify(obj);
    fs.writeFileSync(path, text, {encoding: 'utf-8'})
}

class Database {

    constructor(path) {
        this.path = path;
        this.data = readObject(this.path);
    }

    read() {
        const db = readObject(this.path);
        const result = Object.keys(db).map(key => db[key]);
        return result;
    }

    create(input) {
        const db = readObject(this.path);
        let id = (crypto.randomBytes(4)).toString('hex');
        while (db.hasOwnProperty(id)) {
            id = (crypto.randomBytes(4)).toString('hex');
        }
        db[id] = input;
        writeObject(this.path, db);
    }
}

module.exports = {Database};