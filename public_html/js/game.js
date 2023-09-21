"use strict";

// This points to something on the map
function Position(a_x,a_y) {
    this.x = a_x;
    this.y = a_y;
    this.set = function(a_x, a_y) {
        this.x = a_x;
        this.y = a_y;
    };
}

function Player(name, side, color, colorMoved, cpu) {
    this.name = name;
    this.side = side;
    this.color = color;
    this.colorMoved = colorMoved;
    this.computerControlled = cpu;
}

function Game() {
    // current level     
    this.map = null; // 2d array of mapTile

    // units
    this.selectedUnit = null;
    this.units = null; // 1d array of Units


    // this points to something when clicked
    this.cursor = new Position();

    this.currentPlayer;
    this.players = null; // 1d array 
    this.turn = -1;
    this.turnMax = -1;

    this.contextAction;
    this.contextPosition = new Position();
}


Game.prototype.addUnit = function(x, y, type, side, turn) {
    var unit = new Unit(x, y, type, side, turn);
    this.units.push(unit);
    this.map[y][x].unit = unit;
};

Game.prototype.removeUnit = function(unit) {
    view.removeUnit(unit);
    var index = this.units.indexOf(unit);
    if (index > -1) {
        this.units.splice(index, 1);
    }
    this.map[unit.y][unit.x].unit = null;
};

Game.prototype.start = function() {
    // should we show the game map here?
    
    // set player
    this.players = new Array();
    this.players[SIDE.PLAYER] = new Player("Ilmenit", SIDE.PLAYER, "#004070", "#002035", false);
    this.players[SIDE.CPU] = new Player("Baron\nJulus", SIDE.CPU, "#801000", "#400500", true);
    this.players[SIDE.COMPANION] = new Player("Cpt.\nHatkin", SIDE.PLAYER, "#B6AE00", "#5B5700", false);

    this.currentPlayer = null;
    this.initLevel();
    this.nextTurn();
};

Game.prototype.distance = function(x1, y1, x2, y2) {
    return ((x2 > x1) ? ((y2 > y1) ? (x2 - x1 + y2 - y1) : (x2 - x1 + y1 - y2)) : (y2 > y1) ? (x1 - x2 + y2 - y1) : (x1 - x2 + y1 - y2));
};

// Initalize map according to level data
Game.prototype.initLevel = function() {
    DEBUG && console.log("initLevel");

    this.turn = 1;
    this.turnMax = 30;
    // allocate array for units
    this.units = new Array();

    // allocate map
    this.map = new Array(mapData.height);
    for (var i = 0; i < mapData.height; ++i)
        this.map[i] = new Array(mapData.width);

    // add function to check map size
    this.map.width = mapData.width;
    this.map.height = mapData.height;

    this.map.isInside = function(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return false;
        else
            return true;
    };

    // go through the map and init internal level structures
    for (var y = 0; y < this.map.height; ++y) {
        for (var x = 0; x < this.map.width; ++x) {
            var index = x + this.map.width * y;

            // set terrain
            var terrainType = mapData.layers[ LAYER.MAP ].data[index] - mapData.tilesets[ LAYER.MAP ].firstgid;
            this.map[y][x] = new mapTile();
            this.map[y][x].terrain = terrainType;

            // set unit
            var unitType = mapData.layers[ LAYER.UNITS ].data[index];
            if (unitType !== 0) {
                var side = mapData.layers[ LAYER.UNIT_SIDE ].data[index] - mapData.tilesets[ LAYER.UNIT_SIDE ].firstgid;
                var turn = mapData.layers[ LAYER.TURN ].data[index] - mapData.tilesets[ LAYER.TURN ].firstgid;
                this.addUnit(x, y, unitType - mapData.tilesets[ LAYER.UNITS ].firstgid, this.players[side], turn);
            }
            else
                this.map[y][x].unit = null;
        }
    }

    view.setLevelLayers();            
    DEBUG && console.log("Setting level done");
};

Game.prototype.zeroRangeMap = function() {
    for (var y = 0; y < this.map.height; ++y) {
        for (var x = 0; x < this.map.width; ++x) {
            this.map[y][x].inMoveRange = 0;
            this.map[y][x].inAttackRange = 0;
            this.map[y][x].movePointsLeft = -1;
        }
    }
};

Game.prototype.AIEvaluatePosition = function(x, y) {

};

