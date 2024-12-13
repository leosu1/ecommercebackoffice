import express from "express";
import * as db from "./db_utils.js";
import * as middleware from "./middlewares.js";
import path from 'path';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import session from 'express-session';
import * as fValidator from "./form_validators.js";

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

app.post('/register', fValidator.registrationFormValidator, async (req, res) => {
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

        if (user === null){
            res.status(400).send('Username or password incorrect. Please try again.');
        } else if (user === 0) {
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

    res.render('customers', {
        customers: customers,
    });
});

app.get('/customers/:customerId/edit', async (req, res) => {
    const customerId = req.params.customerId;
    const customer = await db.getCustomerByID(customerId);   

    res.render ('customers_form', 
        {customer: customer[0]}
    );
});

app.post('/customers/:customerId/edit', fValidator.customerEditFormValidator, async (req, res) => {
    const customerId = req.params.customerId;
    const newCustomerInfo = req.body;

    const modifiedCustomer = await db.editCustomerById(customerId, newCustomerInfo);

    if (modifiedCustomer === null) {
        res.status(500).send(`An error occured trying to update customer ${customerId}, please try again.`)
    } else {
        res.status(200).redirect('/customers');
    }

});

app.get('/customers/:customerId/delete', async (req,res) => {
    const customerId = req.params.customerId;
    const deletedUser = await db.deleteCustomerById(customerId);

    if (deletedUser === null) {
        res.status(500).send(`There was an error trying to remove customer ${customerId}, please try again.`)
    } else {
        res.status(200).redirect('/customers');
    }
})


/*
    category administration
*/
app.get('/categories', async (req, res) => {
    const categories = await db.getCategories();

    if (categories === null) {
        res.status(500).send('Error fetching categories. Please try again later.');
    }

    res.render('categories', {categories: categories});
});

app.get('/categories/:categoryId/edit', async (req, res) => {
    const categoryId = req.params.categoryId;
    const category = await db.getCategoryById(categoryId);

    res.render('categories_edit', {category: category[0]});
});

app.post('/categories/:categoryId/edit', async (req, res) => {
    const categoryId = req.params.categoryId;
    const newCategoryInfo = req.body;
    console.log(newCategoryInfo)
    const modifiedCategory = await db.editCategoryById(categoryId, newCategoryInfo);

    if (modifiedCategory === null) {
        res.status(500).send(`An error occured trying to update category ${categoryId}, please try again.`);
    } else {
        res.status(200).redirect('/categories');
    }
});

app.get('/categories/create', (req, res) => {
    res.render('categories_creation');
});

app.post('/categories/create', async (req, res) => {
    const categoryInfo = req.body;
    const category = await db.createCategory(categoryInfo);

    if (category === null || category.length === 0){
        res.status(500).send('There was an error creating the new category, please try again.');
    } else {
        console.log('New category created :', category);
        res.status(200).redirect('/categories');
    }    
});

app.get('/categories/:categoryId/delete', async (req, res) => {
    const categoryId = req.params.categoryId;
    const deletedCategory = await db.deleteCategoryById(categoryId);

    if (deletedCategory === null) {
        res.status(500).send(`There was an error trying to remove category ${categoryId}, please try again.`);
    } else {
        res.status(200).redirect('/categories');
    }
});


/*
    application start up
*/
app.listen(port, () => {
    console.log(`App running at port ${port} on localhost`);
});