import express from "express";
import * as db from "./db_utils.js";
import path from 'path';

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', path.join('views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// app.post('/newuser', (req, res) => {
// })

app.listen(port, () => {
    console.log(`App started at port ${port} on localhost`);
});

db.getUsers();