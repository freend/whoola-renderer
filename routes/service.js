const express = require('express');
const unirest = require('unirest');
const router = express.Router();
/**
 * TODO - freend : 여기랑 purchase를 전부 order로 변경합시다.
 */
/* order first depth. */
router.get('/', function(req, res, next) {
    const token = req.query.token;
    console.log('token', token);
    if(token === "null") {
        const result = {"page": {
                'content': []
            },
            "id": null,
            "name": null,
            "phone": null,
            "token": "null",
            "url": 'receiver/list',
            'category': 'service',
            'env': process.env.NODE_ENV
        };
        res.render('order/user-v2', result);
    } else {
        unirest
            .get(process.env.API_HOST + '/receiver')
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
            .send()
            .then((response) => {
                if (response.body.status != null) {
                    console.log('error', response.body);
                    if (response.body.status === 403) {
                        console.log('not authorize');
                        res.render('common/error', {"message": "Please log in", "ahref": "/login"});
                    } else {
                        res.json(response.body);
                    }
                } else {
                    console.log('page : ' + response.body.page.content.length);
                    const result = {"page": response.body.page,
                        "id": null,
                        "name": null,
                        "phone": null,
                        "token": req.query.token,
                        "url": 'receiver/list',
                        'category': 'service',
                        'env': process.env.NODE_ENV
                    };
                    res.render('order/user-v2', result);
                }
            });
    }
});
router.get('/others', function (req, res, next) {
    const token = req.param('token');
    const phoneNumber = req.param('phoneNumber');
    if (/^[1-9][0-9]{6,14}$/.test(phoneNumber)) {
        unirest
            .get(process.env.API_HOST + '/product/service?phoneNumber=' + phoneNumber)
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
            .send()
            .then((response) => {
                switch (response.status) {
                    case 200:
                        res.render('purchase/service', {
                            'service': response.body.service,
                            'env': process.env.NODE_ENV,
                            'isoCode': response.body.isoCode,
                            'receiver': phoneNumber
                        });
                        break;
                    default:
                        res.render('common/modal', {"message": response.body.message, "ahref": "/service"});
                        break;
                }
            });
    } else {
        res.render('common/modal', {"message": "mobile number is invalid", "ahref":"/order"});
    }
});
router.get('/operator', function (req, res, next) {
    const service = req.param('service');
    const receiver = req.param('receiver');
    const isoCode = req.param('isoCode');
    const token = req.param('token');
    unirest
        .get(process.env.API_HOST + '/product/operator?service=' + service + "&isoCode=" + isoCode)
        .send()
        .then((response) => {
            if (response.body.status == '404') {
                res.render('error', response.body);
            }
            const result = {
                "receiver": receiver,
                "list": response.body,
                'env': process.env.NODE_ENV
            };
            res.render('order/product', result);
        });
});
// router.get('/operator', function (req, res, next) {
//     const operator = req.param('operator');
//     const receiver = req.param('receiver');
//     const service = req.param('service');
//     const token = req.param('token');
//     unirest
//         .get(process.env.API_HOST + '/product/operator/' + operator + "?receiver=" + receiver + "&service=" + service)
//         .send()
//         .then((response) => {
//             console.log('response body', response.body.list);
//             if (response.body.status == '404') {
//                 res.render('error', response.body);
//             }
//             const result = {
//                 "receiver": receiver,
//                 "list": response.body.list,
//                 "url": 'product/list',
//                 'env': process.env.NODE_ENV
//             };
//             res.render('order/product', result);
//         });
// });
router.get('/detail', function (req, res, next) {
    const productId = req.param('productId');
    const receiver = req.param('receiver');
    const token = req.param('token');
    unirest
        .get(process.env.API_HOST + '/purchase' + '?productId=' + productId + '&phoneNumber=' + receiver)
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
                    "buyThisMonth": response.body.buyThisMonth,
                    'env': process.env.NODE_ENV
                };
                res.render('order/detail', result);
            }
        });
});
/* under method change position */
router.get('/edit', function(req, res, next) {
    const phone = req.param('phone').substring(1);
    const result = {
        "id": req.param('id'),
        "name": req.param('name'),
        "phone": phone,
        "token": req.param('token'),
        'env': process.env.NODE_ENV
    };
    res.render('order/user-v2', result);
});
router.post('/edit', function(req, res, next) {
    const token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/login'});
    }
    console.log("phone", req.body["phone"]);
    if (/^[1-9][0-9]{6,14}$/.test(req.body["phone"])) {
        unirest
            .put(process.env.API_HOST + '/receiver')
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
            .send({"receiverNumber": "+" + req.body["phone"],
                "receiverName" : req.body["name"],
                "id": req.body["id"]
            })
            .then((response) => {
                if (response.status != null) {
                    res.render('common/modal', {"message":response.body.message, "ahref":"/order"});
                }
                else {
                    //TODO - 'env': process.env.NODE_ENV check
                    res.render('common/error', response.body);
                }
            });
    } else {
        res.render('receiver/list', {"message": "mobile_number is invalid"});
    }
});
router.get('/delete/:id', function(req, res, next) {
    const token = req.param('token');

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/login'});
    }

    unirest
        .delete(process.env.API_HOST + '/receiver')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({"id": req.param('id')})
        .then((response) => {
            if (response.status != null) {
                res.render('common/modal', {
                    "message":response.body.message,
                    "ahref":"/order",
                    'env': process.env.NODE_ENV
                });
            }
            else {
                res.render('common/error', response.body);
            }
        });
});

module.exports = router;
