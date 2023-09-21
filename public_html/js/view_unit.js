"use strict";

/*
 * @class UnitView
 * @extends createjs.Container
 * @constructor
 **/

function UnitView(unit) {
    this.initialize(unit);
}

(function() {
    var p = UnitView.prototype = new createjs.Container();

    p.update = function() {
        this.updateSideColor();
        this.updateAttackState();
        this.updateHP();
        this.updateStagePosition();
    };
    
    p.updateSideColor = function() {
        var color;
        if (this.unit.moved)
            color = this.unit.player.colorMoved;
        else
            color = this.unit.player.color;            
        this.sideColor.graphics.clear();
        this.sideColor.graphics.f(color).dr(0, 0, tileSizeX, tileSizeY);        
        if (game.map[this.unit.y][this.unit.x].inMoveRange) {
            if (game.contextAction === CONTEXT.UNIT_SELECTED_FOR_MOVE)
                view.stripeShape(this.sideColor, "#30CC00");
        }
        else if (this.unit.canBeAttacked())
            view.stripeShape(this.sideColor, "#FF3000");
        this.sideColor.cache(0, 0, tileSizeX, tileSizeY);
    };
    
    p.updateAttackState = function() {
        if (this.unit.attacked)
            this.removeAttackable();
        else {
            this.markAttackable();
        }            
    };
    
    p.updateStagePosition = function() {
        this.x = this.unit.x*tileSizeX, 
        this.y = this.unit.y*tileSizeY;
    };
    
    p.updateHP = function() {
        var hp = this.unit.hp;
        this.healthBar.graphics.clear();
        this.healthBar.graphics.f("#000000").dr(0, 0, tileSizeX, 4);
        this.healthBar.graphics.f("#ff0000").dr(1, 1, hp * ((tileSizeX - 2) / HP_MAX), 2);
        this.hpText.text = Math.round(hp).toString();
        if (this.unit.canBeAttacked())
        {
            this.hpText.text += "\u21E2";
            var damage = game.calculateDamage(game.selectedUnit, this.unit);
            var newHP = this.unit.calcNewHP(damage);
            this.hpText.text += Math.round(newHP).toString();
        }
        var sx = this.hpText.getMeasuredWidth();
        var sy = this.hpText.getMeasuredHeight();
        this.hpText.x = tileSizeX - sx - 2;
        this.hpText.y = tileSizeY - sy;                     
    };

    p.markAttackable = function() {
        createjs.Tween.get(this.unitBitmap, {loop: true})
                .to({x: tileSizeX * 0.05, scaleX: 0.90}, 300)
                .to({x: 0, scaleX: 1}, 300);
    };

    p.removeAttackable = function() {
        createjs.Tween.removeTweens(this.unitBitmap);
    };              

// constructor:
    p.Container_initialize = p.initialize;
    p.initialize = function(unit) {
        this.Container_initialize();
        this.snapToPixel = true;
        this.unit = unit;

        this.unitBitmap = new createjs.Sprite(unitsSheet);
        this.unitBitmap.gotoAndStop(unit.type);

// create unit side background       
        this.sideColor = new createjs.Shape();

// create health bar
        this.healthBar = new createjs.Shape();

// add hpText
        this.hpText = new createjs.Text("99", "bold 15px Arial, 'Arial', sans-serif", "#FFFFFF");

// Add all objects to icon

        this.addChild(this.sideColor);
        this.addChild(this.unitBitmap);
        this.addChild(this.healthBar);
        this.addChild(this.hpText);
        this.update();
    };
}());



