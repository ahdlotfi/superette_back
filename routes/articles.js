const express = require('express');
const router = express.Router();
const articles = require('../services/articles');

/* GET programming languages. */
router.get('/', async function (req, res, next) {
    try {
        res.json(await articles.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting articles `, err.message);
        next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        res.json(await articles.create(req.body));
    } catch (err) {
        console.error(`Error while creating the article`, err.message);
        next(err);
    }
});

module.exports = router;