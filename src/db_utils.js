import mysql from "mysql2";
import "dotenv/config";

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

export function getConnection(){
    return connection;
}

export function getCustomers(){
    connection.query(
        'SELECT * FROM customers',
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

export function createUser(username, password){
    connection.execute(
        "INSERT INTO admin_users (username, password) VALUES (?, ?)",
        [username, password],
        function (err, res, fields){
            if(err){
                console.log(`error in query : ${err.sqlMessage}`)
                return 0;
            }
            console.log(`Inserted a new admin in database (id : ${res.insertId})`);
            return 1;
        }
    )
}

export function checkUser(username){
    connection.execute(
        'SELECT username FROM admin_users WHERE username = ?',
        [username],
        function (err, res, fields){
            console.log(res);
            console.log(fields);
            console.log(err)
            if(err){
                return err;
            } else if (res.length === 0){
                return 'doesnt exist';
            }else {
                return 'exists';
            }
        }
    )
}