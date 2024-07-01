const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    try {
        const { name } = req.body;
        const query = `INSERT INTO "Class" (class) VALUES ($1)`;
        pool.query(query, [name], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            res.status(201).send(`Class added`);
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/', (req, res) => {
    try {
        const query = `
        SELECT * FROM "Class"
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

router.get('/:id', (req, res) => {
    try {
        const id = req.params.id;
        const query = `
        SELECT * FROM "Class"
        `;
        pool.query(query + ` WHERE id = ${id}`, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router; 