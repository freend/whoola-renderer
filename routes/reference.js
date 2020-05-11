const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    unirest
        .get(process.env.API_HOST + '/reference')
        .send()
        .then((response) => {
            if (response.body.status != null) {
                res.json(response.body);
            } else {
                console.log(response.body);
                res.render('reference/reference', {
                    "list":response.body,
                    "env": process.env.NODE_ENV
                });
            }
        });
});

module.exports = router;
