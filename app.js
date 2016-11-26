var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var passport = require('passport');
var promise = require('bluebird');

var config = require('./config');
var routes = require('./routes/dbs');



var app = express();

// setup mongoose
// set mongoose promise to blue bird
// see https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = promise;
mongoose.connect(config.mongodb.uri);
mongoose.set('debug', true);
// mongoose.createConnection(config.mongodb.uri);
//mongoose.on('error', console.error.bind(console, 'mongoose connection error: '));
// mongoose.once('open', function() {
//   // and... we have a data store
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware setup
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(function(req, res, next) {
//     var origin = req.headers.origin;

//     if (config.allowedOrigins.indexOf(origin) > -1) {
//         res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header("Access-Control-Max-Age", "1728000"); // 20 days
//     if (req.method == 'OPTIONS') {
//         return res.sendStatus(200); // return cors
//     }
//     return next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser(config.cryptoKey));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.cryptoKey,
    store: new mongoStore({
        url: config.mongodb.uri
    })
}));
// app.use(passport.initialize());
// app.use(passport.session());

// passport setup
// require('./util/passport');

// routes setup
app.use('/', routes);
// var sessionRoutes = require('./routes/apisession');
// app.use(function(req, res, next) {
//     res.locals.session = req.session;
//     req.session.itemlist = req.session.itemlist ? req.session.itemlist : [];
//     next();
// });



// var mailRoutes = require('./routes/verifyemail');
// app.use('/session/', sessionRoutes);
// app.use('/', mailRoutes);
// app.use('/account/', accountRoutes);
// app.use('/manager/', managerRoutes);
// app.use('/admin/', adminRoutes);

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


//require('./route.js')(app, passport);

// app.get('/forgot', function(req, res) {
//   res.render('forgot', {
//     user: req.user
//   });
// });
// app.post('/forgot',mailmodel.sendresetpwmail);
// app.get('/reset/:token',mailmodel.resetpw);
// app.post('/reset/:token',mailmodel.resetpwdb);


//paypal create order

// var payroutes = require('./models/paypal');

// app.get('/order', payroutes.order);
// app.get('/orderConfirm', payroutes.orderconfirm);
// app.post('/api/createorder', payroutes.createorder);
// app.get('/api/orderExecute', payroutes.orderExecute);


//

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
