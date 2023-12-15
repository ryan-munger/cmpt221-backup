const mysql = require('mysql2/promise');
const DatabaseConnection = require('./DatabaseConnection');

async function newDatabase() {
    const conForDb = await DatabaseConnection.getConnection(false);
    await conForDb.query("DROP DATABASE IF EXISTS `crypto`;");
    await conForDb.query("CREATE DATABASE `crypto`");
    conForDb.end();
    const con = await DatabaseConnection.getConnection();

    await con.execute("DROP TABLE IF EXISTS `account`;")
    await con.execute("CREATE TABLE `account` ( `username` varchar(45) NOT NULL, `firstname` varchar(45) DEFAULT NULL, `lastname` varchar(45) DEFAULT NULL, `DOB` datetime DEFAULT NULL, `password` varchar(64) DEFAULT NULL, PRIMARY KEY (`username`));")
    await con.execute("DROP TABLE IF EXISTS `portfolio`;")
    await con.execute("CREATE TABLE `portfolio` ( `username` varchar(45) NOT NULL, `symbol` varchar(15) NOT NULL, `name` varchar(45) DEFAULT NULL, PRIMARY KEY (`username`,`symbol`));")
    await con.execute("DROP TABLE IF EXISTS `transaction`;")
    await con.execute("CREATE TABLE `transaction` ( `trans_id` int NOT NULL AUTO_INCREMENT, `username` varchar(45) NOT NULL, `symbol` varchar(15) NOT NULL, `amount` int NOT NULL, `price` varchar(45) NOT NULL, `trans_date` datetime NOT NULL, PRIMARY KEY (`trans_id`,`username`,`symbol`));")

    console.log("The Database was created.")
    con.end()
}

newDatabase()