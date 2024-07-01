const express = require('express');
const cors = require('cors');
const port = 7889;
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

const bolche = require('./api/bolche');
const farve = require('./api/farve');
const styrke = require('./api/styrke');
const surhed = require('./api/surhed');
const type = require('./api/type');
const kunde = require('./api/kunde');
const order = require('./api/order');
const order_item = require('./api/order_item');
const postnummer = require('./api/postnummer');

app.use('/api/bolche', bolche);
app.use('/api/farve', farve);
app.use('/api/styrke', styrke);
app.use('/api/surhed', surhed);
app.use('/api/type', type);
app.use('/api/kunde', kunde);
app.use('/api/order', order);
app.use('/api/orderitem', order_item);
app.use('/api/postnummer', postnummer);

app.listen(port, () => {
    console.log('Example app listening on port ' + port + '!');
    }
);
 