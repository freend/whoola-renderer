const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/point?page=' + req.param('page'))
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
                const result = {
                    "page": response.body.page,
                    "url": 'point',
                    'env': process.env.NODE_ENV
                };
                res.render('point/history', result);
            }
        });
});
router.post('/add', function(req, res, next) {
    var token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/login'});
    }

    unirest
        .post(process.env.API_HOST + '/point')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({"invitedUserMail": req.body["mail"]})
        .then((response) => {
            if (response.status != null) {
                res.render('common/modal', {
                    "message":response.body,
                    "ahref":"/invite",
                    'env': process.env.NODE_ENV
                });
            }
            else {
                res.render('common/error', response.body);
            }
        });
});

module.exports = router;
