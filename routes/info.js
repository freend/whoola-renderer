var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/terms', function(req, res, next) {
    res.render('info/terms', {'env': process.env.NODE_ENV});
});

module.exports = router;