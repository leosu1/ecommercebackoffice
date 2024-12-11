import mysql from "mysql2/promise";
import "dotenv/config";

const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

export async function getUserById(id){
    try {
        const [res, fields] = await connection.execute(
            'SELECT * FROM admin_users WHERE id = ?',
            [id]
        );
        return res;
    } catch (err) {
        console.log(`Couldn't fetch user with id ${id} :\n${err.sqlMessage}`);
        return null;
    }
}

export async function getUserByIdAndUsername(id, username){
    try {
        const [res, fields] = await connection.execute(
            'SELECT * FROM admin_users WHERE id = ? and username = ?',
            [id, username]
        );
        return res;
    } catch (err) {
        console.log(`Couldn't fetch user with id ${id} :\n${err.sqlMessage}`);
        return null;
    }
}


export async function createUser(username, password){
    try {
        const [results, fields] = await connection.execute(
            'INSERT INTO admin_users (username, password) VALUES (?, ?)',
            [username, password]
        ); 
        console.log(`New admin added to database (id: ${results.insertId})`);
        return await getUserById(results.insertId);
    }catch (err) {
        console.log(`Error detected trying to create a new admin :\n${err.sqlMessage}`);
        return null;
    }
}