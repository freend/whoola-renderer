const express = require('express');
const unirest = require('unirest');
const router = express.Router();
/**
 * TODO - freend : 여기랑 purchase를 전부 order로 변경합시다.
 */
/* order first depth. */
router.get('/', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/receiver')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': req.query.token})
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
                    "env": process.env.NODE_ENV
                };
                res.render('order/user', result);
            }
        });
});
router.get('/edit', function(req, res, next) {
    const phone = req.param('phone').substring(1);
    const result = {
        "id": req.param('id'),
        "name": req.param('name'),
        "phone": phone,
        "token": req.param('token'),
        "env": process.env.NODE_ENV
    };
    res.render('order/user', result);
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
                    //TODO - "env": process.env.NODE_ENV check
                    res.render('common/error', response.body);
                }
            });
    } else {
        res.render('receiver/list', {"message": "mobile_number is invalid"});
    }
});
router.post('/add', function(req, res, next) {
    const token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/login'});
    }

    if (/^[1-9][0-9]{6,14}$/.test(req.body["phone"])) {
        unirest
            .post(process.env.API_HOST + '/receiver')
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
            .send({"receiverNumber": "+" + req.body["phone"], "receiverName" : req.body["name"]})
            .then((response) => {
                console.log("order category : " + response.body);
                switch (response.status) {
                    case 200:
                        //TODO - "env": process.env.NODE_ENV check
                        res.render('purchase/service', response.body);
                        break;
                    case 403:
                        res.render('common/error', {"message": "Please log in", "ahref": "/login"});
                        break;
                    default:
                        res.render('common/modal', {"message": response.body.message, "ahref": "/order"});
                        break;
                }
            });
    } else {
        res.render('common/modal', {"message": "mobile number is invalid", "ahref":"/order"});
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
                    "env": process.env.NODE_ENV
                });
            }
            else {
                res.render('common/error', response.body);
            }
        });
});

module.exports = router;
