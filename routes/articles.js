const express = require('express');
const router = express.Router();
const articles = require('../services/articles');

router.get('/', async function (req, res, next) {
    try {
        res.json(await articles.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting articles `, err.message);
        next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    console.log('looking for : ' + req.params.id);
    try {
        res.json(await articles.getOne(req.params.id));
    } catch (err) {
        console.error(`Error while getting article ${req.params.id} `, err.message);
        next(err);
    }
});



router.post('/', async function (req, res, next) {

    console.log('request : ', req)
    try {
        res.json(await articles.create(req.body));
    } catch (err) {
        console.error(`Error while creating the article`, err.message);
        next(err);
    }
});

router.put('/', async function (req, res, next) {

    console.log('request : ', req)
    try {
        res.json(await articles.update(req.body));
    } catch (err) {
        console.error(`Error while creating the article`, err.message);
        next(err);
    }
});

module.exports = router;