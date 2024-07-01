const express = require('express');
const {
    Pool
} = require('pg');
const app = express();
const port = 8989;
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');

const bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ChatAppDB',
    password: 'Admin',
    port: 5432,
});

app.get('/messages/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    try {
        pool.query('SELECT * FROM "message" WHERE "roomid" = $1 ORDER BY "creationdate" desc', [roomId], (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        });
    } catch (error) {
        console.log(error);
    }
});

app.get('/messages', (req, res) => {
    try {
            pool.query('SELECT * FROM "message" ORDER BY "creationdate" asc', (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(200).json(results.rows);
            });
    } catch (error) {
        console.log(error);
        
    }
});

app.post('/messages', jsonParser, (req, res) => {
    const {
        roomid,
        userid,
        message
    } = req.body;
    try {
        pool.query('INSERT INTO "message" ("roomid", "userid", "message") VALUES ($1, $2, $3)', [roomid, userid, message], (error, results) => {
            if (error) {
                throw error;
            }
            broadcast(req.body);
            res.status(201).send(`Message added with ID: ${results.insertId}`);
        });
    } catch (error) {
        console.log(error);
    }
});

app.delete('/messages', jsonParser, (req, res) => {
    try {
        pool.query('DELETE FROM "message"', (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Messages deleted`);
        });
    } catch (error) {
        console.log(error);
    }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({port : 8990});

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

wss.on('connection', ws => {
    ws.on('message', message => {
        if(message == null || message == undefined || message == '') return;

        // Parse the message string into an object
        const data = JSON.parse(message);
        try {
            pool.query('INSERT INTO "message" ("roomid", "userid", "message") VALUES ($1, $2, $3)', [data.roomid, data.userid, data.message], (error, results) => {
                if (error) {
                    throw error;
                }
                broadcast(data);
            });
        } catch (error) {
            console.log(error);
        }
    });
});

app.listen(port, () => {
  console.log(`Server running at http://172.16.3.113:${port}`);
});