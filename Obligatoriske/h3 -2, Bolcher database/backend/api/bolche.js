const express = require('express');
const router = express.Router();

const pool = require('../service/pool');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// GET ALL /api/bolche

let mainQuery = `SELECT "Bolche".id, navn, "Farve".farve AS farve, "Styrke".styrke AS styrke, "Surhed".surhed AS surhed, "Type".type AS type, rovarepris, vægt
                FROM "Bolche"
                INNER JOIN
                    "Farve" ON "Bolche".farve = "Farve".id
                INNER JOIN
                    "Styrke" ON "Bolche".styrke = "Styrke".id
                INNER JOIN
                    "Surhed" ON "Bolche".surhed = "Surhed".id
                INNER JOIN
                    "Type" ON "Bolche".type = "Type".id `;

router.get('/', (req, res) => {
    pool.query(mainQuery, (error, results) => {
    if (error) {
        throw error;
    }
    res.status(200).json(results.rows);
    }); 
});

// GET by bolche

router.get('/b/:bolche', (req, res) => {
    const bolche = req.params.bolche;
    pool.query(mainQuery +' WHERE bolche = $1', [bolche], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });

});

//Get all Bolcher by Farve

router.get('/f/:farve', (req, res) => {
    const farve = req.params.farve.split(',');
    pool.query(mainQuery + ` WHERE "Farve".farve = ANY($1::text[])`, [farve], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

// Get All Bolcher by Excluding Farve

router.get('/fn/:farve', (req, res) => {
    const farve = req.params.farve.split(',');
    pool.query(mainQuery +` WHERE "Farve".farve != ALL($1::text[])`, [farve], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    }
    ); 
});

// Get All Bolcher By Text Search

router.get('/t/:text', (req, res) => {
    const text = req.params.text.split(',');
    let query;
    if(text.length == 1) {
        query = ` WHERE navn ILIKE $1`;
        text[text.length - 1] = '%' + text[text.length - 1] + '%';
    } else if(text[0] == 'Start') {
        query = ' WHERE navn ILIKE $1 || \'%\'';
    } else if(text[0] == 'End') {
        query = ' WHERE navn ILIKE \'%\' || $1';
    }
    pool.query(mainQuery + query, [text[text.length - 1]], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    }
    ); 
});

// Get all bolcher by Vægt

router.get('/vm/:vegt', (req, res) => {
    const vegt = req.params.vegt.split(',');
    pool.query(mainQuery + ` WHERE vægt BETWEEN $1 AND $2 ORDER BY navn ASC, vægt ASC`, [vegt[0], vegt[1]], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    }
    );
});

router.get('/vz/:vegt', (req, res) => {
    const vegt = req.params.vegt.split(',');
    let query;
    if(vegt[0] == 'Biggest') {
        query = ' ORDER BY vægt DESC LIMIT ' + vegt[vegt.length-1];
    } else if(vegt[0] == 'Smallest') {
        query = ' ORDER BY vægt ASC LIMIT ' + vegt[vegt.length-1];
    }
    pool.query(mainQuery + query, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

router.get('/v/:vegt', (req, res) => {
    const vegt = req.params.vegt.split(',');
    console.log(vegt);
    let query;
    if(vegt[0] == '') {
        query = ` WHERE vægt = $1`;
    } else if(vegt[0] == 'Less') {
        query = ' WHERE vægt < $1';
    } else if(vegt[0] == 'More') {
        query = ' WHERE vægt > $1';
    }
    pool.query(mainQuery + query, [vegt[vegt.length-1]], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    }
    );
});

router.get('/random/', (req, res) => {
    pool.query('SELECT COUNT(*) FROM "Bolche"', (error, results) => {
        if (error) {
            throw error;
        }
        const count = results.rows[0].count;
        const randomOffset = Math.floor(Math.random() * count);
        pool.query(mainQuery + ' OFFSET $1 LIMIT 1', [randomOffset], (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        });
    });
});

router.get('/sql4/', (req, res) => {
    pool.query('SELECT navn, vægt, rovarepris FROM "Bolche"', (error, results) => {
        if (error) {
            throw error;
        }
        results.rows.forEach(row => {
            const rovarepris = row.rovarepris;
            const vægt = row.vægt;
            const nettopris = (Number(rovarepris) + Number(((rovarepris * 250) / 100)));
            const salgspris = nettopris + (nettopris / 4);
        
            const pricePerGram = salgspris / vægt;
        
            const salgsprisPer100Grams = (pricePerGram * 100).toFixed(2);
        
            row.nettopris = nettopris;
            row.salgspris = salgspris;
            row.salgsprisPer100Grams = salgsprisPer100Grams;
        });
        res.status(200).json(results.rows);
    });
});

// POST /api/bolche
 
router.post('/', jsonParser, (req, res) => {
    // vægt, surhed, farve, styrke, type, rovarepris og navn
    const { vægt, surhed, farve, styrke, type, rovarepris, navn } = req.body;
    pool.query('INSERT INTO "Bolche" (vægt, surhed, farve, styrke, type, rovarepris, navn) VALUES ($1, $2, $3, $4, $5, $6, $7)', [vægt, surhed, farve, styrke, type, rovarepris, navn], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`Bolche added with ID: ${results.insertId}`);
    });
}
);


module.exports = router;