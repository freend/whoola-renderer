const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/invite?page=' + req.param('page'))
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
                const result = {"page": response.body.page, "url": 'invite/list'};
                res.render('invite/list', result);
            }
        });
});
router.post('/add', function(req, res, next) {
    const token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
    }
    unirest
        .post(process.env.API_HOST + '/invite')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({"invitedUserMail": req.body["mail"]})
        .then((response) => {
            if (response.status != null) {
                res.render('common/modal', {"message":response.body, "ahref":"/invite"});
            }
            else {
                res.render('common/error', response.body);
            }
        });
});

module.exports = router;
