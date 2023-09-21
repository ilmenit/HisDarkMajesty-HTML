"use strict";

function View() {
    /* Define Canvas */
    this.canvas = null; // default html5 canvas
    this.stage = null;  // createjs stuff
    // visible on stage
    this.darkCover = null;
    this.mapContainer = null; // the container that contains objects visible on map
    this.highlightContainer = null;
    this.pathContainer = null;
    this.cursorImage = null; // cursor    
    this.turnImage = null;
    this.paper = null;
    this.unitInfo = null; // InfoBox
    this.terrainInfo = null; // InfoBox
    this.yesButton = null;
    this.noButton = null;
    this.camera = null; // helping structure for view on the map
    this.highlightMap = null; // 2d array of friendly and enemy range highlights
    this.turnInfo = null;
    this.handlingResize = false;
    this.multitouch = {
        count: 0
    };

    // init camera
    this.camera = {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
        maxX: 0,
        maxY: 0,
        // time objects for measuring time difference
        timeDown: null,
        timeUp: null,
        downX: 0,
        downY: 0
    };
}
;

View.prototype.setTerrainInfoBox = function(a_x, a_y) {
    var terrainType = game.map[a_y][a_x].terrain;
    this.terrainInfo.terrainNameText.text = TERRAIN_DEFS[ terrainType ].name;
    var def = TERRAIN_DEFS[ terrainType ].def.toString();
    this.terrainInfo.defenseText.text = "Def: " + (def >= 0 ? "+" + def : def);
    this.terrainInfo.terrainBitmap.gotoAndStop(terrainType);
    this.terrainInfo.updateSize();
    this.unitInfo.margin = this.terrainInfo.bounds.width + 9;
    this.unitInfo.updateSize();
};

View.prototype.setUnitInfoBox = function(a_x, a_y) {
    var unit = game.map[a_y][a_x].unit;
    if (unit === null)
        this.unitInfo.visible = false;
    else {
        var unitType = unit.type;
        this.unitInfo.unitNameText.text = UNIT_DEFS[ unitType ].name;
        this.unitInfo.unitBitmap.gotoAndStop(unitType);
        var att = UNIT_DEFS[ unitType ].attack;
        this.unitInfo.attackText.text = "ATT: " + att;
        var def = UNIT_DEFS[ unitType ].defense;
        this.unitInfo.defenseText.text = "DEF: " + def;
        if (unit.defenseModifier !== 0) {
            this.unitInfo.defenseText.text += (unit.defenseModifier >= 0 ? "+" : "") + unit.defenseModifier.toString();
        }
        var rMin = UNIT_DEFS[ unitType ].rMin;
        var rMax = UNIT_DEFS[ unitType ].rMax;
        this.unitInfo.rangeText.text = "RNG: " + rMin + "-" + rMax;
        this.unitInfo.hpText.text = "HP: " + unit.hp;
        if (game.selectedUnit !== null && game.selectedUnit !== unit) {
            this.unitInfo.hpText.text += "\u21E2";
            var damage = game.calculateDamage(game.selectedUnit, unit);
            var newHP = unit.calcNewHP(damage);
            this.unitInfo.hpText.text += Math.round(newHP).toString();
        }


        this.unitInfo.visible = true;
        this.unitInfo.updateSize();
    }
};

View.prototype.setCursorPosition = function(a_x, a_y) {
    a_x = a_x - (a_x % tileSizeX);
    a_y = a_y - (a_y % tileSizeY);
    this.cursorImage.x = a_x;
    this.cursorImage.y = a_y;
    a_x /= tileSizeX;
    a_y /= tileSizeY;
    game.cursor.set(a_x, a_y);
    this.setTerrainInfoBox(a_x, a_y);
    this.setUnitInfoBox(a_x, a_y);
    this.mapContainer.moveToTop(this.cursorImage);
};

View.prototype.showLoadingScreen = function() {
    DEBUG && console.log("view.showLoadingScreen()");
    var txt = new createjs.Text("Loading...", "36px Arial", "#000");
    txt.x = 0;
    txt.y = 0;
    this.stage.addChild(txt);
};

/*
 * Helper function to more some object to be top most in the container
 */

createjs.Container.prototype.moveToTop = function(mc) {
    this.setChildIndex(mc, this.getNumChildren() - 1);
};

