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
        "referralCode": req.param('referralCode'),
        'env': process.env.NODE_ENV
    }
    res.render('member/register', result);
});
router.get('/signup', function (req, res, next) {
    const returnUrl = getUrl(req.header('referer'));
    console.log('return url', returnUrl);
    // const product = req.param('productId');
    // const number = req.param('phoneNumber');
    const result = {
        "referralCode": null,
        'env': process.env.NODE_ENV,
        'url': returnUrl
        // "productId": (product == undefined) ? "" : product,
        // "phoneNumber": (number == undefined) ? "" : number
    }
  res.render('member/register', result);
});
router.post('/signup', function (req, res, next) {
    const returnUrl = req.body["url"];
    console.log('return url', returnUrl);
    // const productId = req.body["productId"];
    // const phoneNumber = req.body["phoneNumber"];
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
                      // "productId": productId,
                      // "phoneNumber": phoneNumber
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
    // const product = req.param('productId');
    // const number = req.param('phoneNumber');
    const result = {
        'env': process.env.NODE_ENV,
        // "productId": (product == undefined) ? "" : product,
        // "phoneNumber": (number == undefined) ? "" : number,
        'url': returnUrl
    };
    res.render('member/login', result);
});
router.get('/sample', function (req, res, next) {
    res.render('member/complete', {
        "ahref": '/',
        'env': process.env.NODE_ENV
    });
});
// get login info
router.post('/login', function (req, res, next) {
    // const productId = req.body["productId"];
    // const phoneNumber = req.body["phoneNumber"];
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
                        // "productId": productId,
                        // "phoneNumber": phoneNumber
                    });
            }
        });
});

module.exports = router;
