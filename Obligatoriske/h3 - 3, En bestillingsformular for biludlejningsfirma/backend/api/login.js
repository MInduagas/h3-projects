const express = require('express');
const router = express.Router();
const pool = require('../config');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/', jsonParser, (req, res) => {
    try {
        const { email, password } = req.body;
        bcrypt.hash(password, saltRounds, function(err, hash) {
            pool.query(`SELECT "User".id, email, password, role FROM "User" INNER JOIN "Role" on "User".roleid = "Role".id WHERE email = '${email}'`, (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).send({message: 'Something Went Wrong'});
                } else {
                    if(results.rows.length > 0) {
                        if (bcrypt.compareSync(password, results.rows[0].password)) {
                            res.status(200).send({id: results.rows[0].id, message : 'Login successful', role: results.rows[0].role});
                        } else {
                            res.status(500).send({message: 'Email or Password is wrong'});
                        }
                    } else {
                        res.status(500).send({message: 'Email or Password is wrong'});
                    }
                }
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Something Went Wrong'});
    }
});


module.exports = router; 