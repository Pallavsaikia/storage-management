
require('dotenv').config();


const express = require('express');
const helmet = require("helmet");
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ErrorResponse = require('./helper/errorresponse');
const createUploadFolders=require('./helper/filesys/create_upload_folders')

//helmet
app.use(helmet.hidePoweredBy());


//dirlocation
global.appRoot = path.resolve(__dirname)

//creating folders for uploads if not exist
createUploadFolders()


//hbs
// app.set('views', path.join(__dirname, 'views'));
// app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: false }));
// app.set('view engine', 'hbs');

//static
// app.use(express.static(path.join(__dirname, '/public')));







//api route
const apiRoutes = require('./api/api_routes/users.api.routes');
const adminApiRoutes = require('./api/api_routes/admin.api.routes');





const MongoURI = process.env.MongoURI


//mongoose connect
mongoose.connect(MongoURI);
// mongoose.set('strictQuery', true);



//log
app.use(morgan('dev'));
//body parser
app.use(express.json());
app.use(express
    .urlencoded({ extended: true }));
// app.use(forms.any()); 




//access control--cors error handling
app.use((req, res, next) => {
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type , Accept , Authorization,cache-control,pragma,expires");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT , POST , PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});






//api routes
app.use('/api/user/',  apiRoutes);
app.use('/api/admin/',  adminApiRoutes);




//error for page not found
app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
});

//global error response--just throw error
app.use((error, req, res, next) => {

    const response = new ErrorResponse(error.message, error.status);
    response.sendResponse(res);
    

});




module.exports = app;