const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRoutes')
const app = express();
const port = process.env.PORT || 5000;
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();

// for parsing application/json
app.use(bodyParser.json())
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }))
// sessions
app.use(session({
    secret: 'whatafuckthismeans',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));
//static
app.use(express.static('public'));
//api routes
app.use('/api/', apiRouter)

app.listen(port, () => {
    console.log(`Server up - port::${port}`)
});