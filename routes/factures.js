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

module.exports = router;