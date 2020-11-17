const database = require("./database");
const express = require('express');
const app = express();
const routes = require('./routes');
const port = process.env.PORT || 5000;

database.sequelize.sync().then(() => {
    console.log("Successfully connect to database");

    // Setup  cors setting
    app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin");
        next();
    });

    app.use(express.static('public'))

    app.use('/', routes);

    app.listen(port, () => {
        console.log(`Data Module is served at http://localhost:${port}`)
    })
}, (err) => {
    console.log("Connection Error: ", err);
})