Game.prototype.getMovePath = function(sx, sy) {
    // sx,sy - destination
    var path = new Array;
    var pathDX = [0, 0, 1, -1];
    var pathDY = [1, -1, 0, 0];

    while (game.map[sy][sx].movePointsLeft !== UNIT_MOVE_POINTS)
    {
        // add current path position to container
        var pos = new Position(sx,sy);
        path.unshift(pos);
        // from destination move to start 
        var best = game.map[sy][sx].movePointsLeft;

        var newSX;
        var newSY;
        for (var i = 0; i < 4; ++i)
        {
            var x = sx + pathDX[i];
            var y = sy + pathDY[i];
            if (game.map.isInside(x, y))
            {
                var current = game.map[y][x].movePointsLeft;
                if (current > best)
                {
                    best = current;
                    newSX = x;
                    newSY = y;
                }
            }
        }
        sx = newSX;
        sy = newSY;
    }
    return path;
};


Game.prototype.movementChangeCellValue = function(x, y, move_points) {
    var cost;
    var new_points = -1;

    if (!this.map.isInside(x, y))
        return new_points;

    var unitThere = this.map[y][x].unit;

    // Only enemy units block movement
    if (unitThere === null || (unitThere.player.side === this.selectedUnit.player.side))
        cost = UNIT_DEFS [ this.selectedUnit.type ].moveCost[ this.map[y][x].terrain ];
    else
        cost = MOVECOST_MAX;


    new_points = move_points - cost;
    if (new_points >= 0) {
        if (new_points > this.map[y][x].movePointsLeft) {

            // hacky way to prefer road without unit
            if (this.map[y][x].unit===null)
                new_points += 0.001;
                
            this.map[y][x].movePointsLeft = new_points;

            // Show possible moves or attack from this cell
            if (!(y === this.selectedUnit.y && x === this.selectedUnit.x)) {
                this.map[y][x].inMoveRange = true; // for the currently selected unit

                if (this.selectedUnit.player !== this.currentPlayer) {
                    if (UNIT_DEFS[this.selectedUnit.type].attackAfterMove)
                        this.selectedUnitPreprocessAttack(x, y);
                }
            }
//!            if (game.ai_turn)
//!                this.AIEvaluatePosition(x,y);
        }
    }
    return new_points;
};

Game.prototype.movementCastRay = function(x, y, dx, dy, mx, my, move_points) {
    do {
        x += dx;
        y += dy;
        move_points = this.movementChangeCellValue(x, y, move_points);
        if (move_points > 0)
        {
            this.movementCastRay(x, y, dx, dy, mx, my, move_points);
            this.movementCastRay(x, y, mx, my, dx, dy, move_points);
        }
    } while (move_points > 0);
};

/*
 * We do not use perfect pathfinding. If an unit moves superfast then we don't want it to turn super fast
 * Therefore walking around enemies is not possible in C shape. Only L shape moves are available.
 * Similar to Shadowcasting algorithm.
 */
Game.prototype.selectedUnitPreprocessMovement = function() {
    var x = this.selectedUnit.x;
    var y = this.selectedUnit.y;
    this.map[y][x].movePointsLeft = UNIT_MOVE_POINTS; // needed for backtracing move path
    // up
    this.movementCastRay(x, y, 0, -1, 1, 0, UNIT_MOVE_POINTS);
    this.movementCastRay(x, y, 0, -1, -1, 0, UNIT_MOVE_POINTS);
    // down
    this.movementCastRay(x, y, 0, 1, 1, 0, UNIT_MOVE_POINTS);
    this.movementCastRay(x, y, 0, 1, -1, 0, UNIT_MOVE_POINTS);
    // left
    this.movementCastRay(x, y, -1, 0, 0, -1, UNIT_MOVE_POINTS);
    this.movementCastRay(x, y, -1, 0, 0, 1, UNIT_MOVE_POINTS);
    // right
    this.movementCastRay(x, y, 1, 0, 0, -1, UNIT_MOVE_POINTS);
    this.movementCastRay(x, y, 1, 0, 0, 1, UNIT_MOVE_POINTS);
};


Game.prototype.setAttackRange = function(x, y, dx, dy, distance) {
    for (var i = 0; i < distance; ++i, x += dx, y += dy) {
        if (this.map.isInside(x, y))
        {
            this.map[y][x].inAttackRange = true;
            var u = this.map[y][x].unit;
            if (u !== null && u.canBeAttacked())
                this.selectedUnit.canAttack = true;
        }
    }
};


