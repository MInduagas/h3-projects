const fs = require('fs');
const http = require('http');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const axios = require('axios');
const e = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/insertTrainingData', (req, res) => {
  const data = req.body;
    fs.readFile('data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        const data1 = JSON.parse(jsonString);
        // insert the data into data1.trainingData
        data1.trainingData.push(data);
        // write the data1 into the
        fs.writeFile('data.json', JSON.stringify(data1), (err) => {
            if (err) {
                console.log("File write failed:", err);
                return;
            }
            console.log('Data has been added to the file')
            res.send({message: 'Data has been added to the file'});
        });
    });
});

app.get('/removeInvalidData', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        const data = JSON.parse(jsonString);
        const newData = data.trainingData.filter((element) => {
            let isInvalid = false;
            element.image.forEach((pixel) => {
                if (pixel !== 0 && pixel !== 1) {
                    isInvalid = true;
                }
            });
            // or if value is not between 0 and 9 or is not an integer or is empty
            if (element.value < 0 || element.value > 9 || !Number.isInteger(element.value) || element.value === '') {
                isInvalid = true;
            }
            return isInvalid
        });
        data.trainingData = newData;
        fs.writeFile('data.json', JSON.stringify(data), (err) => {
            if (err) {
                console.log("File write failed:", err);
                return;
            }
            console.log('Invalid data has been removed from the file')
            res.send({message: 'Invalid data has been removed from the file'});
        });
    });
});

app.get('/getTrainingData', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        res.send(jsonString);
    });
});

app.get('/amountOfData', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        const data = JSON.parse(jsonString);
        const amountOfData = {};
        data.trainingData.forEach((element) => {
            if (amountOfData[element.value]) {
                amountOfData[element.value] += 1;
            } else {
                amountOfData[element.value] = 1;
            }
        });
        res.send(amountOfData);
    });
});

app.post('/predict', async (req, res) => {
    const data = req.body;
    const sendData = { key: 'value', value: data.value };
    await axios.post('http://localhost:5000/predict', data)
        .then((response) => {
            res.send(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        });
});

// train the model with the data


app.listen(7889, () => {
    console.clear();
    console.log('Server is running on port 7889');
});