View.prototype.init = function() {
    DEBUG && console.log("view.init()");
    /* Link Canvases */
    DEBUG && console.log("view.init()0");
    this.canvas = document.getElementById('gameCanvas');
    DEBUG && console.log("view.init()1");
    this.stage = new createjs.Stage(this.canvas);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    DEBUG && console.log("view.init()2");

    this.showLoadingScreen();

    if (TOUCH_CONTROL)
    {
        if (createjs.Touch.isSupported())
        {
            createjs.Touch.enable(this.stage);
            TOUCH_CONTROL = true;
        }
    }

    DEBUG && console.log("View.init() done");
};


View.prototype.preloadComplete = function() {
    DEBUG && console.log("view.preloadComplete()");
    game.start();
};


View.prototype.enableMouseOver = function() {
    DEBUG && console.log("enableMouseOver()");
    if (!TOUCH_CONTROL) {
        this.canvas.addEventListener("mousemove", handleMove, false);
    }
};

View.prototype.disableMouseOver = function() {
    DEBUG && console.log("disableMouseOver()");
    if (!TOUCH_CONTROL) {
        this.canvas.removeEventListener("mousemove", handleMove, false);
    }
};

var handleResize = function() {
    DEBUG && console.log("handleResize()");

    if (view.handlingResize)
        return;

    view.handlingResize = true;
//    createjs.Ticker.removeAllEventListeners();

    var mapSizeX = mapData.width * tileSizeX;
    var mapSizeY = mapData.height * tileSizeY;

    // There is no point to making canvas bigger than the map
    view.canvas.width = (window.innerWidth > mapSizeX) ? mapSizeX : window.innerWidth;
    view.canvas.height = (window.innerHeight > mapSizeY) ? mapSizeY : window.innerHeight;

    // Set maximum camera position
    view.camera.maxX = mapSizeX - view.canvas.width;
    view.camera.maxY = mapSizeY - view.canvas.height;

    if (view.camera.maxX <= 0)
        view.camera.maxX = 0;
    if (view.camera.maxY <= 0)
        view.camera.maxY = 0;

    view.terrainInfo.updateSize();
    view.unitInfo.updateSize();

    // place turn button
    view.turnImage.x = 0;
    view.turnImage.y = view.canvas.height - view.turnImage.getBounds().height;
    // place confirmation buttons
    view.yesButton.x = (80 - 64) / 2;
    view.yesButton.y = view.canvas.height - 80 - 64;
    view.noButton.x = 80;
    view.noButton.y = view.canvas.height - 64 - (80 - 64) / 2;

    // update
    view.updatePosition();
    view.stage.update();
    view.handlingResize = false;
};


View.prototype.updatePosition = function() {
    if (this.camera.x < 0)
        this.camera.x = 0;
    else if (this.camera.x > this.camera.maxX)
        this.camera.x = this.camera.maxX;

    if (this.camera.y < 0)
        this.camera.y = 0;
    else if (this.camera.y > this.camera.maxY)
        this.camera.y = this.camera.maxY;

    this.mapContainer.x = -this.camera.x;
    this.mapContainer.y = -this.camera.y;

    // hide out of map cells and show on map cells
    var min_x = this.camera.x - tileSizeX;
    var min_y = this.camera.y - tileSizeY;
    var max_x = window.innerWidth + this.camera.x + tileSizeX;
    var max_y = window.innerHeight + this.camera.y + tileSizeY;

    var shape_count = this.mapContainer.getNumChildren() - 1;

    for (var i = 0; i <= shape_count; ++i) {
        var shape = this.mapContainer.getChildAt(i);
        if (shape !== this.highlightContainer)
        {
            if (shape.x < min_x || shape.x > max_x) {
                shape.visible = false;
            }
            else if (shape.y < min_y || shape.y > max_y) {
                shape.visible = false;
            }
            else {
                shape.visible = true;
            }
        }
    }
};

function handleMouseDownMap(event) {
    DEBUG && console.log("Mouse down");
    view.multitouch.count++;
    if (view.multitouch.count === 1)
    {
        view.disableMouseOver();
        view.camera.lastX = event.stageX;
        view.camera.lastY = event.stageY;

        view.camera.downX = event.rawX;
        view.camera.downY = event.rawY;
        view.camera.timeDown = new Date();
    }
}

