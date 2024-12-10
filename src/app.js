import express from "express";
import * as db from "./db_utils.js";
import * as middleware from "./middlewares.js";
import path from 'path';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;
const saltRounds = 10;

app.set('view engine', 'ejs');
app.set('views', path.join('views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
});


// registration routing
app.get('/register', (req, res) => {
    res.render('register');
})
app.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        db.createUser(username, hash);
    })

    res.redirect('/login');
})

// login handling
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    res.send('hi');
})


app.listen(port, () => {
    console.log(`App running at port ${port} on localhost`);
});

