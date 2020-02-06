var express = require('express');
var unirest = require('unirest');
var router = express.Router();

/* GET users listing. */
const apiUrl = 'http://localhost:8080/purchase';
router.get('/', function(req, res, next) {
    unirest
        .get(apiUrl)
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
                res.render('purchase/list', response.body);
            }
        });
});
router.post('/', function(req, res, next) {
    var token = req.body["token"];

    if (token == null || token == undefined) {
        res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
    }
    unirest
        .post(apiUrl)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({ "productId": req.body["productId"], "receiverId": req.body["receiver"] })
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