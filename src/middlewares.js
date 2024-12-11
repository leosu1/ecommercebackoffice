import * as db from "./db_utils.js";

export async function isUserLoggedIn (req) {
    const session = req.session;

    if (session.user){
        let user = await db.getUserByIdAndUsername(session.user.id, session.user.username);

        if (user === null || user.length === 0) {
            console.log('No user found.')
            return false
        } else {
            console.log(`User connected : ${user[0].id}`)
            return true
        }
    }
}

export async function routeProtection (req, res, next) {
    const url = req.url;
    const safeRoutes = [
        '/',
        '/login',
        '/register'
    ];

    if (safeRoutes.includes(url)){
        next();
    } else {
        console.log('Protected route requested :', url);
        
        const authorization = await isUserLoggedIn(req);

        if (authorization === true){
            console.log(`Allowing access to ${url}`);
            next();
        } else {
            console.log(`Access denied, sending 403.`);
            res.status(403).send('You must be logged in order to access this part of the website.');
        }
    }
}