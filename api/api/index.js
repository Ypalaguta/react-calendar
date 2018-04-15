var router = require('express').Router();
var mocks = require('./mock');
var assign = require('object-assign');
var bodyParser = require("body-parser");

router.get('/weeks/get', function (req, res, next) {
    res.json(mocks.weeks);
    console.log('/weeks/get')
});
router.post('/weeks/set', function (req, res, next) {
    mocks.weeks = req.body;
    console.log('/weeks/set');
    res.end('done');
});

module.exports = router;
