const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    try {
        const { name, classid, priceid, isrented } = req.body;
        pool.query(`INSERT INTO "Car" (name, classid, priceid, isrented) VALUES ($1, $2, $3, $4)`, [name, classid, priceid, isrented ], (error, results) => {
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
        const query = `
        SELECT "Car".id as carid, "Car".name, "Class".class, "Price".price, "Car".isrented
        FROM "Car"
        INNER JOIN "Class" ON "Car".classid = "Class".id
        INNER JOIN "Price" ON "Car".priceid = "Price".id
        ORDER BY "Price".price ASC, "Car".name ASC
        `;
        pool.query(query, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

router.get('/avaliable/:fromDate/:toDate', (req, res) => {
    try {
        const fromDate = req.params.fromDate;
        const toDate = req.params.toDate;
        
        const query = `
        SELECT "Car".id as carid, "Car".name, "Class".class, "Price".price, "Car".isrented
        FROM "Car"
        INNER JOIN "Class" ON "Car".classid = "Class".id
        INNER JOIN "Price" ON "Car".priceid = "Price".id
        WHERE "Car".id NOT IN (
            SELECT "Car".id
            FROM "Car"
            INNER JOIN "Order" ON "Car".id = "Order".carid
            WHERE "Order".fromdate <= '${toDate}' AND "Order".todate >= '${fromDate}'
        )
        ORDER BY "Price".price ASC, "Car".name ASC
        `;
        pool.query(query, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            console.log(results.rows);
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
})

router.put('/free/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        pool.query(`UPDATE "Car" SET isrented = false WHERE id = $1`, [id], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                console.log("Car is now freed with the id of " + id);
                res.sendStatus(200);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
})

module.exports = router; 