var express = require('express');
var unirest = require('unirest');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    var apiUrl = 'http://localhost:8080/purchase';
    var token = req.body["token"];

    if (token == null) {
        res.render('common/error', {'message':'please log in', 'ahref': '/signin'});
    }
    unirest
        .post(apiUrl)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': token})
        .send({ "productId": req.body["id"], "phoneNumber": req.body["phoneNumber"] })
        .then((response) => {
            if (response.status != null) {
                res.json(response.body);
            }
            res.render('product/' + req.body["id"], response.body);
        });
});
module.exports = router;