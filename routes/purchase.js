var express = require('express');
var unirest = require('unirest');
var router = express.Router();

/* GET users listing. */
const apiUrl = 'http://localhost:8080/purchase';
router.get('/', function(req, res, next) {
    unirest
        .get(apiUrl + "/list")
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
                    "token": token
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
module.exports = router;