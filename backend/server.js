const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redisClient = require('./app/utills/redisUtil'); 
const { errors } = require("celebrate");
const app = express();
app.use(cors());
app.use(bodyParser.json());




// Invoke the connectDB function
require("./dbConnection").connectDB();

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).send("Server is up and running");
});

// Routes
require("./app/routes/User/user.route")(app);
require("./app/routes/Product/product.route")(app);

app.use(errors());



  
// Set up server port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;