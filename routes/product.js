var express = require('express');
var unirest = require('unirest');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var apiUrl = 'http://localhost:8080/product';
    if (req.param('page') != null) {
        apiUrl += '?page=' + req.param('page');
    }

    unirest
        .get(apiUrl)
        .send()
        .then((response) => {
            res.render('product/list', response.body);
        });
});
router.get('/:productId', function (req, res, next) {
    unirest
        .get('http://localhost:8080/product/' + req.params.productId)
        .send()
        .then((response) => {
            if (response.body.status == '404') {
                res.render('error', response.body);
            }
            res.render('product/detail', response.body);
        });
});

module.exports = router;