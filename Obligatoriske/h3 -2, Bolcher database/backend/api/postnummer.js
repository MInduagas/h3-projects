const express = require('express');
const router = express.Router();
const pool = require('../service/pool');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// post /api/postnummer

router.post('/', jsonParser, (req, res) => {
    const { postnummer, by } = req.body;
    pool.query('INSERT INTO "Postnummer" (postnummer, by) VALUES ($1, $2)', [postnummer, by], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Postnummer added with ID: ${results.insertId}`);
    });
});

// get all /api/postnummer

router.get('/', (req, res) => {
    pool.query('SELECT * FROM "Postnummer" ORDER BY "Postnummer".postnummer asc', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// get one /api/postnummer/:id

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM "Postnummer" WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
});

module.exports = router;