import express from "express";
import * as db from "./db_utils.js";
import * as middleware from "./middlewares.js";
import path from 'path';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import session from 'express-session';


/*
    set up and middlewares
*/
const app = express();
const port = 3000;
const saltRounds = 10;

app.set('view engine', 'ejs');
app.set('views', path.join('views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'aaaaaaaaaaa',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, //only for development context because no HTTPS
        maxAge: 24 * 60 * 60 * 1000, //session active for one day
        rolling: true,
    }
}));
app.use(middleware.routeProtection);


/*
    homepage
*/
app.get('/', (req, res) => {
    res.render('index', {user: req.session.user});
});



/* 
    registration routing and handling
*/
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
            console.log('User logged in :', req.session.user.id);
            res.status(200).redirect('/');
        }
    } 
    catch (err) {
        res.status(500).send('There was an error creating your account, please try again.');
    }
});



/*
    logging in and out routing and handling
*/
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        const user = await db.getUserByUsernameAndPassword(username, password);
        console.log(user)
        if (user === null){
            res.status(500).send('There was an error logging you in, please try again.');
        } else {
            req.session.user = {
                id: user.id,
                username: user.username
            };
            console.log('User logged in :', req.session.user.id);
            res.status(200).redirect('/');
        }
    } 
    catch (err) {
        res.status(500).send('There was an error logging you in, please try again.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout.');
        }

        res.redirect('/');
    })
});


/*
    customer administration
*/
app.get('/customers', async (req, res) => {
    const customers = await db.getCustomers();
    console.log(customers);
    res.render('customers', {
        customers: customers,
    });
});




/*
    application start up
*/
app.listen(port, () => {
    console.log(`App running at port ${port} on localhost`);
});