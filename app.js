const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// requring mongo connect
const mongoConnect = require('./src/dbConnect/mongoConnect');
mongoConnect();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

// requiring routers
const userRouter = require('./src/users/routes.config')
userRouter.routesConfig(app);

const candidateRouter = require('./src/candidates/routes.config')
candidateRouter.routesConfig(app);


const cors = require('cors');

app.use(cors());
app.use(express.json());

const chainRouter = require("./src/blockchain/chainInteract");
app.use('/chain', chainRouter);

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
});