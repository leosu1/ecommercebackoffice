import mysql2 from "mysql2"
import dotenv from "dotenv/config"

const db = process.env.DATABASE_NAME;
const dbLogin = process.env.DATABASE_LOGIN;
const dbPwd = process.env.DATABASE_PASSWORD;

