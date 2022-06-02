const express = require('express');
const app = express();
const cors = require('cors');
const Web3 = require('web3');

const artifactsJSON = require('../../build/contracts/Voting.json');

const CONTACT_ADDRESS = "0xB19D7cF226A6EB75da810feD83a8893FF8163F8c";

app.use(cors());
app.use(express.json());

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider);
} else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
}

const contactList = new web3.eth.Contract(artifactsJSON.abi, CONTACT_ADDRESS);

app.get('/candidates', async (req, res) => {
    let cache = [];

    for (let i = 0; i < 2; i++) {
        const contact = await contactList.methods.candidate_list(i).call();
        cache.push(contact);
    }

    res.json(cache);
});

module.exports = app;