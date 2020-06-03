const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var sendUrl = '';
    if (req.param('page') != null) {
        sendUrl += '?page=' + req.param('page');
    }
    //TODO 'env': process.env.NODE_ENV
    unirest
        .get(sendUrl)
        .send()
        .then((response) => {
            res.render('product/list', response.body);
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
            //TODO 'env': process.env.NODE_ENV
            res.render('product/detail', response.body);
        });
});

module.exports = router;