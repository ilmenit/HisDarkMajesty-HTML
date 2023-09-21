'use strict';

//window.onorientationchange = handleResize;
//document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });

// Global variables
//var DEBUG = true;
var DEBUG = false;

//var TOUCH_CONTROL = true;
var TOUCH_CONTROL = false;

var MUTE_SOUND = true;
//var MUTE_SOUND=false;

var SHOW_FPS = true;
//var SHOW_FPS = false;

var DEBUG_MOVEMENT = false;


var view;
var game;

// disable console when not available

if(typeof console === "undefined"){ console = {}; }

/*
var console = function() {
}; 
console.log = function(param) {
//    alert(param);        
};
*/
DEBUG && console.log("STARTING CONSOLE");

/* Background */

var sidesSheet;
var unitsSheet;
var terrainSheet;
var buttonsSheet;
var yesnoSheet;
var iconsSheet;
var mapData;
var turnGfx;
var paperGfx;

var tileSizeX=64;
var tileSizeY=64;
var unitSizeX=64;
var unitSizeY=64;


function Main()
{
    DEBUG && console.log('============= main ===============');
    
    view = new View();
    game = new Game();
    view.init();
    
    createjs.Ticker.on("tick", handleTick);
    createjs.Ticker.setFPS(60);
    

    /* Background */
    preload = new createjs.LoadQueue(false);
    preload.installPlugin(createjs.Sound);     
    DEBUG && console.log("preload.loadManifest");
    
    if(!preload.addEventListener) {
        DEBUG && console.log("No addEventListener!");          
        alert("No addEventListener!");
    }
    else 
        preload.addEventListener("complete", preloadComplete);
    preload.loadManifest(manifest);
}

