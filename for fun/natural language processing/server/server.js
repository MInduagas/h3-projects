const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {NlpManager} = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const rawdata = fs.readFileSync('data.json');
const data = JSON.parse(rawdata);

data.Documents.forEach(doc => {
    manager.addDocument(doc.Language, doc.Sentance, doc.Intent);
});

data.Answers.forEach(answer => {
    manager.addAnswer(answer.Language, answer.Intent, answer.Answer);
});

manager.train(
    process.env.TRAINING_ITERATIONS || 100,
    process.env.TRAINING_EPOCHS || 50
).then(() => {
    manager.save();

    app.post('/chat', async (req, res) => {
        let message = req.body.message;
        let result = await manager.process('en', message);
        if(!result.answer){
            const responses = [
                "I'm sorry, I didn't catch that.",
                "Apologies, I don't understand.",
                "Sorry, can you say that again?",
                "I'm sorry, I didn't get that.",
                "Can you rephrase that, please?",
                "Sorry, I'm having trouble understanding.",
                "I'm sorry, can you repeat that?"
            ];  
            result.answer = responses[Math.floor(Math.random() * responses.length)];
        }
        res.send({
            message: result.answer
        });
        console.log('User:', message);
        console.log('Bot:', result.answer);
        console.log('Intent:', result.intent);
    });

    app.listen(8080, () => {
        console.log('Server is running on port 8080');
    });
}  ).catch((err) => {
    console.error(err);
});