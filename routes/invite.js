const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const token = req.query.token;
    if(token === "null") {
        const result = {"page": {
                'content': []
            },
            "total": 10,
            "invited": 0,
            "url": 'invite',
            "token": 'null',
            'env': process.env.NODE_ENV
        };
        res.render('invite/invite', result);
    }
    unirest
        .get(process.env.API_HOST + '/invite?page=' + req.param('page'))
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
                console.log(response.body);
                const result = {
                    "page": response.body.page,
                    "total": response.body.total,
                    "invited": response.body.invited,
                    "url": 'invite',
                    "token": token,
                    'env': process.env.NODE_ENV
                };
                res.render('invite/invite', result);
            }
        });
});
router.post('/add', function(req, res, next) {
    const token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/login'});
    }
    unirest
        .post(process.env.API_HOST + '/invite')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({"invitedUserMail": req.body["mail"]})
        .then((response) => {
            console.log('response', response);
            if (response.status != null) {
                var message = '';
                switch (response.status) {
                    case 200:
                        message = response.body;
                        break;
                    default:
                        message = response.body.message;
                        break;
                }
                res.render('common/modal', {
                    "page": response.body.page,
                    "url": 'invite',
                    "token": token,
                    "message":message,
                    'env': process.env.NODE_ENV,
                    "total": response.body.total,
                    "invited": response.body.invited,
                    "ahref":"/invite?page=1"
                });
            }
            else {
                res.render('common/error', response.body);
            }
        });
});

module.exports = router;
