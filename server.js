const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const utils = require('./utils');
require('dotenv').config()
port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
let server = null;

const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./FleaMarketService.v1.json');

// Components
const registerComponent = require('./components/register');
const loginComponent = require('./components/login');
const itemsComponent = require('./components/items');
const searchComponent = require('./components/search');
const usersComponent = require('./components/users');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
const BasicStrategy = require('passport-http').BasicStrategy;
const jwtSecret = require('./jwt-secret.json');

// Passport Basic Strategy for checking user login
passport.use(new BasicStrategy(async (username, password, done) => {

    try {
        const user = await utils.checkUserLogin(username, password);
        if (user == false) {
            return done(null, false, { message: "HTTP Basic username or password not found" });
        } else {
            return done(null, user);
        }
    } catch (error) {
        return done("error");
    }


}
));

// JWT options
let options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtSecret.secret;

// Passport Jwt Strategy for checking if token is valid
passport.use(new JwtStrategy(options, function (jwt_payload, done) {
    const now = Date.now() / 1000;
    if (jwt_payload.exp > now) {
        done(null, jwt_payload.user);
    }
    else {
        done(null, false);
    }
}));

// APP Endpoints
app.use('/register', registerComponent);
app.use('/login', passport.authenticate('basic', { session: false }), loginComponent);
app.use('/items', passport.authenticate('jwt', { session: false }), itemsComponent);
app.use('/search', searchComponent);
app.use('/users', passport.authenticate('jwt', { session: false }), usersComponent);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.get('/', (req, res) => {
    res.send('Flea Market Service API');
});

module.exports = {
    close: () => {
        server.close();
        db.close();
        console.log("Server closed.");
    },
    start: (mode) => {
        db.start(mode).then(() => {
            server = app.listen(port, () => {
                console.log("Server started");
            });
        }).catch(error => {
            console.log(error);
        });
    }
}