Game.prototype.selectedUnitPreprocessAttack = function(x, y) {
    var rMin = UNIT_DEFS [ this.selectedUnit.type ].rMin;
    var rMax = UNIT_DEFS [ this.selectedUnit.type ].rMax;
    this.selectedUnit.canAttack = false;

    for (var i = rMin; i <= rMax; ++i)
    {
        this.setAttackRange(x, y + i, 1, -1, i);
        this.setAttackRange(x + i, y, -1, -1, i);
        this.setAttackRange(x, y - i, -1, 1, i);
        this.setAttackRange(x - i, y, 1, 1, i);
    }
};

Game.prototype.selectedUnitMoveTo = function(newX, newY) {
    // play move sound
    if (this.selectedUnit === null)
        return;
    if (this.map[newY][newX].unit !== null)
        return;

    if (this.map[newY][newX].inMoveRange === false)
        return;

    this.map[newY][newX].unit = this.selectedUnit;
    this.selectedUnit.moved = true;
    if (UNIT_DEFS [ this.selectedUnit.type].attackAfterMove === false)
        this.selectedUnit.attacked = true;
    this.map[this.selectedUnit.y][this.selectedUnit.x].unit = null;
    this.selectedUnit.x = newX;
    this.selectedUnit.y = newY;
    view.selectedUnitMoveTo(newX, newY);
};

Game.prototype.chooseUnit = function(unit) {
    console.log("chooseUnit");
    this.selectedUnit = unit;
    if (unit !== null) {
        this.selectedUnitPreprocessMovement();
        this.selectedUnitPreprocessAttack(this.selectedUnit.x, this.selectedUnit.y);
    }
};

Game.prototype.healUnit = function(unit) {
    if (unit === null)
        return;
};

Game.prototype.nextTurn = function() {
    this.chooseNextPlayer();
    
    for (var i = 0; i < this.units.length; ++i)
    {
        this.units[i].turnStart();
    }
    this.setContext(CONTEXT.SHOW_TURN_INFO);
};

Game.prototype.chooseNextPlayer = function() {
    var i = this.players.indexOf(this.currentPlayer);
    if (i > -1) {
        if (i === this.players.length-1) {
            i = 0;
            ++this.turn;            
        }
        else
            ++i;
    }
    else
        i = 0;
    this.currentPlayer=this.players[i];
};

Game.prototype.setContext = function(context) {
    this.contextAction = context;
    switch (context) {
        case CONTEXT.SHOW_TURN_INFO:
            console.log("setContext show turn info");
            view.showTurnInfo();
            break;
        case CONTEXT.UNIT_SELECTED_ATTACK_AFTER_MOVE:
            console.log("setContext selected attack after move");
            this.zeroRangeMap();
            view.clearHighlight();
            this.selectedUnitPreprocessAttack(this.selectedUnit.x, this.selectedUnit.y);
            if (!this.selectedUnit.canAttack)
                this.setContext(CONTEXT.NONE);
            break;
        case CONTEXT.UNIT_SELECTED_FOR_ATTACK:
            console.log("setContext selected for attack");
            this.zeroRangeMap();
            view.clearHighlight();
            this.selectedUnitPreprocessAttack(this.selectedUnit.x, this.selectedUnit.y);
            break;

        case CONTEXT.UNIT_SHOW_ATTACK_RANGE:
            console.log("setContext showing attack range");
            break;

        case CONTEXT.UNIT_SELECTED_FOR_MOVE:
            console.log("setContext selected for move");
            break;
        case CONTEXT.CONFIRM_MOVE:
            console.log("setContext confirm move");
            this.contextPosition.x = x;
            this.contextPosition.y = y;
            break;
        case CONTEXT.NEXT_TURN_CLICKED:
            console.log("setContext next turn");
            this.nextTurn();
//            this.setContext(CONTEXT.SHOW_TURN_INFO);
            break;

        case CONTEXT.NONE:
            console.log("setContext none");
            this.zeroRangeMap();
            view.clearHighlight();
            this.selectedUnit = null;
            break;

        default:
            alert("Unknown context: " + context);
    }
    view.showHighlight();
};

