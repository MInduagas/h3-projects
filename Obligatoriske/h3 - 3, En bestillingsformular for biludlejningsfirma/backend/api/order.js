const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
const e = require('express');
var jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    try {
        const { userid, carid, fromdate, todate, totalprice } = req.body;
        pool.query(`INSERT INTO "Order" (userid, carid, fromdate, todate, totalprice) VALUES ($1, $2, $3, $4, $5)`, [userid, carid, fromdate, todate, totalprice], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                res.sendStatus(200);
            }
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.post('/totalprice', jsonParser, (req, res) => {
    try {
        const { car, fromDate, toDate, accessories } = req.body;
        const days = Math.ceil(Math.abs(new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) + 1;
        
        const carQuery = `
        SELECT "Price".price as carprice
        FROM "Car"
        INNER JOIN "Price" ON "Car".priceid = "Price".id
        WHERE "Car".id = $1
        `;

        const accessoriesQuery = `
        SELECT SUM("Price".price) as accessoriesprice
        FROM "Accessory"
        INNER JOIN "Price" ON "Accessory".priceid = "Price".id
        WHERE "Accessory".id = ANY($1)
        `;

        pool.query(carQuery, [car.carid], (error, carResults) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                const carPrice = carResults.rows[0].carprice;
                pool.query(accessoriesQuery, [accessories.map(a => a.id)], (error, accessoriesResults) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send(error);
                    } else {
                        const carPrice = Number(carResults.rows[0].carprice);
                        const accessoriesPrice = Number(accessoriesResults.rows[0].accessoriesprice) || 0;
                        const totalPrice = (carPrice + accessoriesPrice) * days;
                        console.log(totalPrice);
                        res.status(200).json({ totalPrice });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post('/createOrder', jsonParser,async (req, res) => {
    try {
        const {car, carClass, fromDate, toDate, user, accessories} = req.body;

        user.username = user.firstName + " " + user.lastName;  
        user.zipcodeid = user.zipcode;

        const accessoriesIds = accessories.map(accessory => accessory.id);

        const query = 'SELECT create_order($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
        const values = [car.carid, carClass.id, fromDate, toDate, user.username, user.email, user.phone, user.address, user.zipcodeid, accessoriesIds];

        const result = await pool.query(query, values);

        res.status(200).send({'message': 'Order created'});
    } catch (error) {
        console.error(error.message);
    }
})

router.get('/admin', (req, res) => {
    // get all orders
    try {
        const query = `
        SELECT "Order".id as orderid, "User".email,"Car".id as carid, "Car".name as carname, "Car".isrented, "Order".totalprice, "Order".fromdate, "Order".todate,
        (SELECT array_agg("Accessory".name) FROM "OrderAccessory" INNER JOIN "Accessory" ON "OrderAccessory".accessoryid = "Accessory".id WHERE "Order".id = "OrderAccessory".orderid) as accessories
        FROM "Order"
        INNER JOIN "User" ON "Order".userid = "User".id
        INNER JOIN "Car" ON "Order".carid = "Car".id
        ORDER BY "Order".id ASC
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
module.exports = router; 