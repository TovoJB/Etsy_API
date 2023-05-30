const express = require('express');
const dbConnection = require('./config/dbconnect');
const app = express()
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000 ;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const{ errorHnadler , notFond}  = require("./middlewares/errorHandler")
const morgan = require("morgan")

dbConnection();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))
app.use(cookieParser());

app.use('/api/user' , authRouter )
app.use('/api/product',productRouter)

app.use(errorHnadler)
app.use(notFond)
app.listen(PORT , ()=>{
    console.log(`serveur is running at port  ${PORT}`)
});