function handleMouseUpMap(event) {
    DEBUG && console.log("Mouse up");
//    if (view.multitouch.count>1)
//        handleresize();        
    view.multitouch.count--;
    if (view.multitouch.count === 0)
    {
        view.camera.timeUp = new Date();
        if ((view.camera.timeUp - view.camera.timeDown) < 200) // if short click, then it's not scrolling
        {
            if (Math.abs(view.camera.downX - event.rawX) < tileSizeX && Math.abs(view.camera.downY - event.rawY) < tileSizeY)
            {
                view.setCursorPosition(event.stageX + view.camera.x, event.stageY + view.camera.y);
                if (!view.guiContextHit(event))
                    game.contextHit();
            }
        }
        view.enableMouseOver();
    }
    DEBUG && console.log("Mouse up end");
}


function handleOverMap(event) {
    DEBUG && console.log("handleOverMap");
    if (game.contextAction === CONTEXT.SHOW_TURN_INFO)
        return;
    view.setCursorPosition(event.clientX + view.camera.x, event.clientY + view.camera.y);
    if (game.selectedUnit !== null && game.contextAction === CONTEXT.UNIT_SELECTED_FOR_MOVE)
    {
        if (game.map[game.cursor.y][game.cursor.x].inMoveRange)
            view.displayMovePathToCursor();
    }
}

function handleMoveMap(event) {
    DEBUG && console.log("Move Map");
    if (view.multitouch.count === 1)
    {
        if (view.camera.lastX && view.camera.lastY) {
            var stageX = event.stageX;
            var stageY = event.stageY;
            var diffX = view.camera.lastX - stageX;
            var diffY = view.camera.lastY - stageY;
            view.camera.lastX = stageX;
            view.camera.lastY = stageY;
            view.camera.x += diffX;
            view.camera.y += diffY;
        }
        view.updatePosition();
    }
    DEBUG && console.log("Move Map end");
}

View.prototype.addMapTile = function(x, y, type) {
    // create a new Bitmap for each cell
    var cellBitmap = new createjs.Sprite(terrainSheet);
    cellBitmap.gotoAndStop(type);
    cellBitmap.x = x * tileSizeX;
    cellBitmap.y = y * tileSizeY;
    // add bitmap to stage
    this.mapContainer.addChild(cellBitmap);

    // add highlight
    var highlight = new createjs.Shape();
    highlight.x = x * tileSizeX;
    highlight.y = y * tileSizeY;
    highlight.visible = false;
    this.highlightMap[y][x] = highlight;
    this.highlightContainer.addChild(highlight);
};

View.prototype.addUnit = function(unit) {
    unit.icon = new UnitView(unit);
    // add icon to map     
    this.mapContainer.addChild(unit.icon);
};

View.prototype.removeUnit = function(unit) {
    var disappearUnit = function(unit) {
        // remove icon from map     
        view.mapContainer.removeChild(unit.icon);
        unit.icon = null;
    };
    createjs.Tween.get(unit.icon)
            .wait(600).to({alpha: 0}, 500).call(disappearUnit, [unit]);
};

View.prototype.createCursor = function() {
    this.cursorImage = new createjs.Shape();
    this.cursorImage.graphics.f("#ffFF00").dr(0, 0, tileSizeX, tileSizeY);
    this.cursorImage.alpha = 0.8;
    this.cursorImage.visible = false;
    this.cursorImage.cache(0, 0, tileSizeX, tileSizeY);
    this.mapContainer.addChild(this.cursorImage);
};

