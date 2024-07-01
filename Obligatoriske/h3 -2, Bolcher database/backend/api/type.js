const express = require('express');
const router = express.Router();
const pool = require('../service/pool');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
  


// GET ALL /api/type

router.get('/', (req, res) => {
    pool.query('SELECT * FROM "Type"', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
}
);

// GET ONE /api/type/:id

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM "Type" WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
}
);

// GET by type

router.get('/t/:type', (req, res) => {
    const type = req.params.type;
    pool.query('SELECT * FROM "Type" WHERE type = $1', [type], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
}
);

// POST /api/type

router.post('/', jsonParser, (req, res) => {
    const { type } = req.body;
    pool.query('INSERT INTO "Type" (type) VALUES ($1)', [type], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Type added with ID: ${results.insertId}`);
    });
}
);

module.exports = router;