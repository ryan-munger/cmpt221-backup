const mysql = require('mysql2/promise')

exports.getConnection = async (includeDatabase=true) => {
    let connection = {
        host: 'localhost',
        user: 'root',
        password: 'admin0',
    };
    if (includeDatabase) {
        connection.database = 'crypto';
    }
    return await mysql.createConnection(connection);
}
