import mysql from  'mysql2/promise';
const db = await mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'topzone_vip',
})

export default db;