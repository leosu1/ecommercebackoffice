import {check, validationResult} from "express-validator";
import * as db from "./db_utils.js"

export async function registrationFormValidator(req, res, next){
    await check('username')
        .trim()
        .notEmpty().withMessage('Username cannot be empty.')
        .isLength({ min: 3, max: 100 }).withMessage('Username must be between 3 and 100 characters.')
        .custom(async username => {
            const user = await db.isUserAlreadyExists(username);
            console.log(user);
            if (user) {
                throw new Error ('Username already in use.')
            }
        })
        .run(req)
    ;

    await check('password')
        .trim()
        .notEmpty().withMessage('Password cannot be empty')
        .isLength({ min: 6, max: 100 }).withMessage('Password must be between 6 and 100 characters long')
        .run(req)
    ; 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
}

export async function customerEditFormValidator(req, res, next) {
    await check('firstname')
        .trim()
        .notEmpty()
        .isLength({min: 2, max: 100}).withMessage('Firstname must be between 2 and 100 characters.')
        .run(req)
    ;

    await check('lastname')
        .trim()
        .notEmpty()
        .isLength({min: 2, max: 100}).withMessage('Lastname must be between 2 and 100 characters.')
        .run(req)
    ;

    await check('email_adress')
        .trim()
        .notEmpty()
        .isEmail().withMessage('Email must be a valid email address.')
        .isLength({min: 3, max: 100}).withMessage('Email address must be between 3 and 100 characters.')
        .run(req)
    ;

    await check('phone_number')
        .trim()
        .notEmpty()
        .isLength({min: 5, max: 10}).withMessage('Phone number must be between 5 and 10 characters.')
        .run(req)
    ;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
}

export async function categoriesFormValidator(req, res, next) {
    await check('name')
        .isLength({min: 3, max: 50}).withMessage('Category name must be between 3 and 50 characters.')
        .run(req)
    ;

    await check('description')
        .isLength({max: 500}).withMessage('Category description cannot exceed 500 characters.')
        .run(req)
    ;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
}