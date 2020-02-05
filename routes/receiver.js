var express = require('express');
var unirest = require('unirest');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    unirest
        .get('http://localhost:8080/receiver')
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
                res.render('receiver/list', response.body);
            }
        });
});
router.post('/add', function(req, res, next) {
    var apiUrl = 'http://localhost:8080/receiver';
    var token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
    }

    if (/^[1-9][0-9]{6,14}$/.test(req.body["phone"])) {
        unirest
            .post(apiUrl)
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
            .send({"receiverNumber": "+" + req.body["phone"], "receiverName" : req.body["name"]})
            .then((response) => {
                if (response.status != null) {
                    res.render('common/modal', {"message":response.body, "ahref":"/receiver?token=" + token, "token":token});
                }
                else {
                    res.render('common/error', response.body);
                }
            });
    } else {
        res.render('receiver/list', {"message": "mobile_number is invalid"});
    }
});

module.exports = router;
