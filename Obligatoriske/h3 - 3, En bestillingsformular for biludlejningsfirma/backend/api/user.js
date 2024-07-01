const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    try {
        const { name, address, zipcodeid, phone, email } = req.body;
        pool.query('INSERT INTO "User" (name, address, zipcodeid, phone, email, roleid) VALUES ($1, $2, $3, $4, $5, $6)', [name, address, zipcodeid, phone, email, 1], (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            res.status(201).send(`User added`);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }    
});

router.get('/', (req, res) => {
    try {
        const query = `
        SELECT "User".id as userid, "User".username, "User".address, "User".phone, "User".email, "Zipcode".zipcode, "Zipcode".city 
        FROM "User"
        INNER JOIN "Zipcode" ON "User".zipcodeID = "Zipcode".id
        ORDER BY "User".id ASC;
        `;
        pool.query(query, (error, results) => {
            if (error) {
              throw error;
            }
            res.status(200).json(results.rows);
          });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
});

router.get('/:id', (req, res) => {
    try {
        const uid = parseInt(req.params.id);
        if (isNaN(uid)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const query = `
        SELECT "User".id as userid, "User".username, "User".address, "User".phone, "User".email, "Zipcode".zipcode, "Zipcode".city 
        FROM "User"
        INNER JOIN "Zipcode" ON "User".zipcodeID = "Zipcode".id
        WHERE "User".id = $1
        `;
        pool.query(query, [uid], (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
});

// update user role
router.put('/:id', jsonParser, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { roleid } = req.body;
        const query = `
        UPDATE "User"
        SET roleid = $1
        WHERE id = $2
        `;
        pool.query(query, [roleid, id], (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`User role updated`);
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
});

router.get('/admin/s', (req, res) => {
    try {
        const query = `
        SELECT "User".id as userid, "User".username, "User".address, "User".phone, "User".email, "Zipcode".zipcode, "Zipcode".city, COUNT("Order".id) as order_count
        FROM "User"
        INNER JOIN "Zipcode" ON "User".zipcodeID = "Zipcode".id
        LEFT JOIN "Order" ON "User".id = "Order".userid
        GROUP BY "User".id, "User".username, "User".address, "User".phone, "User".email, "Zipcode".zipcode, "Zipcode".city
        ORDER BY "User".id ASC;
        `;
        pool.query(query, (error, results) => {
            if (error) {
              throw error;
            }
            res.status(200).json(results.rows);
          });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
});

module.exports = router; 