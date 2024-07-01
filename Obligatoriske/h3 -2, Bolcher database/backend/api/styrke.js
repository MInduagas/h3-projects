const express = require('express');
const router = express.Router();
const pool = require('../service/pool');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// GET ALL /api/styrke

router.get('/', (req, res) => {
    pool.query('SELECT * FROM "Styrke"', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// GET ONE /api/styrke/:id

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM "Styrke" WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// GET by styrke

router.get('/s/:styrke', (req, res) => {
    const styrke = req.params.styrke;
    pool.query('SELECT * FROM "Styrke" WHERE styrke = $1', [styrke], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
}
);

// POST /api/styrke

router.post('/', jsonParser, (req, res) => {
    const { styrke } = req.body;
    pool.query('INSERT INTO "Styrke" (styrke) VALUES ($1)', [styrke], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Styrke added with ID: ${results.insertId}`);
    });
}
);

module.exports = router;