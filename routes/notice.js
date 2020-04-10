const express = require('express');
const unirest = require('unirest');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    unirest
        .get(process.env.API_HOST + '/notice' + '?page=' + req.param('page'))
        .send()
        .then((response) => {
            const result = {"page": response.body, "url": 'notice/list'};
            res.render('notice/list', result);
        });
});
router.get('/:id', function (req, res, next) {
    unirest
        .get(process.env.API_HOST + '/notice' + '/' + req.params.id)
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
