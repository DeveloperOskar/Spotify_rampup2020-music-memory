const router = require('express').Router();
const crypto = require("crypto");
const SpotifyWebApi = require("spotify-web-api-node");
const tracklists = require('../Models/Tracklists');


let popTracksList ;
let RockTrackList;
let hiphopTrackList;



//Game options route
router.get('/Main', async (req,res) =>{

  try{
    let loggedInSpotifyApi = new SpotifyWebApi();
    if(req.session.access_token !== req.query.state){               //checks auth
      loggedInSpotifyApi.setAccessToken(req.session.access_token);
      
      res.render("Game/GameOptions");
    }else{
             res.redirect('/error');
             
    }
    
  }catch(error){
    console.log(error);
    res.redirect('/');
  }
    
});

router.get('/Start', async (req, res) =>{       //The game route
  const genre = req.query.genre;
  const numOfPlayers = req.query.players;       //Query the request for data.
  const playerNames = req.query.player;

  let dataWithTracks;
  if(genre === '0' || numOfPlayers ==='0'){
    res.redirect("/Game/Main");
    //to do => send error msg with flash that no genre has been selected
  }else{
    try{
      let loggedInSpotifyApi = new SpotifyWebApi();
      if(req.session.access_token !== req.query.state){
        loggedInSpotifyApi.setAccessToken(req.session.access_token);      //checks auth

        switch(genre){
            case '1':
              RockTrackList = await tracklists.getRockTracklist();                                 //gets tracks from the tracklist model based on what genre the player has picked. And then get the tracks from spotify API
            dataWithTracks = await loggedInSpotifyApi.getTracks(RockTrackList,{market: 'SE'});      
            break;
            case '2':
              popTracksList = await tracklists.getPopTracklist();
             dataWithTracks = await loggedInSpotifyApi.getTracks(popTracksList,{market: 'SE'});
              break;
                case '3':
                 hiphopTrackList  = await tracklists.getHipHopTracklist();
                  dataWithTracks = await loggedInSpotifyApi.getTracks(hiphopTrackList,{market: 'SE'});
                  break;
        }
        if(dataWithTracks == null || dataWithTracks ==='' || dataWithTracks ==='undefined'){
          console.log(error);
          res.redirect('/');
        }else{
          let shuffledArrayWithTracks = shuffleArray(dataWithTracks.body.tracks);                                        //shuffles the Array with tracks so each game is random. 
          res.render("Game/StartGame",{tracks: shuffledArrayWithTracks, Players: numOfPlayers, PlayerNames: playerNames}); //renders the game layout with the data and EJS to get the data. 
        }
   
      }else{
            res.redirect('/error');
      }
    
  }catch(error){
    console.log(error);
    res.redirect('/');
  }
    

  }
  
});


function shuffleArray(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}


module.exports = router;