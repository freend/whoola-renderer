const express = require('express');
const unirest = require('unirest');
const router = express.Router();

router.get('/', function(req, res, next) {
    const result = {"env": process.env.NODE_ENV};
    res.render('contact/contact', result);
});
router.post('/', function(req, res, next) {
    unirest
        .post(process.env.API_HOST + '/contact')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send({
            "mail": req.body["mail"],
            "title": req.body["title"],
            "content": req.body["content"]
        })
        .then((response) => {
            console.log("contact us : " + response.body);
            if (response.status != null) {
                res.render('common/error', {
                    "message":response.body,
                    "ahref":"/contact",
                    "env": process.env.NODE_ENV
                });
            }
            else {
                res.render('common/error', response.body);
            }
        });
});

module.exports = router;
