var express = require('express');
var unirest = require('unirest');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main/landing', {'env': process.env.NODE_ENV});
});
router.get('/checker', function (req, res) {
    res.json({"message": 'Hoola Moola 2020-04-28 v03'});
});
router.get('/signupReferral/:referralCode', function (req, res) {
    const result = {
        'mail': req.param('receiver'),
        'referralCode': req.param('referralCode'),
        'env': process.env.NODE_ENV,
        'url': '/?token='
    }
    res.render('member/register', result);
});
router.get('/signup', function (req, res, next) {
    const returnUrl = getUrl(req.header('referer'));
    console.log('return url', returnUrl);
    const result = {
        'referralCode': null,
        'env': process.env.NODE_ENV,
        'mail': null,
        'url': returnUrl
    }
  res.render('member/register', result);
});
router.post('/signup', function (req, res, next) {
    const returnUrl = req.body["url"];
  unirest
      .post(process.env.API_HOST + '/member/signup')
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
          "mail": req.body["id"], "password": req.body["password"], "inviteReferralCode": req.body["referralCode"]
      })
      .then((response) => {
          console.log("sign up result", response.body.token.toString());
          switch (response.status) {
              case 500 :
                  res.render('common/error', {"message" : response.body.message, "ahref": '/signup'});
                  break;
              case 200:
                  res.render('common/loginmodal', {
                      "message" : response.body.message,
                      "ahref": returnUrl,
                      'env': process.env.NODE_ENV,
                      "token": response.body.token.toString()
                  });
                  break;
          }
      });
});
function getUrl(url) {
    var result = url.split('/')[url.split('/').length - 1].split('token=')[0] + 'token=';
    if (url.split('/')[url.split('/').length - 2] === 'order') {
        result = '/order/' + result;
    }
    if (url.split('/')[url.split('/').length - 2] === 'withdraw') {
        result = '/withdraw/' + result;
    }
    if (result === 'logintoken=') {
        result = 'token=';
    }
    return (result === 'token=') ? '/order?token=' : result;
}
// call login page
router.get('/login', function (req, res, next) {
    const returnUrl = getUrl(req.header('referer'));
    console.log('get login return url', returnUrl);
    const result = {
        'env': process.env.NODE_ENV,
        'url': returnUrl
    };
    res.render('member/login', result);
});
// get login info
router.post('/login', function (req, res, next) {
    const returnUrl = req.body["url"];
    unirest
        .post(process.env.API_HOST + '/member/signin')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send({ "mail": req.body["id"], "password": req.body["password"] })
        .then((response) => {
            console.log(response);
            if (response.body.status != null) {
                console.log("log in failed")
                response.body.ahref = "/login";
                res.render('common/error', response.body);
            } else {
                console.log("log in success");
                res.render('common/loginmodal',
                    {
                        "message" : "Log-in Successful",
                        "ahref": returnUrl,
                        'env': process.env.NODE_ENV,
                        "token": response.body
                    });
            }
        });
});

module.exports = router;
