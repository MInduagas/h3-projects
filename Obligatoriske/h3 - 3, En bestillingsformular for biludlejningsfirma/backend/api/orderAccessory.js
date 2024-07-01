const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    try {
        const { order_id, accessory_id } = req.body;
        const query = `INSERT INTO "OrderAccessory" (orderid, accessoryid) VALUES ($1, $2)`;
        pool.query(query, [order_id, accessory_id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            res.status(201).send(`OrderAccessory added`);
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/', (req, res) => {
    try {
        const query = `
        SELECT * FROM "OrderAccessory"
        ORDER BY id ASC;
        `; 
        pool.query(query, (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        });
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router; 