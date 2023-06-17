const express = require('express');
const dbConnection = require('./config/dbconnect');
const app = express()
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000 ;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute")
const categoryRouter = require('./routes/prodcategoryRouter')
const blogCategory = require('./routes/blogCatRouter')
const brand = require("./routes/brandRouter")
const couponRouter = require('./routes/couponRoute')
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
app.use('/api/blog',blogRouter)
app.use('/api/prodcategory',categoryRouter)
app.use('/api/blogcategory',blogCategory)
app.use('/api/brand' , brand)
app.use('/api/coupon' ,couponRouter)
app.use(errorHnadler)
app.use(notFond)
app.listen(PORT , ()=>{
    console.log(`serveur is running at port  ${PORT}`)
});