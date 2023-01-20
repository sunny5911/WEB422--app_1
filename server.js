/*************************** 
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.   
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including web sites) or distributed to other students. 
*  
*  Name: Sunny Student ID: 128365210 Date: 20-01-2023
****************************/
require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '/public')))
app.set('view engine', 'ejs');
const Routes = require('./routes');
app.use('/', Routes);
app.listen(port, () => {
    console.log(`server listening on: ${port}`);
});