// This function uses Cursor position
Game.prototype.contextHit = function() {
    DEBUG && console.log("game.contextSelection");
    var x = this.cursor.x;
    var y = this.cursor.y;
    var cursorUnit = this.map[y][x].unit;
    console.log(this.contextAction);

    do {
        var process_again = false;
        switch (this.contextAction) {
            case CONTEXT.NONE:
                console.log("context none");
                if (cursorUnit !== null) {
                    // if unit is under cursor, then select it
                    this.chooseUnit(cursorUnit);
                    if (cursorUnit.player === this.currentPlayer)
                    {
                        if (cursorUnit.moved === false)
                            this.setContext(CONTEXT.UNIT_SELECTED_FOR_MOVE);
                        else if (!cursorUnit.attacked) {
                            this.setContext(CONTEXT.UNIT_SELECTED_FOR_ATTACK);
                        }
                        else {
                            this.setContext(CONTEXT.NONE);
                        }
                    }
                    else {
                        this.setContext(CONTEXT.UNIT_SHOW_ATTACK_RANGE);
                    }
                }
                break;
            case CONTEXT.UNIT_SHOW_ATTACK_RANGE:
                console.log("context show attack range");
                this.setContext(CONTEXT.NONE);
                process_again = true;
                break;
            case CONTEXT.UNIT_SELECTED_ATTACK_AFTER_MOVE:
            case CONTEXT.UNIT_SELECTED_FOR_ATTACK:
                console.log("context selected for attack");
                if (cursorUnit !== null && cursorUnit.canBeAttacked()) {
                    this.performAttack(cursorUnit);
                    this.setContext(CONTEXT.NONE);
                }
                else {
                    this.setContext(CONTEXT.NONE);
                    process_again = true;
                }
                break;

            case CONTEXT.UNIT_SELECTED_FOR_MOVE:
                console.log("context selected for move");
                if (cursorUnit !== null) { // if unit in the cursor position
                    // 
                    // if in attack range and enemy, then perform attack
                    if (cursorUnit.canBeAttacked()) {
                        this.performAttack(cursorUnit);
                        this.setContext(CONTEXT.NONE);
                    }
                    else if (cursorUnit === this.selectedUnit && !this.selectedUnit.attacked) { // if double click on unit, switch to attack
                        this.setContext(CONTEXT.UNIT_SELECTED_FOR_ATTACK);
                    }
                    else // some other unit is selected, process it as without context
                    {
                        this.setContext(CONTEXT.NONE);
                        process_again = true;
                    }
                }
                else { // this can be move if in range
                    if (this.map[y][x].inMoveRange) {
                        this.selectedUnitMoveTo(x, y);
                        if (!this.selectedUnit.attacked)
                            this.setContext(CONTEXT.UNIT_SELECTED_ATTACK_AFTER_MOVE);
                        else
                            this.setContext(CONTEXT.NONE);
                    }
                    else
                        this.setContext(CONTEXT.NONE);
                }
                break;
            case CONTEXT.CONFIRM_MOVE:
                console.log("context confirm move");

                if (x === this.contextPosition.x && y === this.contextPosition.y)
                    this.contextMove(x, y);
                else if (this.map[y][x].inMoveRange)
                {
                    this.setContext(CONTEXT.UNIT_SELECTED_FOR_MOVE);
                }
                else
                    this.setContext(CONTEXT.NONE);

                break;
            case CONTEXT.CONFIRM_ATTACK:
                console.log("context confirm attack");
                break;
            case CONTEXT.SHOW_TURN_INFO:
                view.hideTurnInfo();
                this.setContext(CONTEXT.NONE);
                break;
        }
        console.log(this.contextAction);
    } while (process_again);
};

Game.prototype.calculateDamage = function(attacker, defender)
{
    var damage;
    var defense;
    damage = UNIT_DEFS[attacker.type].attack / 9 * (attacker.hp / HP_MAX);

    defense = UNIT_DEFS[defender.type].defense;
    defense += TERRAIN_DEFS[ game.map[defender.y][defender.x].terrain ].def;
    defense += defender.defenseModifier;
    defense /= 9;

    damage *= HP_MAX;
    defense *= HP_MAX;

    damage = Math.round(damage);
    defense = Math.round(defense);

    if (defense > HP_MAX)
        defense = HP_MAX;

    damage -= defense;
    return damage;
};

Game.prototype.performAttack = function(defender) {
    console.log("attack!");

    this.selectedUnit.attackOther(defender);

    // check if attack back
    if (defender !== null && defender.hp > 0) {
        var dist = this.distance(this.selectedUnit.x, this.selectedUnit.y, defender.x, defender.y);
        if (dist >= UNIT_DEFS[defender.type].rMin && dist <= UNIT_DEFS[defender.type].rMax)
            defender.attackOther(this.selectedUnit);
    }

    view.setUnitInfoBox(this.cursor.x, this.cursor.y); // refresh infobox
};