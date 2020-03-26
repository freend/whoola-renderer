const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET home page. */
router.get('/signup/:mail/:valicateCode', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/validate/signup/' + req.params.mail + '/' + req.params.valicateCode)
        .send()
        .then((response) => {
            if (response.body.status != null) {
                console.log('error', response.body);
                res.json(response.body);
                switch (response.body.status) {
                    default:
                        res.json(response.body);
                }
            } else {
                res.render("common/error", {'message': "validate complete", 'ahref': '/'});
            }
        });
});

router.get('/password/:mail', function(req, res, next){
    unirest
        .post(process.env.API_HOST + '/password/init')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send({ "mail": req.param('mail')})
        .then((response) => {
            if (response.status != null) {
                if (response.status == 403) {
                    res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
                } else if (response.status == 200) {
                    const result = {
                        "message": response.body.responseMessage,
                        "ahref": "/",
                        "token": null
                    }
                    res.render('common/modal', result);
                }
                 else {
                    res.json(response.body);
                }

            }
        });
});

router.post('/reset', function(req, res, next){
    console.log('mail', req.body['mail'], 'pass', req.body['password'], 'validateCode', req.body['validateCode']);
    unirest
        .post(process.env.API_HOST + '/validate/reset')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send({
            "mail": req.body['mail'],
            "password": req.body['password'],
            "validateCode": req.body['validateCode']
        })
        .then((response) => {
            if (response.status != null) {
                if (response.status == 403) {
                    res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
                } else if (response.status == 200) {
                    const result = {
                        "message": response.body.responseMessage,
                        "ahref": "/",
                        "token": null
                    }
                    res.render('common/modal', result);
                }
                 else {
                    const result = {
                        "message": response.body.message,
                        "ahref": "/"
                    }
                    res.render('common/error', result);
                }

            }
        });
});

router.get('/password/:mail/:validateCode',function(req, res, next){
    const result = {
        "mail": req.param('mail'),
        "validateCode": req.param('validateCode'),
        "flag": false
    }
    res.render('member/password', result);
});

module.exports = router;
