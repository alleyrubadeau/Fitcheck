var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI)
var fitcheck = db.get('fitcheck')

var users = db.get('users')
var bcrypt = require('bcrypt')
var session = require('express-session')
var app = require('express')()

router.get('/', function(req, res, next) {
  users.find({}, function (err, docs) {
    if (err) return error
    res.render('index', {users: docs});
  })
});



/* GET users listing. */

router.get('/register', function(req, res) {
  res.render('register', function(err, doc) {
    res.send(doc)
    console.log(doc)
  })
})

router.post('/register', function (req, res) {
  if(req.body.email == false) {
    res.render('/', {error: 'email cannot be blank'})
    }
  else {
    var user = req.body
    req.session.email=req.body.email
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
    user.pwd2 = bcrypt.hashSync(user.pwd2, bcrypt.genSaltSync(10))
    res.redirect('/')
    users.insert(req.body, function (err, doc) {
      })
    }
      // users.find({email: req.body.email}, function (err, doc) {
      //   if(docs.length === 0) {
      //     req.body.password=bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      //   users.insert(req.body, function (err, docs) {
      //     if (err) res.render('error') {
      //     req.session.id=doc._id
      //     res.redirect('/', {error: 'email already exists'})
      //       }
      //     })
      //   }
      // }
  })


router.post('/login', function (req, res) {
  var user = req.body
  req.session.email=req.body.email
  users.findOne({email: user.email}), function (err, doc) {
    if(bcrypt.compareSync(user.password, doc.password)) {
    res.redirect('/register')
  }
  else {
    res.redirect('/')
    }
  }
})

router.post('/register', function (req, res) {
var errors =[]
if(!req.body.email) {
  errors.push('email cant be blank')
}
if(!req.body.password) {
  errors.push('password cant be blank')
}
if (errors.length) {
  res.render('index', {errors: errors})
}
else {
  req.session.email=req.body.email
  res.redirect('/')
}
})



module.exports = router;
