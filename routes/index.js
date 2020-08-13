const router = require('express').Router();
const session = require("express-session");
const crypto = require("crypto");
const SpotifyWebApi = require("spotify-web-api-node");



router.get('/', (req,res) =>{     //index
res.render('index')
})


const redirectUri =
  "https://" + process.env.PROJECT_DOMAIN + ".glitch.me/callback";
const scopes = [];
const showDialog = true;

let spotifyApi = new SpotifyWebApi({        
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: redirectUri
});

router.get("/authorize", (req, res) => {                      
  let state = crypto.randomBytes(12).toString("hex");                       //the auth check
  req.session.state = state;
  let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state, showDialog);
  res.redirect(authorizeURL);
});

router.get("/callback", (req, res) =>{
  if (req.session.state !== req.query.state) {
    res.sendStatus(401);
    res.render('error');
  }
  let authorizationCode = req.query.code;
  spotifyApi.authorizationCodeGrant(authorizationCode).then(
    data => {
      req.session.access_token = data.body["access_token"];
      res.redirect("/Game/Main");
    },
    error => {
      console.log(
        "Something went wrong when retrieving the access token!",
        error.message
      );
    }
  );
});



router.get("/logout", (req, res) =>{
  req.session.destroy();
  res.redirect("/");
});



//This route gets called whenever there is an Session error, Just provides the user with some basic info and a re-login option. 
router.get('/error', (req,res) =>{
  res.render('error');
})




module.exports = router;