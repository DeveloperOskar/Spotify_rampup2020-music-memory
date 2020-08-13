//modules
const express = require("express");
const session = require("express-session");
const { env } = require("process");
const path = require('path')
const app = express();
const expressEjsLayouts =  require('express-ejs-layouts');
const crypto = require("crypto");
const SpotifyWebApi = require("spotify-web-api-node");
require('dotenv').config();




//server config
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname+ '/views')
app.set('layout','layouts/layout');
app.use(expressEjsLayouts);


//express session
app.set("trust proxy", 1);
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    maxAge: 60000*5
  })
);


//routes
const indexRouter = require('./routes/index');
const gameRouter = require('./routes/game');
app.use('/',indexRouter);
app.use('/Game',gameRouter);


//Port
let listener = app.listen(process.env.PORT || 3000, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
