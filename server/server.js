const express = require('express')
const app = express()

//##    CORS                ##
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//##    Session             ##
const session = require('express-session');
app.use(session({
    secret: `this is a secret and shouldn't be shared in version control etc.`,
    resave: false,
    saveUninitialized: true
}))

//##    Routes              ##
const usersRoute = require("./routes/users.js")
const propertiesRoute = require("./routes/properties.js")
const propertyOwnersRoute = require("./routes/propertyOwners.js")
const paymentsRoute = require("./routes/payments.js")
app.use(usersRoute)
app.use(propertiesRoute)
app.use(propertyOwnersRoute)
app.use(paymentsRoute)

//##    Start server        ##
const server = app.listen(8080, err => {
    if(err) {console.log('Error starting server'); return}
    console.log('Server running on port', server.address().port)
})