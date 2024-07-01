const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    try {
        const { name, priceid} = req.body;
        const query = `INSERT INTO "Accessory" (name, priceid) VALUES ($1, $2)`;
        pool.query(query, [name, priceid], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            res.status(201).send(`Accessory added`);
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/', (req, res) => {
    try {
        const query = `
        SELECT "Accessory".id, "Accessory".name, "Price".price FROM "Accessory"
        INNER JOIN "Price" ON "Accessory".priceid = "Price".id
        ORDER BY name ASC;
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