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

module.exports = router;
