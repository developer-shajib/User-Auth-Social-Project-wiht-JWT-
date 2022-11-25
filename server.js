import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
import { mongoDBConnect } from './config/db.js';
import session from 'express-session';
import { localsMiddleware } from './middleware/localsMiddleware.js';
import userRoute from './routes/userRoute.js'
import cookieParser from 'cookie-parser'

//environment variable
dotenv.config();
const port = process.env.PORT || 8080

//init express
const app = express();

//set form data
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//setup cookie parser
app.use(cookieParser())

//setup session
app.use( session({
    secret : "I Love MERN",
    saveUninitialized : true,
    resave : false
}))

//use locals middleware
app.use(localsMiddleware)

//static folder
app.use(express.static('public'));

//ejs template engine setup
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/app')



//routes
app.use(userRoute)





//server listener
app.listen(port,()=>{
    mongoDBConnect()
    console.log(`Server is running on port ${port}`.bgGreen);
})