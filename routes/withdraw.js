const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const token = req.query.token;
    unirest
        .get(process.env.API_HOST + '/withdraw' + '/amount')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
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
                console.log('body', response.body);
                const result = {
                  'haveAmount': response.body.haveAmount,
                  'availAmount': response.body.availAmount,
                  'fee': response.body.fee,
                  'paypalAccount': response.body.paypalAccount,
                  'token': token,
                    'env': process.env.NODE_ENV
                };
                res.render('withdraw/withdraw', result);
            }
        });
});
router.get('/list', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/withdraw' + '/mywithdraw?page=' + req.param('page'))
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
                        //TODO 'env': process.env.NODE_ENV
                        res.json(response.body);
                }
            } else {
                console.log(response.body.page.content);
                const result = {
                    "page": response.body.page,
                    "url": 'list',
                    'env': process.env.NODE_ENV
                };
                res.render('withdraw/history', result);
            }
        });
});
router.post('/', function(req, res, next) {
    var token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/login'});
    }

    unirest
        .post(process.env.API_HOST + '/withdraw')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({
            "amount": req.body["amount"],
            "fee": req.body["fee"]
        })
        .then((response) => {
            if (response.status != null) {
                res.render('common/modal', {
                    "message":response.body,
                    "ahref":"/withdraw/list?page=1",
                    'env': process.env.NODE_ENV
                });
            }
            else {
                res.render('common/modal', response.body);
            }
        });
});

module.exports = router;
