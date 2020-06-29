var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/terms', function(req, res, next) {
    res.render('info/terms', {'env': process.env.NODE_ENV});
});
router.get('/about', function(req, res, next) {
    res.render('info/about', {'env': process.env.NODE_ENV});
});
router.get('/benefit', function(req, res, next) {
    res.render('info/benefit', {'env': process.env.NODE_ENV});
});
router.get('/simulate', function(req, res, next) {
    res.render('main/interact', {'env': process.env.NODE_ENV});
});
module.exports = router;