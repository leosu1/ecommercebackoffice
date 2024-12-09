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

export function checkUser(username){
    connection.execute(
        'SELECT email_adress FROM users WHERE email_adress = ?',
        [username],
        function (err, res, fields){
            console.log(res);
            console.log(fields);
            console.log(err)
            if(err){
                return err;
            } else if (res.length === 0){
                return false;
            }else {
                return true;
            }
        }
    )
}