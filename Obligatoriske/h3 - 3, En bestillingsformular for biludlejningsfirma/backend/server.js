const express = require('express');
const app = express();
const port = 7889;
const cors = require('cors');
const { User, Order, OrderAccessory, Class, Accessory, Zipcode, Car, login, register, price, role} = require('./api/index');

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
}));

let counter = 0
let temp;

app.use((req, res, next) => {
    if(req.ip !== '::1'){
        if(temp != "Rokas is here"){
            temp = "Rokas is here";
        }
        res.status(401).send({message: req.ip});
        return;
    }
    console.log(req.ip  + " " + req.method + " " + req.url)
    next();
});

app.use('/api/user', User);
app.use('/api/order', Order);
app.use('/api/orderAccessory', OrderAccessory);
app.use('/api/car', Car);
app.use('/api/class', Class);
app.use('/api/accessory', Accessory);
app.use('/api/zipcode', Zipcode);
app.use('/api/login', login);
app.use('/api/register', register);
app.use('/api/price', price);
app.use('/api/role', role);

app.listen(port, () => {
    console.log('App listening on port ' + port );
});