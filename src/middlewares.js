import * as db from "./db_utils.js";

export async function isUserLoggedIn (req) {
    const session = req.session;

    if (session.user){
        let user = await db.getUserByIdAndUsername(session.user.id, session.user.username);
        console.log(user);
        if (user === null) {
            console.log('User not found');
            return false
        }else{
            console.log('Logged in as : ', user.username);
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
    }else{
        const authorization = await isUserLoggedIn(req);
        if (authorization === true){
            next();
        }else {
            res.status(403).send('You must be logged in order to access this part of the website.');
        }
    }
}