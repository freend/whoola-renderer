const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/withdraw' + '/amount')
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
                res.render('withdraw/add', response.body);
            }
        });
});
router.get('/list', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/withdraw' + '/mywithdraw')
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
                console.log(response.body.page.content);
                const result = {"page": response.body.page, "url": 'withdraw/list'};
                res.render('withdraw/list', result);
            }
        });
});
router.post('/', function(req, res, next) {
    var token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
    }

    unirest
        .post(process.env.API_HOST + '/withdraw')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({
            "amount": req.body["amount"],
            "withdrawAccount": req.body["account"]
        })
        .then((response) => {
            if (response.status != null) {
                res.render('common/modal', {"message":response.body, "ahref":"/withdraw"});
            }
            else {
                res.render('common/error', response.body);
            }
        });
});

module.exports = router;
