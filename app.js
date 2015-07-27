require('dotenv').load()
var session = require('express-session');
var bcrypt = require('bcrypt')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Fitbit = require('fitbit')


var routes = require('./routes/index');
var passport = require('passport')
var FitbitStrategy = require('passport-fitbit').Strategy


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('trust proxy', 1); // trust first proxy



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FitbitStrategy({
    consumerKey: process.env.KEY,
    consumerSecret: process.env.SECRET,
    callbackURL: process.env.HOST,
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Fitbit profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Fitbit account with a user record in your database,
      // and return that user instead.
      console.log(profile);
      return done(null, profile);
    });
  }
));

app.get('/auth/fitbit',
  passport.authenticate('fitbit'),
  function(req, res){
    // The request will be redirected to Fitbit for authentication, so this
    // function will not be called.
  });

// GET /auth/fitbit/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/fitbit/callback',
  passport.authenticate('fitbit', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})

app.use('/', routes);
app.use('/:id', function (req, res) {
  // res.send('user', + req.params.id)
  res.send('user' + req.params.id + 'Total steps today: ');
})

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/styleguide', function (req, res) {
  res.render('styleguide')
})

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports = app;
