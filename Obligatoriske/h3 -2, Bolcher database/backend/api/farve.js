const express = require('express');
const router = express.Router();

const pool = require('../service/pool');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });


// GET ALL /api/farve

router.get('/', (req, res) => {
    pool.query('SELECT * FROM "Farve"', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// GET ONE /api/farve/:id

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM "Farve" WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// GET by farve

router.get('/f/:farve', (req, res) => {
    const farve = req.params.farve;
    pool.query('SELECT * FROM "Farve" WHERE farve = $1', [farve], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// POST /api/farve

router.post('/', jsonParser, (req, res) => {
    const { farve } = req.body;
    pool.query('INSERT INTO "Farve" (farve) VALUES ($1)', [farve], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Farve added with ID: ${results.insertId}`);
    });
});

module.exports = router;