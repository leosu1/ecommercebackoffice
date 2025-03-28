import {expect, test} from 'vitest';
import * as db from '../src/db_utils';
import bcrypt from 'bcrypt';
import { resolve } from 'path';

function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

test('Creates a user and inserts it into the database', async () => {
    let mockUsername = 'vitestUser' + generateString(3);
    let mockPassword = await bcrypt.hash('vitestPassword', 10);
    let createdUser = await db.createUser(mockUsername, mockPassword);

    expect(createdUser).not.toBe(null);
    expect(createdUser[0].username).toBe(mockUsername);
    expect(createdUser[0].password).toBe(mockPassword);
});

test('Creates a new category and inserts it into the database', async () => {
    let categoryInfo = {
        description: generateString(20),
        name: 'vitestCategory' + generateString(5),
    };
    let createdCategory = await db.createCategory(categoryInfo);

    expect(createdCategory).not.toBe(null);
    expect(createdCategory.serverStatus).toBe(2);
    let removeCategory = await db.deleteCategoryById(createdCategory.insertId);
})

test('Creates a product and inserts it into the database', async () => {
    let productInfo = {
        name: 'vitest Product',
        stock: 1,
        price: 1,
        description: generateString(20),
        category: 1
    };
    let createdProduct = await db.createProduct(productInfo);
    expect(createdProduct).not.toBe(null);
    expect(createdProduct[0].serverStatus).toBe(2);
    let removeProduct = await db.deleteProductById(createdProduct[0].insertId, 1);
})