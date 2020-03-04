const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET users listing. */
const apiUrl = process.env.API_HOST + '/purchase';
var sendUrl;
router.get('/', function(req, res, next) {
    sendUrl = "";
    sendUrl = apiUrl + "/list";
    if (req.param('page') != null) {
        sendUrl += '?page=' + req.param('page');
    }
    unirest
        .get(sendUrl)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': req.query.token})
        .send()
        .then((response) => {
            if (response.body.status != null) {
                console.log('error', response.body);
                switch (response.body.status) {
                    case 403:
                        console.log('not authorize');
                        res.render('common/error', {"message": "sign in", "ahref": "/signin"});
                        break;
                    default:
                        res.json(response.body);
                }
            } else {
                console.log(response.body);
                const result = {"page": response.body.page, "url": 'purchase'};
                res.render('purchase/list', result);
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
            }
            res.json(response.body);
        });
});
router.get('/detail', function (req, res, next) {
    const productId = req.param('productId');
    const receiver = req.param('receiver');
    const token = req.param('token');
    unirest
        .get(apiUrl+'?productid=' + productId + '&receiveid=' + receiver)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': req.query.token})
        .send()
        .then((response) => {
            if (response.body.status != null) {
                console.log('error', response.body);
                switch (response.body.status) {
                    case 403:
                        console.log('not authorize');
                        res.render('common/error', {"message": "sign in", "ahref": "/signin"});
                        break;
                    default:
                        res.json(response.body);
                }
            } else {
                console.log(response.body);
                const result = {
                    "productName": response.body.productName,
                    "amount": response.body.productPrice,
                    "receiverPhone": response.body.receiverPhone,
                    "myPoint": response.body.myPoint,
                    "name": response.body.receiverName,
                    "productId": productId,
                    "receiverId": receiver,
                    "operator": response.body.operator,
                    "token": token,
                    "referralCode": response.body.referralCode
                };
                res.render('purchase/detail', result);
            }
        });
});
router.post('/', function(req, res, next) {
    const token = req.body["token"];

    if (token == null || token == undefined) {
        res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
    }
    const totalPoint = req.body["totalPoint"];
    const point = req.body["point"];
    if (point > totalPoint / 2) {
        res.render('common/error', {'message':'point over', 'ahref': '/purchase/detail?productId=' + req.body["productId"]
            + '&receiver=' + req.body["receiver"] + '&token=' + token});
    }
    unirest
        .post(apiUrl)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({ "productId": req.body["productId"], "receiverId": req.body["receiver"], "point": req.body["point"] })
        .then((response) => {
            if (response.status != null) {
                if (response.status == 403) {
                    res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
                } else {
                    res.json(response.body);
                }

            }
            res.render('product/' + req.body["id"], response.body);
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
                    res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
                } else {
                    res.json(response.body);
                }

            }
            res.json(response.body);
        });
});
module.exports = router;