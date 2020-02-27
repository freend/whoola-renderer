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
            console.log(response.body);
            const result = {
                "mail": response.body.mail,
                "myReferralCode": response.body.myReferralCode,
                "point": response.body.point,
                "link": process.env.URLS + "/signupReferral/" + response.body.myReferralCode
            };
            res.render('member/info', result);
        });
});
router.post('/info', function (req, res, next) {
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
module.exports = router;
