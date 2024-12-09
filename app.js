import express from "express";
import * as db from "./db_utils.js";
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join('views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/newuser', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    console.log(db.checkUser(username));
    
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`App running at port ${port} on localhost`);
});

