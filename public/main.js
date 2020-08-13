window.addEventListener('load',() =>{

let currentUrl = location.protocol + '//' + location.host + location.pathname ;

  

//switching functions based on the current page
switch(currentUrl){
  case 'https://spotify-music-memory.glitch.me/':                  //start page

    document.querySelector('#enterDoor').addEventListener('click',() =>{
     window.location.href = "/authorize";
    });

    break

    case 'https://spotify-music-memory.glitch.me/Game/Main':                        //Game options page

    let currentOption;
    const startGameButton = document.querySelector('#start-game-btn');
    const inputs = document.querySelector('#gameoptions-input-wrapper').children;

    $('#start-form').submit(function () {                                                 //checking the form with the diffrent players
      let player1 = inputs[0].value
      let player2 = inputs[1].value
      let player3 = inputs[2].value
      let player4 = inputs[3].value

      switch (currentOption) {
        case '1':
            if(player1 ==='' || player2 ===''){
              alert('Please enter all player names')
              return false;
            }
          break;
          case '2':
            if(player1 ==='' || player2 ==='' || player3 ===''){
              alert('Please enter all player names')
              return false;
            }
          
            break;
             case '3':
              if(player1 ==='' || player2 ==='' || player3 ==='' || player4===''){
                alert('Please enter all player names')
                return false;
              }
              break;
        
      }
     
  });

      document.querySelector('#players').addEventListener('change', () =>{                    //Showing diffrent inputs of player names based on how many players is selected. 
        currentOption =  document.querySelector('#players').value;
        inputs[0].disabled =true;
        inputs[1].disabled =true;
        inputs[2].disabled =true;
        inputs[3].disabled =true;
        
                hideInputs = () =>{
          inputs[0].classList.add('d-none');
          inputs[1].classList.add('d-none');
          inputs[2].classList.add('d-none');
          inputs[3].classList.add('d-none');
        }

        hideInputs();
        switch (currentOption) {          
          case '0':
            hideInputs();
            startGameButton.hidden = true;
            break;
              case '1': 
              startGameButton.hidden = false;
              inputs[0].classList.remove('d-none');
              inputs[1].classList.remove('d-none');

              inputs[0].disabled =false;
              inputs[1].disabled =false;
              break
                case '2': 
                startGameButton.hidden = false;
                inputs[0].classList.remove('d-none');
                inputs[1].classList.remove('d-none');
                inputs[2].classList.remove('d-none');
                
                inputs[0].disabled =false;
                inputs[1].disabled =false;
                inputs[2].disabled =false;
                break
                  case '3': 
                  startGameButton.hidden = false;

                  inputs[0].classList.remove('d-none');
                  inputs[1].classList.remove('d-none');
                  inputs[2].classList.remove('d-none');
                  inputs[3].classList.remove('d-none');

                  inputs[0].disabled =false;
                  inputs[1].disabled =false;
                  inputs[2].disabled =false;
                  inputs[3].disabled =false;
                  break
        }

      });
      
    break

    case 'https://spotify-music-memory.glitch.me/Game/Start':   //The mian game

      let isPlaying = false;
      let numberOfClicks =0;
      const musicPlayer = document.querySelector('#audio-player');
      let CurrentCardPlaying ;
      let CurrentArtistSelected;
      const cards = document.querySelectorAll('.one-card');
      let musicUrl='';
      const players = document.querySelectorAll('.player');
      const NumberOfPlayers= players.length; 
      let currentPlayersTurn = 0;
      let NumberOfSongs = cards.length;
      let TrackList = [];
 
      switchPlayersTurn();


      cards.forEach(card => {                    //Onclick on evry card with tracks. The basic logic is that we have a algoritm based on the playes clicks. Evry 3rd click is ether going to be the right answer or the player has faild to found a pair.
        card.addEventListener('click',() =>{
          if(numberOfClicks ===2 && card.isSameNode(CurrentCardPlaying)){

          }else{
          numberOfClicks++;

          switch (numberOfClicks) {
            case 1:
            PlayCard(card,false);
            CurrentArtistSelected = card.getAttribute("data-artist-name");
             
              break;
              case 2:
                musicPlayer.pause();
                isPlaying =false
                changeSpeakerSvg(CurrentCardPlaying);

                break;
                case 3:
                    if(CurrentArtistSelected === card.getAttribute("data-artist-name")){
                      NumberOfSongs -= 2;
                      DisplayCorrectAnswer(card);
                      PlayCard(card,true);
                      GivePlayerPont(currentPlayersTurn);
                      
                      
                  


                    }else{
                      PlayCard(card,false);
                    }
                
                     
                  break;
                  case 4:
                    musicPlayer.pause();
                    isPlaying =false
                    RemoveAnimatedCards();
                    numberOfClicks=0;
                    switchPlayersTurn();
                    changeSpeakerSvg(CurrentCardPlaying);
                    break;
                  }
                }

        });
      });

      musicPlayer.addEventListener("ended", () =>{  //if musicplayer ends
          musicPlayer.currentTime = 0;
          isPlaying = false;
         
          if( CurrentCardPlaying.children[1].children[0].children[1].style.display !=='flex'){  //fixing a bug where the speaker appears if the players found a pair and the music player finishes.
            changeSpeakerSvg(CurrentCardPlaying);
          }
      });

      function EndGame(){
        document.querySelector('#game-end-overlay-container').style.display = 'flex';
        const playersWrapper = document.querySelector('#game-end-players-score-wrapper');

        const PlayersArray = Array.from(players);                                     //The method that displays the players based on their score
        PlayersArray.sort((a, b) => {
          return b.innerHTML - a.innerHTML;
        });

      


        PlayersArray.forEach(player => {
          player.classList.remove('green-text');
          const p = document.createElement('p');
          p.innerHTML = player.parentElement.innerHTML;
          playersWrapper.appendChild(p);
        });

        
        document.querySelector('#end-game-tracklist-link').addEventListener('click',(e) =>{         //Displaying the tracks after the game. 
          e.preventDefault();
          document.querySelector('#game-end-overlay-container').style.display = 'none';
          document.querySelector('#correct-overlay-container').style.display = 'none';
          document.querySelector('#game-nav').style.display = 'none';
          document.querySelector('main').style.display = 'none';
          document.querySelector('#game-stats-section').style.display = 'none';



          document.querySelector('#game-end-overlay-trackList').style.display = 'block';

          TrackList.forEach(track => {
            CreateLayoutForTracklist(track);
          });


        });

      }
      

      function GivePlayerPont(){                              
        let CurrentplayerPoints;
        switch (currentPlayersTurn) {
          case 1:
            CurrentplayerPoints = players[0].innerHTML;
            CurrentplayerPoints++;
            players[0].innerHTML = CurrentplayerPoints;

            break;
        
          case 2:
            CurrentplayerPoints = players[1].innerHTML;
            CurrentplayerPoints++;
            players[1].innerHTML = CurrentplayerPoints;

              break;
              

            case 3:
              CurrentplayerPoints = players[2].innerHTML;
              CurrentplayerPoints++;
              players[2].innerHTML = CurrentplayerPoints;

              break;

              case 4:
                CurrentplayerPoints = players[3].innerHTML;
                CurrentplayerPoints++;
                players[3].innerHTML = CurrentplayerPoints;

                break;
        }
   
      }


      function DisplayCorrectAnswer(CardNbTwo){
        CardNbTwo.style.pointerEvents = "none";
        CurrentCardPlaying.style.pointerEvents = "none";

        CurrentCardPlaying.children[1].children[0].children[2].style.display='none'
        CardNbTwo.children[1].children[0].children[2].style.display='none'

        CurrentCardPlaying.children[1].children[0].children[0].style.display='none'
        CardNbTwo.children[1].children[0].children[0].style.display='none'


    

        CurrentCardPlaying.children[1].children[0].children[1].style.display='flex'
        CardNbTwo.children[1].children[0].children[1].style.display='flex'



        let newArtstAndTracks = {
          artistName : CurrentCardPlaying.getAttribute("data-artist-name"),
          
          Track1Name: CurrentCardPlaying.getAttribute('data-song-name'),
          Track1ImgUri : CurrentCardPlaying.getAttribute('data-song-img'),
          Track1Uri:  CurrentCardPlaying.getAttribute('data-track-uri'),
         
          Track2Name: CardNbTwo.getAttribute('data-song-name'),
          Track2ImgUri : CardNbTwo.getAttribute('data-song-img'),
          Track2Uri:   CardNbTwo.getAttribute('data-track-uri'),

        }
        TrackList.push(newArtstAndTracks);


        document.querySelector('#correct-answer-header').innerHTML = CurrentCardPlaying.getAttribute("data-artist-name");


        document.querySelector('#track-one-uri').href =CurrentCardPlaying.getAttribute('data-track-uri');
        document.querySelector('#track-one-name').innerHTML = CurrentCardPlaying.getAttribute('data-song-name');
        document.querySelector('#track-one-img').src = CurrentCardPlaying.getAttribute('data-song-img');

        document.querySelector('#track-two-uri').href = CardNbTwo.getAttribute('data-track-uri');
        document.querySelector('#track-two-img').src = CardNbTwo.getAttribute('data-song-img');
        document.querySelector('#track-two-name').innerHTML = CardNbTwo.getAttribute('data-song-name');

        document.querySelector('#correct-overlay-container').style.display='flex'

          document.querySelector('#correct-overlay-container').addEventListener('dblclick',() =>{
          document.querySelector('#correct-overlay-container').style.display='none'
          numberOfClicks=0;

            RemoveAnimatedCards();
            musicPlayer.pause();
            if(NumberOfSongs ==0){            //In order to know when all the cars have been turned, we are decrement "NumberOfSongs" until it reaches 0. 
              NumberOfSongs--;
              EndGame();
            }
          
        })
      }


      function PlayCard(card, correctAnswer){
        playTrack = () =>{
          musicUrl = card.getAttribute("data-music-url");
          musicPlayer.setAttribute('src', musicUrl);
          musicPlayer.load();
          musicPlayer.play();
          isPlaying =true;
          CurrentCardPlaying = card;
        }
        if(correctAnswer){
          playTrack();

        }else{
        playTrack();
        AnimateCards(card)
        changeSpeakerSvg(card);
        }

      }

      function AnimateCards(cardTOAnimate){
          let cardheader = cardTOAnimate.firstElementChild;
          let cardbody = cardTOAnimate.lastElementChild;
          cardheader.classList.add('card-selected');
          cardbody.classList.add('card-selected');
          cardbody.classList.add('user-picked-card-bg');
          
          ChangeSvgColor(cardbody,true);
          
      }

      function ChangeSvgColor(cardbody,color){      //Changing the color of the Svg speaker. 
        if(color){
          cardbody.lastElementChild.lastElementChild.children[0].firstElementChild.firstElementChild.style.fill="white";
          cardbody.lastElementChild.lastElementChild.children[1].firstElementChild.firstElementChild.style.fill="white";
        }else{
          cardbody.lastElementChild.lastElementChild.children[0].firstElementChild.firstElementChild.style.fill="black";
          cardbody.lastElementChild.lastElementChild.children[1].firstElementChild.firstElementChild.style.fill="black";
        }

      }

       function RemoveAnimatedCards(){
        let selectedCards = document.querySelectorAll('.card-selected');
        
        selectedCards.forEach(element => {
          element.classList.remove('card-selected')
          element.classList.remove('user-picked-card-bg');
          if(element.lastElementChild !== null){
            ChangeSvgColor(element,false)
          }
        

        });
      }
          
      function switchPlayersTurn(){
        currentPlayersTurn++;
        let parent;

        players.forEach(player => {
          player.classList.remove('green-text');
          let parentText = player.parentElement;
          parentText.classList.remove('green-text');
        });
        if(NumberOfPlayers < currentPlayersTurn){
          currentPlayersTurn=1;
          players[0].classList.add('green-text');
          parent = players[0].parentElement;
          parent.classList.add('green-text')
        }else{
        switch (currentPlayersTurn) {
          
          case 1:
            players[0].classList.add('green-text');
             parent = players[0].parentElement;
            parent.classList.add('green-text')
            break;

            case 2:
              players[1].classList.add('green-text');
               parent = players[1].parentElement;
              parent.classList.add('green-text')
            break;

            case 3:
              players[2].classList.add('green-text');
               parent = players[2].parentElement;
              parent.classList.add('green-text')
            break;

     
            case 4:
              players[3].classList.add('green-text');
               parent = players[3].parentElement;
              parent.classList.add('green-text')
            break;
        }        
      }

      }

      function changeSpeakerSvg(parentElement){         //changing the svg speaker from playing => not playing  E.G
        const children = parentElement.children;
        const lowerChild = children[1];
        const lowestChild = lowerChild.firstElementChild
        const speakerOn = lowestChild.firstElementChild;
        const speakerOff =lowestChild.lastElementChild;
      
        if(isPlaying){
          speakerOn.style.display='block';
          speakerOff.style.display ='none'
      
        }else{
          speakerOn.style.display='none';
          speakerOff.style.display ='block'
      
        }
       
      }

      function CreateLayoutForTracklist(track){

        //wrappaer that holds all tracks of all artists
          const wrapper = document.querySelector('#track-list-wrapper');

          //the artist in name
          let artistNameheader = document.createElement('h2');
          artistNameheader.innerHTML = track.artistName;
          artistNameheader.classList.add('col-12');
          artistNameheader.classList.add('py-0');
          artistNameheader.classList.add('my-1');
          artistNameheader.classList.add('mt-2');

   

          //wrapper that holds the two tracks of 1 artists
          let divWrapper = document.createElement('div');
          divWrapper.classList.add('col-12');
          divWrapper.classList.add('col-lg-6');
          divWrapper.classList.add('tracklist-one-artist-tracks-wrapper');
          divWrapper.classList.add('mb-2');
          divWrapper.classList.add('py-4');

        //wrappers for each track


          let track1wrapper = document.createElement('div');
          track1wrapper.classList.add('text-center');
          track1wrapper.classList.add('d-flex');

          track1wrapper.style.width ='100%';
          track1wrapper.classList.add('flex-column');
          track1wrapper.classList.add('align-items-center');

          let track1Paragraph = document.createElement('p');
          track1Paragraph.innerHTML = track.Track1Name;
          track1Paragraph.classList.add('my-0');
          track1Paragraph.classList.add('px-4');
 

          track1Paragraph.classList.add('py-2');

          let track1Img = document.createElement('img');
          track1Img.classList.add('tracklist-thumbnail');
          track1Img.classList.add('my-3');
          track1Img.src = track.Track1ImgUri;

          let track1Link = document.createElement('a');
          track1Link.innerHTML ='Open in Spotify';
          track1Link.href =track.Track1Uri;

          track1wrapper.appendChild(track1Paragraph);
          track1wrapper.appendChild(track1Img);
          track1wrapper.appendChild(track1Link);


          let track2wrapper = document.createElement('div');
          track2wrapper.classList.add('text-center');

          track2wrapper.style.width ='100%';
          track2wrapper.classList.add('d-flex');
          track2wrapper.classList.add('flex-column');
          track2wrapper.classList.add('align-items-center');

          let track2Paragraph = document.createElement('p');
          track2Paragraph.innerHTML = track.Track2Name;

          track2Paragraph.classList.add('my-0');
          track2Paragraph.style.maxWidth ='100%';
          track2Paragraph.classList.add('px-4');
          track2Paragraph.classList.add('py-2');

          let track2Img = document.createElement('img');
          track2Img.classList.add('tracklist-thumbnail');
          track2Img.classList.add('my-3');
          track2Img.src = track.Track2ImgUri;

          let track2Link = document.createElement('a');
          track2Link.innerHTML ='Open in Spotify';
          track2Link.href =track.Track2Uri;

          track2wrapper.appendChild(track2Paragraph);
          track2wrapper.appendChild(track2Img);
          track2wrapper.appendChild(track2Link);

          divWrapper.appendChild(track1wrapper);
          divWrapper.appendChild(track2wrapper);


        //appending all children 
          wrapper.appendChild(artistNameheader);
          wrapper.appendChild(divWrapper);

      }

   break
}
});