View.prototype.setGuiLayer = function() {
    DEBUG && console.log("Setting GUI layer");
    // Add unit informaion
    this.unitInfo.visible = false;

    this.unitInfo.unitNameText = new createjs.Text("Footman", "bold 20px Arial", "white");
    this.unitInfo.addChild(this.unitInfo.unitNameText);

    this.unitInfo.attackText = new createjs.Text("ATT: 4", "Italic bold 20px Arial", "white");
    this.unitInfo.attackText.x = tileSizeX + 4;
    this.unitInfo.attackText.y = 24;
    this.unitInfo.addChild(this.unitInfo.attackText);

    this.unitInfo.defenseText = new createjs.Text("DEF: 1", "Italic bold 20px Arial", "white");
    this.unitInfo.defenseText.x = tileSizeX + 4;
    this.unitInfo.defenseText.y = 44;
    this.unitInfo.addChild(this.unitInfo.defenseText);

    this.unitInfo.rangeText = new createjs.Text("RANGE: 1-1", "Italic bold 20px Arial", "white");
    this.unitInfo.rangeText.x = tileSizeX + 4;
    this.unitInfo.rangeText.y = 64;
    this.unitInfo.addChild(this.unitInfo.rangeText);

    this.unitInfo.hpText = new createjs.Text("HP: 99", "Italic bold 20px Arial", "white");
    this.unitInfo.hpText.y = 24 + tileSizeY + 4;
    this.unitInfo.addChild(this.unitInfo.hpText);

    this.unitInfo.unitBitmap = new createjs.Sprite(unitsSheet);
    this.unitInfo.unitBitmap.gotoAndStop(0);
    this.unitInfo.unitBitmap.y = 24;
    this.unitInfo.addChild(this.unitInfo.unitBitmap);

    // Add terrain informaion

    this.terrainInfo.terrainNameText = new createjs.Text("Plains", "bold 20px Arial", "white");
    this.terrainInfo.addChild(this.terrainInfo.terrainNameText);

    this.terrainInfo.terrainBitmap = new createjs.Sprite(terrainSheet);
    this.terrainInfo.terrainBitmap.gotoAndStop(0);
    this.terrainInfo.terrainBitmap.y = 24;
    this.terrainInfo.addChild(this.terrainInfo.terrainBitmap);

    this.terrainInfo.defenseText = new createjs.Text("Def: +1", "Italic bold 20px Arial", "white");
    this.terrainInfo.defenseText.y = 24 + 64 + 4;
    this.terrainInfo.addChild(this.terrainInfo.defenseText);

    this.terrainInfo.updateSize();
    this.unitInfo.margin = this.terrainInfo.bounds.width + 9;
    this.unitInfo.updateSize();

    // turn icon
    this.turnImage = new createjs.Bitmap(turnGfx);
    this.turnImage.alpha = 0.8;
    this.turnImage.visible = false;
    this.stage.addChild(this.turnImage);

    // confirmation buttons
    this.yesButton = new createjs.Sprite(yesnoSheet);
    this.yesButton.gotoAndStop(1);
    this.yesButton.visible = false;
    this.stage.addChild(this.yesButton);
    this.noButton = new createjs.Sprite(yesnoSheet);
    this.noButton.gotoAndStop(0);
    this.noButton.visible = false;
    this.stage.addChild(this.noButton);
    
    // init dark cover
    this.darkCover = new createjs.Shape();
//    this.darkCover.visible = false;
    this.darkCover.graphics.f("#000000").dr(0, 0, this.canvas.width, this.canvas.height);
    this.darkCover.alpha = 0;
    this.darkCover.cache(0, 0, this.canvas.width, this.canvas.height);    
    this.stage.addChild(this.darkCover);    

    // paper
    this.paper = new PaperView();
    this.paper.visible = false;
    this.stage.addChild(this.paper);

    DEBUG && console.log("Setting GUI layer done");
};

View.prototype.setMapLayer = function() {
    DEBUG && console.log("Setting map layer");
    this.highlightMap = new Array(game.map.height);
    for (var y = 0; y < game.map.height; ++y) {
        this.highlightMap[y] = new Array(game.map.width);
        for (var x = 0; x < game.map.width; ++x) {
            view.addMapTile(x, y, game.map[y][x].terrain);
        }
    }
};

/*
 * This function requires initialized Game.units
 */
View.prototype.setUnitsLayer = function() {
    for (var i = 0; i < game.units.length; ++i) {
        this.addUnit(game.units[i]);
    }
};

