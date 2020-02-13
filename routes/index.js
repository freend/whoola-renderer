var express = require('express');
var unirest = require('unirest');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function (req, res, next) {
  res.render('member/signup');
});
const apiUrl = process.env.API_HOST;
    router.post('/signup', function (req, res, next) {
  unirest
      .post(apiUrl + '/member/signup')
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
          "mail": req.body["id"], "password": req.body["password"], "inviteReferralCode": req.body["referralCode"]
      })
      .then((response) => {
          if (response.body.status != null) {
              response.body.ahref = "/signup";
              res.render('common/error', response.body);
          } else {
              res.render("common/error", {'message': "sign up complete", 'ahref': '/'});
          }
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
