const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const cors = require('cors');

app.use(cors());
app.use(express.json());

const chainRouter = require("./src/blockchain/chainInteract");
app.use('/chain', chainRouter);

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});