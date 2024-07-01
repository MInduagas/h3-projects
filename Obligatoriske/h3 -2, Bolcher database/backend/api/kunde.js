const express = require('express');
const router = express.Router();


const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// post /api/kunde

router.post('/', jsonParser, (req, res) => {
    const { navn, email, adrasse, postnummerid } = req.body;
    pool.query('INSERT INTO "Kunde" (navn, email, adrasse, postnummerid) VALUES ($1, $2, $3, $4)', [navn, email, adrasse, postnummerid], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Kunde added with ID: ${results.insertId}`);
    });
});

// get all /api/kunde

router.get('/', (req, res) => {
    pool.query('SELECT "Kunde".*, "Postnummer".postnummer, "Postnummer".by FROM "Kunde" INNER JOIN "Postnummer" ON "Kunde".postnummerid = "Postnummer".id ORDER BY "Kunde".id', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

router.get('/orders/', (req, res) => {
    pool.query('SELECT "Kunde".id, "Kunde".navn, COUNT("Order".id) as order_count FROM "Kunde" INNER JOIN "Order" ON "Kunde".id = "Order".kundeid GROUP BY "Kunde".id, "Kunde".navn ORDER BY order_count DESC', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

router.get('/orders/:bolcher', (req, res) => {
    const bolche = req.params.bolcher.split(',');

    // get all orders for each bolche navn
    const promises = bolche.map(bolche => {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT "Kunde".id AS kundeid, "Kunde".navn, "Order".id, "Order".orderdato, 
                ARRAY(
                    SELECT json_build_object('antal', "Order_Items".antal, 'navn', "Bolche".navn, 'rovarepris', "Bolche".rovarepris)
                    FROM "Order_Items"
                    INNER JOIN "Bolche" ON "Order_Items".bolcheid = "Bolche".id
                    WHERE "Order_Items".orderid = "Order".id
                ) AS order_items
                FROM "Kunde"
                INNER JOIN "Order" ON "Kunde".id = "Order".kundeid
                INNER JOIN "Order_Items" ON "Order".id = "Order_Items".orderid
                INNER JOIN "Bolche" ON "Order_Items".bolcheid = "Bolche".id
                WHERE "Bolche".navn = $1
                GROUP BY "Kunde".id, "Kunde".navn, "Order".id, "Order".orderdato
                ORDER BY "Kunde".navn, "Order".orderdato 
            `;

            pool.query(sql, [bolche], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.rows);
                }
            });
        });
    });
    Promise.all(promises)
        .then(rows => {
            const data = rows.flat().map(row => ({
                id: row.id,
                kundeid: row.kundeid,
                orderdato: row.orderdato,
                navn: row.navn,
                orderItem: row.order_items
            }));

            res.status(200).json(data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        });
});
// get one /api/kunde/:id

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM "Kunde" WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
});

// get all kunder that has ordered specfic bolche navn

router.get('/b/:bolche', (req, res) => {
    const bolche = req.params.bolche;
    pool.query(`SELECT "Kunde".id, "Kunde".navn, COUNT(DISTINCT "Order".id) as order_count
                FROM "Kunde"
                INNER JOIN "Order" ON "Kunde".id = "Order".kundeid
                INNER JOIN "Order_Items" ON "Order".id = "Order_Items".orderid
                INNER JOIN "Bolche" ON "Order_Items".bolcheid = "Bolche".id
                WHERE "Bolche".navn = $1
                GROUP BY "Kunde".id, "Kunde".navn
                ORDER BY "Kunde".id`, [bolche], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
});

router.get('/cs/:postnummer/:styrke', (req, res) => {
    const postnummer = req.params.postnummer;
    const styrke = req.params.styrke;
    pool.query(`SELECT "Kunde".id, "Kunde".navn, "Kunde".email, "Kunde".adrasse, "Postnummer".postnummer, "Postnummer".by, "Styrke".styrke
                FROM "Kunde"
                INNER JOIN "Postnummer" ON "Kunde".postnummerid = "Postnummer".id
                INNER JOIN "Order" ON "Kunde".id = "Order".kundeid
                INNER JOIN "Order_Items" ON "Order".id = "Order_Items".orderid
                INNER JOIN "Bolche" ON "Order_Items".bolcheid = "Bolche".id
                INNER JOIN "Styrke" ON "Bolche".styrke = "Styrke".id
                WHERE "Postnummer".id = $1 AND "Styrke".id = $2
                GROUP BY "Kunde".id, "Kunde".navn, "Kunde".email, "Kunde".adrasse, "Postnummer".postnummer, "Postnummer".by, "Styrke".styrke
                ORDER BY "Kunde".id`, [postnummer, styrke], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows)
    });
})
module.exports = router; 