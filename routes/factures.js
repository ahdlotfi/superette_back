const express = require('express');
const router = express.Router();
const factures = require('../services/factures');

router.get('/', async function (req, res, next) {
    try {
        res.json(await factures.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting factures `, err.message);
        next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    console.log('looking for : ' + req.params.id);
    try {
        res.json(await factures.getOne(req.params.id));
    } catch (err) {
        console.error(`Error while getting facture ${req.params.id} `, err.message);
        next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        res.json(await factures.create(req.body));
    } catch (err) {
        console.error(`Error while creating the order`, err.message);
        next(err);
    }
});

router.put('/', async function (req, res, next) {
    try {
        res.json(await factures.update(req.body));
    } catch (err) {
        console.error(`Error while updating the order`, err.message);
        next(err);
    }
});


module.exports = router;