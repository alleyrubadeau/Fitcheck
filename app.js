require('dotenv').load()

var bcrypt = require('bcrypt')
var cookieSession = require('cookie-session')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Fitbit = require('fitbit')


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var FitbitStrategy = require('passport-fitbit').Strategy
var passport = require('passport')




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new FitbitStrategy({
    consumerKey: process.env.KEY,
    consumerSecret: process.env.SECRET,
    callbackURL: process.env.HOST
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ fitbitId: profile.id }, function (err, user) {
      console.log(User)
      return done(err, user)
    });
  }
));

app.use('/', routes);
app.use('/', users);

app.set('trust proxy', 1); // trust first proxy

app.use(cookieSession({
  name: 'session',
  keys: ['SECRET1', 'SECRET2']
}));


app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(function (req, res, next) {
  res.locals.user=req.user;
  next();
})





app.get('/auth/fitbit',
  passport.authenticate('fitbit', {state: 'SOME STATE'}),
  function(req, res) {

  });

app.get('/auth/fitbit', function (req, res) {
  var verifier = req.query.oauth_verifier
    , oauthSettings = req.session.oauth
    , client = new Fitbit(process.env.KEY, process.env.SECRET);

  // Request an access token
  client.getAccessToken(
      oauthSettings.requestToken
    , oauthSettings.requestTokenSecret
    , verifier
    , function (err, token, secret) {
        if (err) {
          // Take action
          return;
        }

        oauthSettings.accessToken = token;
        oauthSettings.accessTokenSecret = secret;

        res.redirect('/stats');
      }
  );
});




app.get('/', function (req, res) {
  // Create an API client and start authentication via OAuth
  var client = new Fitbit(process.env.KEY, process.env.SECRET);

  client.getRequestToken(function (err, token, tokenSecret) {
    if (err) {
      res.redirect('/')
      // Take action
      return;
    }

    req.session.oauth = {
        requestToken: token
      , requestTokenSecret: tokenSecret
    };
    res.redirect(client.authorizeUrl(token));
  });
});


app.get('/auth/fitbit/callback',
  passport.authenticate('fitbit', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });




// app.get('/stats', function (req, res) {
//   client = new Fitbit(
//       process.env.KEY
//     , process.env.SECRET
//     , { // Now set with access tokens
//           accessToken: req.session.oauth.accessToken
//         , accessTokenSecret: req.session.oauth.accessTokenSecret
//         , unitMeasure: 'en_GB'
//       }
//   );
//
//   // Fetch todays activities
//   client.getActivities(function (err, activities) {
//     if (err) {
//       // Take action
//       return;
//     }
//
//     // `activities` is a Resource model
//     res.send('Total steps today: ' + activities.steps());
//   });
// });




app.get('/styleguide', function (req, res) {
  res.render('styleguide')
})

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});


app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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
