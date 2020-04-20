var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000;
bodyParser = require('body-parser');
var cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
var routes = require('./app/routes/deviceCodeRoutes'); //importing route
routes(app); //register the route
app.listen(port);

console.log('deviceCode RESTful API server started on: ' + port);