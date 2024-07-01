const express = require('express');
const router = express.Router();
const pool = require('../service/pool');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// post /api/order

router.post('/', jsonParser, (req, res) => {
    const { kundeid, orderDato } = req.body; 
    console.log(kundeid, orderDato);
    pool.query('INSERT INTO "Order" (kundeid, orderdato) VALUES ($1, $2)', [kundeid, orderDato], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Order added with ID: ${results.insertId}`);
    });
});


// get all /api/order

router.get('/', (req, res) => {
    pool.query('SELECT "Order".*, "Kunde".navn FROM "Order" INNER JOIN "Kunde" ON "Order".kundeid = "Kunde".id', (error, results) => {
        if (error) {
            throw error;
        }

        const promises = results.rows.map(row => {
            return new Promise((resolve, reject) => {
                pool.query('SELECT "Order_Items".antal, "Bolche".navn, "Bolche".rovarepris FROM "Order_Items" INNER JOIN "Bolche" ON "Order_Items".bolcheid = "Bolche".id WHERE "Order_Items".orderid = $1', [row.id], (error1, results1) => {
                    if (error1) {
                        reject(error1);
                    } else {
                        row.orderItem = results1.rows;
                        resolve(row);
                    }
                });
            });
        });

        Promise.all(promises)
            .then(rows => {
                res.status(200).json(rows);
            })
            .catch(error => {
                // Handle error
                console.error(error);
                res.status(500).json({ error: 'An error occurred' });
            });
    });
});

// get the latest order

router.get('/latest', (req, res) => {
    pool.query('SELECT "Order".*, "Kunde".navn FROM "Order" INNER JOIN "Kunde" ON "Order".kundeid = "Kunde".id ORDER BY "Order".orderDato DESC LIMIT 1', (error, results) => {
        if (error) {
            throw error;
        }

        const promises = results.rows.map(row => {
            return new Promise((resolve, reject) => {
                pool.query('SELECT "Order_Items".antal, "Bolche".navn, "Bolche".rovarepris FROM "Order_Items" INNER JOIN "Bolche" ON "Order_Items".bolcheid = "Bolche".id WHERE "Order_Items".orderid = $1', [row.id], (error1, results1) => {
                    if (error1) {
                        reject(error1);
                    } else {
                        row.orderItem = results1.rows;
                        resolve(row);
                    }
                });
            });
        });

        Promise.all(promises)
            .then(rows => {
                res.status(200).json(rows);
            })
            .catch(error => {
                // Handle error
                console.error(error);
                res.status(500).json({ error: 'An error occurred' });
            });
    });
});

// get one /api/order/:id

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM "Order" WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
});

// get by kundeid

router.get('/k/:kundeid', (req, res) => {
    const kundeid = parseInt(req.params.kundeid);
    const sql = `
        SELECT "Order".*, 
        ARRAY(
            SELECT json_build_object('antal', "Order_Items".antal, 'navn', "Bolche".navn, 'rovarepris', "Bolche".rovarepris)
            FROM "Order_Items"
            INNER JOIN "Bolche" ON "Order_Items".bolcheid = "Bolche".id
            WHERE "Order_Items".orderid = "Order".id
        ) AS order_items
        FROM "Order"
        WHERE "Order".kundeid = $1
    `;
    pool.query(sql, [kundeid], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
});

router.get('/v/:gram', (req, res) => {
    const gram = parseInt(req.params.gram);
    const sql = `
        SELECT "Kunde".id, "Kunde".navn, order_weights.total_weight, "Order".id as orderid
        FROM "Kunde"
        INNER JOIN "Order" ON "Kunde".id = "Order".kundeid
        INNER JOIN (
            SELECT orderid, SUM("Order_Items".antal * "Bolche".vægt) as total_weight
            FROM "Order_Items"
            INNER JOIN "Bolche" ON "Order_Items".bolcheid = "Bolche".id
            GROUP BY orderid
        ) AS order_weights ON "Order".id = order_weights.orderid
        WHERE order_weights.total_weight > $1
        GROUP BY "Kunde".id, "Kunde".navn, order_weights.total_weight, "Order".id
        ORDER BY total_weight desc
    `;
    pool.query(sql, [gram], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
});

// get all kunder if their total price of a order is more than x

router.get('/p/:pris', (req, res) => {
    const pris = parseInt(req.params.pris);
    const sql = `
        SELECT "Kunde".id, "Kunde".navn, order_prices.total_price, "Order".id as orderid
        FROM "Kunde"
        INNER JOIN "Order" ON "Kunde".id = "Order".kundeid
        INNER JOIN (
            SELECT orderid, ROUND(SUM("Order_Items".antal * ("Bolche".rovarepris + "Bolche".rovarepris * 2.5 * 1.25))/100, 2) as total_price
            FROM "Order_Items"
            INNER JOIN "Bolche" ON "Order_Items".bolcheid = "Bolche".id
            GROUP BY orderid
        ) AS order_prices ON "Order".id = order_prices.orderid
        WHERE order_prices.total_price > $1
        GROUP BY "Kunde".id, "Kunde".navn, order_prices.total_price, "Order".id
        ORDER BY total_price desc
    `;
    pool.query(sql, [pris], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
});

module.exports = router;