const Pool = require('pg').Pool;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let currToken;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'CarRentalDB',
    password: 'Admin',
    port: 5432,
});

const homeBrewedAccessToken = (req, res, next) => {
    let { token } = req.headers;

    if(currToken != null){
        if (bcrypt.compareSync(currToken, token)) {
            currToken = uuidv4();
            token = bcrypt.hashSync(currToken, saltRounds);
            req.headers.token = token;
            next();
        } else {
            res.status(401).send({message: 'Unauthorized'});
        }
    } else {
        currToken = uuidv4();
    }
}

module.exports = pool;
module.exports.homeBrewedAccessToken = homeBrewedAccessToken;
