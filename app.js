

require('dotenv').load()
var session = require('express-session');
var bcrypt = require('bcrypt')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Fitbit = require('fitbit');
var request = require('ajax-request');


var userPro;



var routes = require('./routes/index');
var passport = require('passport')
var FitbitStrategy = require('passport-fitbit').Strategy



var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('trust proxy', 1);



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

var accessTokens = {}

passport.use(new FitbitStrategy({
    consumerKey: process.env.KEY,
    consumerSecret: process.env.SECRET,
    callbackURL: process.env.HOST,
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      accessTokens.token = token;
      accessTokens.tokenSecret = tokenSecret;
      console.log(profile);
      userPro = profile;
      return done(null, profile);
    });
  }
));

app.get('/stats', function (req, res) {
  client = new Fitbit(
      process.env.KEY,
      process.env.SECRET,
      { // Now set with access tokens
          accessToken: accessTokens.token,
          accessTokenSecret: accessTokens.tokenSecret,
          unitMeasure: 'en_GB'
      }
  );

  client.getActivities(function (err, activities) {
    if (err) {
      res.render('error');
    }
    client.getSleep(function (err, sleep) {
      if (err) res.render('error')
      res.render('stats', {steps: activities.steps()})

      // res.send('Total steps today: ' + activities.steps() + 'Total distance today: ' + activities.totalDistance()+'sleep: ' +sleep.minutesAsleep() + ' minutes')
    })
  })

})

app.get('/activities', function (req, res) {
  res.send(userPro._json.user)
})







app.get('/auth/fitbit',
  passport.authenticate('fitbit'),
  function(req, res){
  });

app.get('/auth/fitbit/callback',
  passport.authenticate('fitbit', { failureRedirect: '/login' }),
  function(req, res) {
    var verifier = req.query.oauth_verifier,
    client = new Fitbit(process.env.KEY, process.env.SECRET);
          res.redirect('/stats');

  });





app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})

app.use('/', routes);
app.use('/:id', function (req, res) {
  res.send('user' + req.params.id + 'Total steps today: ');
})

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/styleguide', function (req, res) {
  res.render('styleguide')
})

app.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    user: req.user
  });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

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
