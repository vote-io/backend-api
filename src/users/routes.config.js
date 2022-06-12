const userController = require('./controllers/user.controllers');

exports.routesConfig = function (app) {
    app.post('/user/signup', [
        userController.insert
    ])
    app.post('/user/verify', [
        userController.verify
    ])
    app.post('/user/login', [
        userController.login
    ])
}