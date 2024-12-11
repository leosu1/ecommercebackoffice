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
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        rolling: true,
    }
}));
app.use(middleware.sessionLogger);

app.get('/', (req, res) => {
    res.render('index', {user: req.session.user});
});


// registration routing
app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        const result = await db.createUser(username, hash);

        if (result === null || result.length === 0){
            res.status(500).send('There was an error creating your account, please try again.');
        } else {
            req.session.user = {
                id: result[0].id,
                username: result[0].username
            };
            console.log('User logged in :', req.session.user);
            res.status(200).redirect('/');
        }
    } catch (err) {
        res.status(500).send('error');
    }
});

// login handling
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', (req, res) => {
    res.send('hi');
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout.');
        }

        res.redirect('/');
    })
})




app.listen(port, () => {
    console.log(`App running at port ${port} on localhost`);
});