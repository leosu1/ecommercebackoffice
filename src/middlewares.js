export function sessionLogger(req, res, next){
    console.log('session:', req.session);
    next();
}

