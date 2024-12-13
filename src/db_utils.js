import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import "dotenv/config";

/*
    connection to the db
*/
const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});


/*
    user related queries
*/
export async function getUserById(id) {
    try {
        const [res, fields] = await connection.execute(
            'SELECT * FROM admin_users WHERE id = ?',
            [id]
        );
        return res;
    } 
    catch (err) {
        console.log(`Couldn't fetch user with id ${id} :\n${err.sqlMessage}`);
        return null;
    }
}

export async function getUserByIdAndUsername(id, username) {
    try {
        const [res, fields] = await connection.execute(
            'SELECT * FROM admin_users WHERE id = ? AND username = ?',
            [id, username]
        );
        return res;
    } 
    catch (err) {
        console.log(`Couldn't fetch user with id ${id} :\n${err.sqlMessage}`);
        return null;
    }
}

export async function getUserByUsernameAndPassword(username, password) {
    try {
        const [res, fields] = await connection.execute(
            'SELECT * FROM admin_users WHERE username = ?',
            [username]
        );

        if (res.length === 0) {
            return null;
        }

        const user = res[0];
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return null;
        }

        return user;
    } 
    catch (err) {
        console.log(`Couldn't fetch user :\n${err.sqlMessage}`);
        return 0;
    }
}

export async function isUserAlreadyExists(username) {
    try {
        const [result, fields] = await connection.execute(
            'SELECT username FROM admin_users WHERE username = ?',
            [username]
        );
        console.log(result);
        if (result.length === 0) {
            return false;
        }

        return true;
    } 
    catch (err) {
        console.log(`Couldn't complete query to check user : ${err.sqlMessage}`);
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
    }
    catch (err) {
        console.log(`Error detected trying to create a new admin :\n${err.sqlMessage}`);
        return null;
    }
}


/*
    customers related queries
*/
export async function getCustomers() {
    try {
        const [result, fields] = await connection.query(
            'SELECT * FROM customers'
        );
        return result;
    }
    catch (err){
        console.log('Requested data could not be found :\n', err.sqlMessage);
        return null;
    }
}

export async function getCustomerByID(id) {
    try {
        const [result, fields] = await connection.execute(
            'SELECT * FROM customers WHERE customer_id = ?',
            [id]
        );

        if(result.length === 0){
            console.log(`Could not find a customer with specified Id : ${id}`);
            return null;
        }

        return result;
    } 
    catch (err) {
        console.log(`Requested data could not be found : \n ${err.sqlMessage}`);
        return null;
    }
}

export async function editCustomerById (id, customerInfo) {
    try  {
        const [result, fields] = await connection.execute (
            'UPDATE customers SET firstname = ?, lastname = ?, email_adress = ?, phone_number = ? WHERE customer_id = ?',
            [
                customerInfo.firstname,
                customerInfo.lastname,
                customerInfo.email_adress,
                customerInfo.phone_number,
                id
            ]
        );
        console.log(result)
        return result;
    }
    catch (err) {
        console.log('Could not modify customer with given id :\n', err.sqlMessage);
        return null;
    }
}

export async function deleteCustomerById (id) {
    try {
        const [result, fields] = await connection.execute (
            'DELETE FROM customers WHERE customer_id = ?', 
            [id]
        );

        return result;
    } 
    catch (err) {
        console.log(`Could not delete customer with given id :\n ${err.sqlMessage}`);
        return null;
    }
}


/*
    categories related queries
*/
export async function getCategories() {
    try {
        const [result, fields] = await connection.query(
            'SELECT * FROM categories'
        )

        return result;
    } 
    catch (err) {
        console.log('Could not fetch categories :\n', err.sqlMessage);
        return null;
    }
}

export async function getCategoryById(id) {
    try {
        const [result, fields] = await connection.execute(
            'SELECT category_id, name, description FROM categories WHERE category_id = ?',
            [id]
        );

        if (result.length === 0) {
            console.log(`No category found with id : ${id}`);
            return null;
        }

        return result;
    }
    catch (err) {
        console.log(`There was an error getting category with give id :\n${err.sqlMessage}`);
        return null;
    }
}

export async function createCategory(categoryInfo) {
    try {
        const [result, fields] = await connection.execute(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [
                categoryInfo.name,
                categoryInfo.description
            ]
        );

        return result;
    }
    catch (err) {
        console.log(`Error creating new category :\n ${err.sqlMessage}`);
        return null;
    }
}

export async function editCategoryById(id, categoryInfo) {
    try {
        const result = connection.execute(
            'UPDATE categories SET name = ?, description = ? WHERE category_id = ?',
            [
                categoryInfo.name,
                categoryInfo.description,
                id
            ]
        );
        console.log(result);
        return result;
    }
    catch (err) {
        console.log(`An error occured updating category with given id :\n${err}`);
        return null;
    }
}

export async function deleteCategoryById(id) {
    try {
        const result = connection.execute(
            'DELETE FROM categories WHERE category_id = ?',
            [id]
        );
        console.log(result)
        return result;
    }
    catch (err) {
        console.log(`An error occured deleting category with given id :\n${err}`);
        return null;
    }
}


/*
    product related queries
*/
export async function getProductsAndCategory() {
    try {
        const result = await connection.query(
            'SELECT products.*, categories.name AS category_name FROM products INNER JOIN categories ON categories.category_id = products.category'    
        )

        return result[0];
    }
    catch (err) {
        console.log(`An error occured fetching products and their categories :\n${err}`);
        return null;
    }
}

export async function createProduct(productInfo) {
    try {
        if(productInfo.is_available === 'on'){
            productInfo.is_available = 1;
        }else if (productInfo.is_available === 'off'){
            productInfo.is_available = 0;
        }

        const productResult = await connection.execute(
            `INSERT INTO products (name, stock, price, description, rating, is_available, category) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                productInfo.name,
                productInfo.stock,
                productInfo.price,
                productInfo.description,
                0.0,
                productInfo.is_available,
                productInfo.category
            ]
        );

        const categoryUpdate = await connection.execute(
            'UPDATE categories SET products_in_category = products_in_category + 1 WHERE category_id = ?',
            [productInfo.category]
        );

        return productResult, categoryUpdate;
    }
    catch (err) {
        console.log('Error adding a new product :\n', err);
        return null, null;
    }
}