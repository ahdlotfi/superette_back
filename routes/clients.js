const express = require('express');
const router = express.Router();
const clients = require('../services/clients');

router.get('/', async function (req, res, next) {
    try {
        res.json(await clients.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting clients `, err.message);
        next(err);
    }
});

module.exports = router;