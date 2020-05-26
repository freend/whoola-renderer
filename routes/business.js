const express = require('express');
const unirest = require('unirest');
const router = express.Router();

router.get('/', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/product/business')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send()
        .then((response) => {
            console.log(response);
                const result = {
                    'env': process.env.NODE_ENV,
                    "list": response.body
                };
                res.render('business/business', result);
            }
        );
});

module.exports = router;
