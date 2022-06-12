const express = require('express');
const app = express();
const cors = require('cors');
const Web3 = require('web3');
const bodyParser = require('body-parser');

const artifactsJSON = require('../../build/contracts/Voting.json');

const CONTACT_ADDRESS = "0xEd152E7BB527f4d18A77431250C90b91176Af6f4";

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
} else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
}

const vote = new web3.eth.Contract(artifactsJSON.abi, CONTACT_ADDRESS);

app.get('/candidate', async (req, res) => {
    let cache = [];

    for (let i = 0; i < 2; i++) {
        const candidate = await vote.methods.candidate_list(i).call();
        cache.push(candidate);
    }

    res.json(cache);
});

app.post('/voter/add', async (req, res) => {
    try {
        const reply = await vote.methods.add_voter(req.body.eth_address).send({ from: req.body.eth_address });
        console.log(reply);
        res.status(200).json({ "message": "success" });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ "message": "failure" });
    }
});

app.post('/voter/verify', async (req, res) => {
    try {
        const reply = await vote.methods.verify_voter(req.body.eth_address).send({ from: req.body.eth_address });
        console.log(reply);
        res.status(200).json({ "message": "success" });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ "message": "failure" });
    }
});

app.post('/voter/vote', async (req, res) => {
    try {
        const reply = await vote.methods.vote(req.body.vote).send({ from: req.body.eth_address });
        console.log(reply);
        res.status(200).json({ "message": "success" });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ "message": "failure" });
    }
});

app.get('/results', async (req, res) => {
    try {
        const results = await vote.methods.get_results().call();
        res.status(200).json(results);
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ "message": "server error" });
    }

});

module.exports = app;