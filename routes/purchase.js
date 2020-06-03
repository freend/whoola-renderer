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
                    'env': process.env.NODE_ENV
                };
                res.render('purchase/history', result);
            }
        });
});
router.get('/complete', function (req, res, next) {
    const arr = req.param('cm').split(',');
    const code = arr[0].toString().split(':')[1].toString();
    const receive = arr[1].toString().split(':')[1].toString();
    const point = arr[2].toString().split(':')[1].toString();
    let account = "";
    if (arr.length == 4) {
        account = arr[3].toString().split(':')[1].toString();
    }
    const result = {
        "amount": req.param('amt'),
        "currency": req.param('cc'),
        "email": code,
        "receive": receive,
        "productName": req.param('item_name'),
        "productId": req.param('item_number'),
        "state": req.param('st'),
        "txId": req.param('tx'),
        "point": point,
        "accountNumber": account
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
            let url = 'common/modal';
            //TODO 'env': process.env.NODE_ENV
            res.render(url, {"message": response.body.message, "ahref": '/purchase?page=1'});
        });
});
router.get('/success', function (req, res, next) {
    res.render('order/complete', {"env": process.env.NODE_ENV});
})
router.post('/point', function (req, res, next) {
    const token = req.body["token"];
    const request = {
        "productId": req.body["productId"],
        "usePoint": req.body["pointAmount"],
        "phoneNumber": req.body["receiver"]
    };
    console.log('req', request);
    unirest
        .post(process.env.API_HOST + '/purchase')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send(request)
        .then((response) => {
            switch (response.status) {
                case 403:
                    res.render('common/error', {'message':'please log in', 'ahref': '/login'});
                    break;
                case 200:
                    res.render('common/modal', {
                        'message':response.body,
                        'ahref': '/purchase?page=1',
                        'env': process.env.NODE_ENV
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