const mysql = require('mysql2/promise')
const DatabaseConnection = require('./DatabaseConnection')
const crypto = require('crypto')

function hash(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hashedPw = hash.digest('hex');
}

exports.errOnInvalidLogin = async (loginDict) => {
    const {username, password} = loginDict;
    const con = await DatabaseConnection.getConnection();
    const accounts = await con.execute(
        'SELECT * FROM account WHERE username=?',
        [username]
    );
    if (!accounts[0][0]) { 
        await con.end();
        throw "There are no accounts with that username.";
    };
    if (accounts[0][0].password !== hash(password)) {
        await con.end();
        throw "Password does not match stored password.";
    }
    await con.end();
}

exports.makeAccount = async (creationDict) => {
    const {username, firstname, lastname, dob, password} = creationDict;
    const con = await DatabaseConnection.getConnection();
    
    await con.execute(
        'INSERT INTO account (username, lastname, firstname, DOB, password) VALUES (?,?,?,?,?)',
        [username, lastname, firstname, dob, hash(password)]);
}

async function getAccountInfo(username) {
    const con = await DatabaseConnection.getConnection();

    const [accounts] = await con.query('SELECT * FROM account WHERE username=?', [username])
    con.end()
    return accounts[0]
}

exports.getAccountInfo = getAccountInfo;