const express = require('express');
const router = express.Router();
const pool = require('../service/pool');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// post /api/order_item

router.post('/', jsonParser, (req, res) => {
    // orderid, bolcheid, antal
    const { orderid, bolcheid, antal } = req.body;
    pool.query('INSERT INTO "Order_Items" (orderid, bolcheid, antal) VALUES ($1, $2, $3)', [orderid, bolcheid, antal], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Order_item added with ID: ${results.insertId}`);
    });
});

// get all /api/order_item

router.get('/', (req, res) => {
    pool.query('SELECT * FROM "Order_Items"', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// get one /api/order_item/:id

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM "Order_Items" WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
});

// get by orderid

router.get('/o/:orderid', (req, res) => {
    const orderid = parseInt(req.params.orderid);
    pool.query('SELECT * FROM "Order_Items" WHERE orderid = $1', [orderid], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
});

module.exports = router;