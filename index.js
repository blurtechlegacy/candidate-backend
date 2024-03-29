/**
 * Module dependencies
 */

require('dotenv');

const express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    cors = require('cors');

const config = require('./config/config');
const customResponses = require('./middlewares/customResponses');
const port = config.port;
const app = express();
app.disable('etag');

/**
 * App use middleware
 */

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(customResponses);

const server = require('http').Server(app);

require('./config/mongoose')(app);
require('./app')(app);
require('./config/passport')(passport);

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;
