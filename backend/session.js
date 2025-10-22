import session from 'express-session';


export function makeSession({ secret }) {
return session({
secret,
resave: false,
saveUninitialized: false,
cookie: {
httpOnly: true,
maxAge: 1000 * 60 * 60 * 8 // 8 hours
}
});
}