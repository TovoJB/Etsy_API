const express = require('express');
const dbConnection = require('./config/dbconnect');
const app = express()
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000 ;
const authRouter = require("./routes/authRoute");
const bodyParser = require('body-parser');
const{ errorHnadler , notFond}  = require("./middlewares/errorHandler")

dbConnection();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))
app.use('/api/user' , authRouter )

app.use(errorHnadler)
app.use(notFond)
app.listen(PORT , ()=>{
    console.log(`serveur is running at port  ${PORT}`)
});