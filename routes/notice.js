const express = require('express');
const unirest = require('unirest');
const router = express.Router();

const apiUrl = process.env.API_HOST + '/notice';
/* GET home page. */
router.get('/', function(req, res, next) {
    var sendUrl = '';
    if (req.param('page') != null) {
        sendUrl += '?page=' + req.param('page');
    }

    unirest
        .get(apiUrl)
        .send()
        .then((response) => {
            const result = {"page": response.body, "url": 'notice/list'};
            res.render('notice/list', result);
        });
});
router.get('/:id', function (req, res, next) {
    unirest
        .get(apiUrl + '/' + req.params.id)
        .send()
        .then((response) => {
            if (response.body.status == '404') {
                res.render('error', response.body);
            }
            console.log("body : " + response.body.title + ", " + response.body.content + ", " + response.body.createAt);
            res.render('notice/detail', response.body);
        });
});

module.exports = router;
