import mysql from "mysql2";
import "dotenv/config";

const db = process.env.DATABASE_NAME;
const dbLogin = process.env.DATABASE_USERNAME;
const dbPwd = process.env.DATABASE_PASSWORD;

const connection = mysql.createConnection({
    host: 'localhost',
    user: dbLogin,
    password: dbPwd,
    database: db
});

export function getConnection(){
    return connection;
}

export function getUsers(){
    connection.query(
        'SELECT * FROM users',
        function (err, results, fields) {
            if(err){
                console.log(err);
                return null;
            }else{
                console.log(results);
                return results;
                // console.log(fields);
            }
        }
    );
}