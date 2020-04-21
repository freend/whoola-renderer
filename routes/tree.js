const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    unirest
        .get(process.env.API_HOST + '/tree')
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
                console.log(response.body);
                // res.json(response.body);
                res.render('tree/tree', {
                    "trees":response.body,
                    "env": process.env.NODE_ENV
                });
            }
        });
});

module.exports = router;
