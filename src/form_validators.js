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