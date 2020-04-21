const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var sendUrl = '';
    if (req.param('page') != null) {
        sendUrl += '?page=' + req.param('page');
    }
    //TODO "env": process.env.NODE_ENV
    unirest
        .get(sendUrl)
        .send()
        .then((response) => {
            res.render('product/list', response.body);
        });
});
router.get('/operator/service', function (req, res, next) {
    const operator = req.param('operator');
    const receiver = req.param('receiver');
    unirest
        .get(process.env.API_HOST + '/product/operator/service?operatorId=' + operator + "&receiverId=" + receiver)
        .send()
        .then((response) => {
            if (response.body.status == '404') {
                res.render('error', response.body);
            }
            const result = {"receiverId": receiver,
                "operator": operator,
                "service": response.body,
                "env": process.env.NODE_ENV
            };
            // res.json(result);
            res.render('purchase/category', result);
        });
});
router.get('/operator', function (req, res, next) {
    const operator = req.param('operator');
    const receiver = req.param('receiver');
    const service = req.param('service');
    const token = req.param('token');
    unirest
        .get(process.env.API_HOST + '/product/operator/' + operator + "?receiver=" + receiver + "&service=" + service)
        .send()
        .then((response) => {
            console.log('response body', response.body.list);
            if (response.body.status == '404') {
                res.render('error', response.body);
            }
            const result = {
                "receiver": receiver,
                "list": response.body.list,
                "url": 'product/list',
                "env": process.env.NODE_ENV
            };
            res.render('order/product', result);
        });
});
router.get('/:productId', function (req, res, next) {
    unirest
        .get(process.env.API_HOST + '/product' + req.params.productId)
        .send()
        .then((response) => {
            if (response.body.status == '404') {
                res.render('error', response.body);
            }
            //TODO "env": process.env.NODE_ENV
            res.render('product/detail', response.body);
        });
});

module.exports = router;