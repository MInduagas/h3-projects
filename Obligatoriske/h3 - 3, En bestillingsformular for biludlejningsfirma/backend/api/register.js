const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/', jsonParser, (req, res) => {
    try {
        const { username, password, email, phone, zipcodeid, address } = req.body;
        console.log(req.body)
        pool.query(`SELECT username, email, phone FROM "User" WHERE username = '${username}' OR email = '${email}' OR phone = '${phone}'`, (error, results) => {
            if (error) {
                res.status(500).send({message : 'Something Went Wrong'});
            } else {
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    if (results.rows.length > 0) {
                        res.status(500).send({message : 'Username, email or phone already exists'});
                    } else {
                        pool.query(`INSERT INTO "User" (username, password, email, phone, zipcodeid, address, roleid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [username, hash, email.toLowerCase(), phone, zipcodeid, address, 1], (error, results) => {
                            if (error) {
                                res.status(500).send({message: 'Something Went Wrong'});
                            } else {
                                console.log(results.rows[0]);
                                res.status(200).send({message: 'User created', id: results.rows[0].id});
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).send({message : 'Something Went Wrong'});
    }
});

module.exports = router;