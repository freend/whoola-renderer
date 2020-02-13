const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET users listing. */
const apiUrl = process.env.API_HOST + '/product';
router.get('/', function(req, res, next) {
    var sendUrl = '';
    if (req.param('page') != null) {
        sendUrl += '?page=' + req.param('page');
    }

    unirest
        .get(sendUrl)
        .send()
        .then((response) => {
            res.render('product/list', response.body);
        });
});
router.get('/full', function(req, res, next) {
    var sendUrl = '';
    if (req.param('page') != null) {
        sendUrl = apiUrl + '?page=' + req.param('page');
    }

    unirest
        .get(sendUrl)
        .send()
        .then((response) => {
            const result = {"page": response.body.page, "url": '/products/full'};
            res.render('product/fulllist', result);
        });
});
router.get('/operator', function (req, res, next) {
    var operator = req.param('operator');
    var receiver = req.param('receiver');
    unirest
        .get(apiUrl + '/operator/' + operator + "?receiver=" + receiver)
        .send()
        .then((response) => {
            if (response.body.status == '404') {
                res.render('error', response.body);
            }
            const result = {"receiver": receiver, "page": response.body.page, "url": 'product/list'};
            res.render('product/list', result);
        });
});
router.get('/:productId', function (req, res, next) {
    unirest
        .get(apiUrl + req.params.productId)
        .send()
        .then((response) => {
            if (response.body.status == '404') {
                res.render('error', response.body);
            }
            res.render('product/detail', response.body);
        });
});

module.exports = router;