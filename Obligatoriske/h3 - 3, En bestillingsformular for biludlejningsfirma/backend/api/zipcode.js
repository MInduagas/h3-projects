const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    try {
        const { zipcode, city } = req.body;
        pool.query(`INSERT INTO "Zipcode" (zipcode, city) VALUES ($1, $2)`, [zipcode, city], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.sendStatus(200);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.get('/', (req, res) => {
    try {
        pool.query('SELECT * FROM "Zipcode"', (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send(results.rows);
            }
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        pool.query(`SELECT * FROM "Zipcode" WHERE id = ${id}`, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send(results.rows);
            }
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router; 