View.prototype.highlightPosition = function(x, y) {
    var inMoveRange = game.map[y][x].inMoveRange;
    var inAttackRange = game.map[y][x].inAttackRange;
    var inSelectedUnit = false;
    if (game.selectedUnit !== null)
        inSelectedUnit = (x === game.selectedUnit.x && y === game.selectedUnit.y);

    if (!(inMoveRange || inAttackRange || inSelectedUnit))
        return;

    var highlight = this.highlightMap[y][x];
    if (game.map[y][x].unit) {
        game.map[y][x].unit.updateView();
        highlight.alpha = 0;
    }
    else
        highlight.alpha = 1;


    highlight.graphics.clear();
    if (game.contextAction === CONTEXT.UNIT_SHOW_ATTACK_RANGE) {
        if (inMoveRange && UNIT_DEFS [ game.selectedUnit.type].attackAfterMove === true)
            this.stripeShape(highlight, ("#30CC00"));
        else if (inAttackRange)
            this.stripeShape(highlight, ("#AA0000"));

    }
    else if (game.contextAction === CONTEXT.UNIT_SELECTED_FOR_MOVE) {
        if (inMoveRange)
            this.stripeShape(highlight, ("#30CC00"));
    }
    else if (game.contextAction === CONTEXT.UNIT_SELECTED_FOR_ATTACK) {
        if (inAttackRange)
            this.stripeShape(highlight, ("#AA0000"));
    }

    highlight.cache(0, 0, tileSizeX, tileSizeY);
    highlight.visible = true;
};

/*
 * We have everything loaded, so we can set graphics
 */

function handleMove(event) {
    handleOverMap(event);
}

View.prototype.setLevelLayers = function() {
    // init containers
    this.mapContainer = new createjs.Container();
    this.mapContainer.name = "mapContainer";
    this.mapContainer.snapToPixel = true;
    this.stage.addChild(this.mapContainer);

    this.highlightContainer = new createjs.Container();
    this.highlightContainer.snapToPixel = true;
    this.highlightContainer.name = "highlightContainer";
    this.mapContainer.addChild(this.highlightContainer);

    this.pathContainer = new createjs.Container();
    this.pathContainer.snapToPixel = true;
    this.pathContainer.name = "pathContainer";
    this.highlightContainer.addChild(this.pathContainer);

    // infobox
    this.unitInfo = new InfoBox();
    this.stage.addChild(this.unitInfo);

    this.terrainInfo = new InfoBox();
    this.stage.addChild(this.terrainInfo);

    this.setMapLayer();
    this.setUnitsLayer();
    this.setGuiLayer();
    this.createCursor();


    if (!this.stage.addEventListener)
        alert("No addEventListener!");
    else {
        this.stage.addEventListener("pressmove", handleMoveMap);
        this.stage.addEventListener("mousedown", handleMouseDownMap);
        this.stage.addEventListener("pressup", handleMouseUpMap);
    }

    handleResize();
    if (window.addEventListener)
        window.addEventListener("resize", handleResize);
    else
        window.attachEvent("onresize", handleResize);  // IE9   

    this.enableMouseOver();

    DEBUG && console.log("setLayers done");
};

View.prototype.stripeShape = function(shape, color) {
    shape.graphics.ss(3).s(color);
    for (var i = 8; i <= tileSizeX; i += 8)
    {
        shape.graphics.mt(i, 0).lt(0, i);
        shape.graphics.mt(tileSizeX - i, tileSizeY).lt(tileSizeX, tileSizeY - i);
    }

};

View.prototype.clearHighlight = function() {
    DEBUG && console.log("hideHighlight");
    for (var y = 0; y < game.map.height; ++y) {
        for (var x = 0; x < game.map.width; ++x) {
            this.highlightMap[y][x].visible = false;
            if (game.map[y][x].unit) {
                game.map[y][x].unit.updateView();
            }
        }
    }
    if (this.pathContainer.getNumChildren() > 0)
        this.pathContainer.removeAllChildren();
};

View.prototype.showHighlight = function() {
    DEBUG && console.log("showHighlight");
    for (var y = 0; y < game.map.height; ++y) {
        for (var x = 0; x < game.map.width; ++x) {
            this.highlightPosition(x, y);
            
            if (DEBUG_MOVEMENT) {
                var mpLeft = game.map[y][x].mpLeft;
                if (typeof mpLeft === "undefined")
                {
                    game.map[y][x].mpLeft = mpLeft = new createjs.Text(game.map[y][x].movePointsLeft.toString(), "24px Arial", "#FFF");
                    this.highlightContainer.addChild(mpLeft);
                }
                mpLeft.text = game.map[y][x].movePointsLeft.toString();
                mpLeft.x = x * tileSizeX;
                mpLeft.y = y * tileSizeY;                
            }
        }
    }
    this.mapContainer.moveToTop(this.highlightContainer);
};

