const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET users listing. */
var sendUrl;
router.get('/', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/purchase/list?page=' + req.param('page'))
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': req.query.token})
        .send()
        .then((response) => {
            if (response.body.status != null) {
                console.log('error', response.body);
                switch (response.body.status) {
                    case 403:
                        console.log('not authorize');
                        res.render('common/error', {"message": "Please log in", "ahref": "/login"});
                        break;
                    default:
                        res.json(response.body);
                }
            } else {
                console.log(response.body.page);
                const result = {
                    "page": response.body.page,
                    "url": 'purchase',
                    "env": process.env.NODE_ENV
                };
                res.render('purchase/history', result);
            }
        });
});
router.get('/complete', function (req, res, next) {
    const code = req.param('cm').split(',')[0].toString().split(':')[1].toString();
    const receive = req.param('cm').split(',')[1].toString().split(':')[1].toString();
    const result = {
        "amount": req.param('amt'),
        "currency": req.param('cc'),
        "code": code,
        "receive": receive,
        "productName": req.param('item_name'),
        "productId": req.param('item_number'),
        "state": req.param('st'),
        "txId": req.param('tx')
    };
    unirest
        .post(process.env.API_HOST + '/paypal')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(result)
        .then((response) => {
            console.log('body', response.body);
            const result = {
                "msg": response.body,
                "ahref": "/home"
            };
            //TODO "env": process.env.NODE_ENV
            res.render('common/modal', {"message": response.body, "ahref": "/purchase?page=1"});
        });
});
router.get('/detail', function (req, res, next) {
    const productId = req.param('productId');
    const receiver = req.param('receiver');
    const token = req.param('token');
    unirest
        .get(process.env.API_HOST + '/purchase' + '?productid=' + productId + '&receiveid=' + receiver)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': req.query.token})
        .send()
        .then((response) => {
            if (response.body.status != null) {
                console.log('error', response.body);
                switch (response.body.status) {
                    case 403:
                        console.log('not authorize');
                        res.render('common/error', {"message": "Please log in", "ahref": "/login"});
                        break;
                    default:
                        res.render('common/error', {"message": response.body.message, "ahref": "/order?token=" + token});
                        break;
                }
            } else {
                const result = {
                    "productName": response.body.productName,
                    "amount": response.body.productPrice,
                    "receiverPhone": response.body.receiverPhone,
                    "totalPoint": response.body.totalPoint,
                    "ablePoint": response.body.ablePoint,
                    "maxFee": response.body.maxFee,
                    "name": response.body.receiverName,
                    "productId": productId,
                    "receiverId": receiver,
                    "operator": response.body.operator,
                    "token": token,
                    "referralCode": response.body.referralCode,
                    "paypalUrl": response.body.paypalUrl,
                    "paypalToken": response.body.paypalToken,
                    "paypalCommand": response.body.paypalCommand,
                    "paypalId": response.body.paypalId,
                    "priceFee": response.body.priceFee,
                    "salesAmount": response.body.salesAmount,
                    "description": response.body.description,
                    "mode": process.env.NODE_ENV,
                    "feePercentValue": response.body.feePercentValue,
                    "payable": response.body.payable,
                    "env": process.env.NODE_ENV
                };
                res.render('order/detail', result);
            }
        });
});
router.post('/', function(req, res, next) {
    const token = req.body["token"];

    if (token == null || token == undefined) {
        res.render('common/error', {'message':'please log in', 'ahref': '/login'});
    }
    const totalPoint = req.body["totalPoint"];
    const point = req.body["point"];
    if (point > totalPoint / 2) {
        res.render('common/error', {'message':'point over', 'ahref': '/purchase/detail?productId=' + req.body["productId"]
            + '&receiver=' + req.body["receiver"] + '&token=' + token});
    }
    unirest
        .post(process.env.API_HOST + '/purchase')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({ "productId": req.body["productId"], "receiverId": req.body["receiver"], "point": req.body["point"] })
        .then((response) => {
            switch (response.status) {
                case 403:
                    res.render('common/error', {'message':'please log in', 'ahref': '/login'});
                    break;
                case 200:
                    res.render('common/error', {
                        'message':response.body,
                        'ahref': '/purchase?token=' + token,
                        "env": process.env.NODE_ENV
                    });
                    break;
                default:
                    res.json(response.body);
                    break;
            }
            // res.render('product/' + req.body["id"], response.body);
        });
});
router.get('/validate', function(req, res, next) {
    unirest
        .post("https://www.sandbox.paypal.com/cgi-bin/webscr")
        .send(
            { "at": "p6IKE-8G_0N1-fFyOowfFyZ73E7_q2_GhC355doPqIOpkrnhx_vfUMQH-ii",
            "cmd": "_notify-synch",
            "tx": "6CY02319DM0070119"
        }
        )
        .then((response) => {
            if (response.status != null) {
                if (response.status == 403) {
                    res.render('common/error', {'message':'please log in', 'ahref': '/login'});
                } else {
                    res.json(response.body);
                }

            }
            res.json(response.body);
        });
});
module.exports = router;