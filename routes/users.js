const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/info', function (req, res, next) {
    if (req.query.token == "null" || req.query.token == null || req.query.token == undefined) {
        res.render('common/error', {"message": "sign in", "ahref": "/signin"});
    }
    unirest
        .get(process.env.API_HOST + '/member/info')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': req.query.token})
        .send()
        .then((response) => {
            switch (response.body.status) {
                case 403:
                    console.log('not authorize');
                    res.render('common/error', {"message": "sign in", "ahref": "/signin"});
                    break;
                default:
                    console.log('info result', response.body);
                    const result = {
                        "mail": response.body.mail,
                        "myReferralCode": response.body.myReferralCode,
                        "point": response.body.point,
                        "link": process.env.URLS + "/signupReferral/" + response.body.myReferralCode,
                        "paypal": response.body.paypalAccount,
                        "buyThisMonth": response.body.buyThisMonth,
                        "level": response.body.level
                    };
                    res.render('member/info', result);
                    break;
            }
        });
});
router.get('/paypal', function(req, res, next) {
    const token = req.query.token;
    const result = {
        "token": token
    };
    res.render('member/paypal', result);
});
router.post('/paypal', function (req, res, next) {
    const token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
    }

    unirest
        .post(process.env.API_HOST + '/member/paypal')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({"paypalAccount": req.body["account"]})
        .then((response) => {
            switch (response.body.status) {
                case 403:
                    console.log('not authorize');
                    res.render('common/error', {"message": "sign in", "ahref": "/signin"});
                    break;
                default:
                    const result = {
                        "mail": response.body.mail,
                        "myReferralCode": response.body.myReferralCode,
                        "point": response.body.point,
                        "link": process.env.URLS + "/signupReferral/" + response.body.myReferralCode,
                        "paypal": response.body.paypalAccount
                    };
                    res.render('member/info', result);
                    break;
            }
        });
});
router.post('/info', function (req, res, next) {
    const token = req.body["token"];
    unirest
        .post(process.env.API_HOST + '/receiver')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({"receiverNumber": "+" + req.body["phone"], "receiverName" : req.body["name"]})
        .then((response) => {
            if (response.status != null) {
                res.json(response.body);
            }
            res.render('product/' + req.body["id"], response.body);
        });
});
router.get('/password', function (req, res, next) {
    if (req.query.token == "null" || req.query.token == null || req.query.token == undefined) {
        res.render('common/error', {"message": "sign in", "ahref": "/signin"});
    }
    const result = {
        "token": req.query.token,
        "flag": true
    };
    res.render('member/password', result);
});
router.post('/password', function (req, res, next) {
    const token = req.body["token"];
    console.log("token", token);
    if (token == "null" || token == null || token == undefined) {
        res.render('common/error', {"message": "sign in", "ahref": "/signin"});
    }
    unirest
        .put(process.env.API_HOST + '/member/password')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({"currentPassword": req.body["currentPassword"], "newPassword" : req.body["password"]})
        .then((response) => {
            console.log("response", response);
            res.json({'message': response})
        });
});
module.exports = router;
