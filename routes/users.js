var express = require('express');
var unirest = require('unirest');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/info', function (req, res, next) {
    unirest
        .get('http://localhost:8080/member/info')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-AUTH-TOKEN': req.query.token})
        .send()
        .then((response) => {
            console.log(response.body);
            res.render('member/info', response.body);
        });
});

module.exports = router;
