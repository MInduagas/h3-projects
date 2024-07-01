const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    try {
        const { role } = req.body;
        const query = `INSERT INTO "Role" (role) VALUES ($1)`;
        pool.query(query, [role], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            res.status(201).send(`Role added`);
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/', (req, res) => {
    try {
        const query = `
        SELECT * FROM "Role"
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