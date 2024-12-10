import express from "express";
import * as db from "./db_utils.js";
import * as middleware from "./middlewares.js";
import path from 'path';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import session from 'express-session';

const app = express();
const port = 3000;
const saltRounds = 10;

app.set('view engine', 'ejs');
app.set('views', path.join('views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'this is a test',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: true,
        httpOnly: true,
        sameSite: 'strict'
    }
}));
app.use(middleware.sessionLogger);

app.get('/', (req, res) => {
    let username;
    if(req.session.user){
        username = req.session.user.username;
    }else{
        username = '';
    }
    res.render('index', {username: username});
});


// registration routing
app.get('/register', (req, res) => {
    res.render('register');
})
app.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        db.createUser(username, hash).then(result => {
            if (result === null){
                res.status(500).send('There was an error creating your account. Please try again.');
            } else {
                req.session.user = {
                    id: result.id,
                    username: result.username 
                }
                res.status(200).redirect('/');
            }
        });
    })
})

// login handling
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    res.send('hi');
});




app.listen(port, () => {
    console.log(`App running at port ${port} on localhost`);
});