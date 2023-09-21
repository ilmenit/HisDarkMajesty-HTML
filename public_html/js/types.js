// CONST VALUES
var UNIT_MOVE_POINTS=11;
var HP_MAX=99;
var MOVECOST_MAX = 999;

var LAYER = {
    MAP: 0,
    UNIT_SIDE: 1,
    UNITS: 2,
    TURN: 3
};

var SIDE = {
    PLAYER: 0,
    CPU: 1,
    COMPANION: 2
 };

// This describes the game states. Mouse/Touchpad behavior depends on it. 
var CONTEXT = {
    NONE: 0, // scroll the map, move cursor over map
    UNIT_SELECTED_FOR_MOVE: 1, 
    UNIT_SELECTED_FOR_ATTACK: 2, 
    UNIT_SELECTED_ATTACK_AFTER_MOVE: 3, 
    UNIT_SHOW_ATTACK_RANGE: 6,     
    SHOW_TURN_INFO: 50,
    NEXT_TURN_CLICKED: 51
};
  
var TERRAIN_DEFS = [
    { name: "Plains", def: 0 },
    { name: "Forest", def: 1 },
    { name: "Water", def: -2 },
    { name: "Mountains", def: 2 },
    { name: "Prison", def: 0 },
    { name: "Road", def: 0 },
    { name: "Pit", def: -3 },
    { name: "Cliff", def: -3 },
    { name: "Wall", def: 3 },
    { name: "Gate", def: 3 },
    { name: "House", def: 2 }  
];
