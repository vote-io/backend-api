const candidateController = require('./controllers/candidate.controller');
const multer = require('multer');
const upload = multer();

exports.routesConfig = function (app) {
    app.post('/candidate/picture', [
        upload.single('ppic'),
        candidateController.profilePic
    ])
}
