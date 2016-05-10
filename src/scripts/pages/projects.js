var Projects = [
  {
    stub: "~Cindent0~" + "~ccomment~// Awesome, I get to show you some of the cool things that I've made!" + "~l0~"
        + "~Cindent0~" + "~l0~"
        + "~Cindent0~" + "~ccomment~// " + "~ctitle~" + "PROJECT: CARD GAME" + "~l0~"
        + "~Cindent0~" + "~ccomment~// This is a webapp version of my favorite card game, Egyptian Ratscrew. The UI was built in React and all communication is handled via socket.io, supporting up to 4 players in a room and an unlimited number of rooms." + "~l0~"
         + "~Cindent0~" + "~ccomment~// And don't worry if you don't have anyone to play with, because you can easily add AI players from the Settings widget." + "~l0~"
        + "~Cindent0~" + "~l0~"
        
    , writing:  "~Cindent0~" + "function~Cfunc~" + " getCardGame~CfuncName~" + "() {" + "~l0~"
   + "~p350~" + "~Cindent1~"
                  + "var~Cfunc~" + " gameURL " + "~ck~= " + "~q+~eRatscrew.HerokuApp.com~ahttp://eratscrew.herokuapp.com~" + "~q-~" + "~c0~;" + "~l0~"
              + "~Cindent0~" + "}"
  }
  , {
    stub: "~Cindent0~" + "~l0~"
        + "~Cindent0~" + "~ccomment~// " + "~ctitle~" + "PROJECT: DATA VIZ" + "~l0~"
        + "~Cindent0~" + "~ccomment~// This is another webapp built with React and D3 displaying beer award winners for the past two decades as well as how the award styles have changed over time." +"~l0~"
        + "~Cindent0~" + "~ccomment~// Data processing all done via regular expressions and Python.." +"~l0~"
        + "~Cindent0~" + "~l0~"
        
    , writing:  "~Cindent0~" + "function~Cfunc~" + " getBeerMap~CfuncName~" + "() {" + "~l0~"
   + "~p350~" + "~Cindent1~"
                  + "var~Cfunc~" + " visualizationURL " + "~ck~= " + "~q+~GoldPintMap.MatthewSchiller.com~ahttp://goldpintmap.matthewschiller.com~" + "~q-~" + "~c0~;" + "~l0~"
              + "~Cindent0~" + "}"
    , numStart: 9

   }
];

module.exports = Projects;