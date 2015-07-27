var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/stats', function (req, res, next) {
  res.render('stats', {user: res.locals.user});
})



module.exports = router;
