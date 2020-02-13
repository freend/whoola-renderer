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
                    res.render('common/error', {"message": "sign in", "ahref": "/signin"});
                } else {
                    res.json(response.body);
                }
            } else {
                console.log(response.body);
                res.render('tree/tree', {"data":response.body});
            }
        });
});

module.exports = router;
