const express = require('express');
const router = express.Router();
const pool = require('../service/pool');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Get All /api/surhed

router.get('/', (req, res) => {
    pool.query('SELECT * FROM "Surhed"', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// Get One /api/surhed/:id

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM "Surhed" WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// Get by surhed

router.get('/s/:surhed', (req, res) => {
    const surhed = req.params.surhed;
    pool.query('SELECT * FROM "Surhed" WHERE surhed = $1', [surhed], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });

});

// POST /api/surhed

router.post('/', jsonParser, (req, res) => {
    const { surhed } = req.body;
    pool.query('INSERT INTO "Surhed" (surhed) VALUES ($1)', [surhed], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Surhed added with ID: ${results.insertId}`);
    });
});

module.exports = router;