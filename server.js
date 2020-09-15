const database = require("./database");

database.sequelize.sync().then(() => {
    console.log("Successfully connect to database");
}, (err) => {
    console.log("Connection Error: ", err);
})