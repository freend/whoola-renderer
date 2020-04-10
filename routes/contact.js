const express = require('express');
const unirest = require('unirest');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('contact/contact');
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
                res.render('common/modal', {"message":response.body, "ahref":"/contact"});
            }
            else {
                res.render('common/error', response.body);
            }
        });
});

module.exports = router;
