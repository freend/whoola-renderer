var express = require('express');
var unirest = require('unirest');
var router = express.Router();
const apiUrl = process.env.API_HOST;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/hoola-checker', function (req, res) {
    res.json({"message": 'Hoola Moola'});
});
router.get('/signupReferral/:referralCode', function (req, res) {
    const result = {"referralCode": req.param('referralCode')}
    res.render('member/signup', result);
});
router.get('/signup', function (req, res, next) {
    const result = {"referralCode": null}
  res.render('member/signup', result);
});
router.post('/signup', function (req, res, next) {
  unirest
      .post(apiUrl + '/member/signup')
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
          "mail": req.body["id"], "password": req.body["password"], "inviteReferralCode": req.body["referralCode"]
      })
      .then((response) => {
          console.log("sign up result", response.body);
          res.render('common/modal', {"message" : response.body, "ahref": '/'});
      });
});
router.get('/signin', function (req, res, next) {
    res.render('member/signin');
});
router.post('/signin', function (req, res, next) {
    unirest
        .post(apiUrl + '/member/signin')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send({ "mail": req.body["id"], "password": req.body["password"] })
        .then((response) => {
            if (response.body.status != null) {
                console.log("log in failed")
                response.body.ahref = "/";
                res.render('common/error', response.body);
            } else {
                console.log("log in success");
                response.body.token = response.body;
                res.render('common/modal', {"token": response.body, "message" : "log in complete", "ahref": "/"});
            }
        });
});

module.exports = router;