View.prototype.playSound = function(toPlay) {
    if (!MUTE_SOUND)
        createjs.Sound.play(toPlay);
};

View.prototype.unitAttacks = function(attacker, defender, delay) {
    createjs.Tween.get(attacker.icon)
            .wait(delay ? 600 : 0).to({x: defender.x * tileSizeX, y: defender.y * tileSizeY}, 300)
            .to({x: attacker.x * tileSizeX, y: attacker.y * tileSizeY}, 300);
};


View.prototype.selectedUnitMoveTo = function(newX, newY) {
    this.playSound("snd_horsemove");

    this.mapContainer.moveToTop(game.selectedUnit.icon);

    var path = game.getMovePath(newX, newY);
    var tw = createjs.Tween.get(game.selectedUnit.icon);

    for (var i = 0; i < path.length; ++i) {
        var px = path[i].x * tileSizeX;
        var py = path[i].y * tileSizeY;
        tw.to({x: px, y: py}, 100);
    }
    game.selectedUnit.updateView();
};


View.prototype.displayMovePathToCursor = function() {
    DEBUG && console.log("displayMovePath");

    if (this.pathContainer.getNumChildren() > 0)
        this.pathContainer.removeAllChildren();

    var path = game.getMovePath(game.cursor.x, game.cursor.y);
    for (var i = 0; i < path.length; ++i)
    {
        if (game.map[path[i].y][path[i].x].unit === null)
        {
            var img = new createjs.Shape();
            img.graphics.f("#FFFF00").setStrokeStyle(5).dc(tileSizeX / 2, tileSizeY / 2, tileSizeX / (i + 3));
            img.x = path[i].x * tileSizeX;
            img.y = path[i].y * tileSizeY;
            img.cache(0, 0, tileSizeX, tileSizeY);
            this.pathContainer.addChild(img);
        }
    }
};

function handleTick(event) {
    if (SHOW_FPS) {
        var fps = document.getElementById('fps');
        fps.innerHTML = Math.round(createjs.Ticker.getMeasuredFPS());
    }
    if (!view.handlingResize)
        view.stage.update();
}

View.prototype.guiContextHit = function(event) {
    // check only one button for now
    var x = event.rawX;
    var y = event.rawY;
    var bounds = this.turnImage.getBounds().clone();
    if (x < bounds.width && y > this.turnImage.y && y < this.turnImage.y + bounds.height) {
        switch (game.contextAction) {
            case CONTEXT.NONE:
            case CONTEXT.UNIT_SELECTED_FOR_MOVE:
            case CONTEXT.UNIT_SELECTED_FOR_ATTACK:
            case CONTEXT.UNIT_SELECTED_ATTACK_AFTER_MOVE:
            case CONTEXT.UNIT_SHOW_ATTACK_RANGE:
                game.setContext(CONTEXT.NEXT_TURN_CLICKED);
                return true;
                break;
        }
    }
    ;
    return false;
};

View.prototype.showTurnInfo = function() {        
    this.darkCover.visible = true;
    this.turnImage.visible = false;
    this.paper.playerNameText.text = game.currentPlayer.name;
    this.paper.playerNameText.color = game.currentPlayer.color;
    this.paper.playerNameTextOutline.text = game.currentPlayer.name;

    this.paper.turnNumberText.text = "Turn\n" + game.turn.toString() + " of " + game.turnMax.toString();
    this.paper.turnNumberText.outline = 1;
    
    this.paper.x = view.canvas.width;
    this.paper.y = view.canvas.height / 2 - 150;
    this.paper.visible = true;
    var destX = view.canvas.width / 2 - 100;
    createjs.Tween.get(this.paper,{override:true})
            .wait(600).to({x: destX}, 1000, createjs.Ease.cubicOut);
    createjs.Tween.get(this.darkCover)
            .to({alpha: 0.5}, 500);
    this.cursorImage.visible = false;
    
};

View.prototype.hideTurnInfo = function() {
    var destX = -this.paper.getBounds().clone().width;
    createjs.Tween.get(this.paper, {override: true})
            .to({x: destX, visible: false}, 1000, createjs.Ease.cubicIn);
    this.turnImage.visible = true;
    this.cursorImage.visible = true;
    createjs.Tween.get(this.darkCover)
            .to({alpha: 0}, 500);
};