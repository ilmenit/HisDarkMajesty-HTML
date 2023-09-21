// To check properties : hasOwnProperty
"use strict";


function Unit(x, y, type, player, turn) {
    this.icon = null; // IconBox - a reference to icon for easier finding it on the map
    this.type = type; // index 
    this.player = player;
    this.x = x; // x,y on game.map
    this.y = y;
    this.hp = HP_MAX;
    this.defenseModifier = 0;
    this.total_strength = 0;
    this.evaluation = 0; // to speed up the AI. Changed after each damage done to this unit.
    this.moved = false;
    this.attacked = false;
    this.canAttack = false; // if can attack any unit
    if (turn > 0)
        this.reinforcement = turn; // 0 if on the map, else number of turn when appears
    else
        this.reinforcement = 0;
}

Unit.prototype.updateView = function() {
    this.icon.update();
};

Unit.prototype.calcNewHP = function(damage) {
    var newHP = this.hp - damage;
    if (newHP<0)
        newHP=0;
    else if (newHP>HP_MAX)
        newHP=HP_MAX;
    return newHP;
};

Unit.prototype.kill = function() {
    console.log("kill!");
    game.removeUnit(this);
};

Unit.prototype.damage = function(dmg) {
    this.hp = this.calcNewHP(dmg);
    if (this.hp===0)
        this.kill();
};

Unit.prototype.canBeAttacked = function() {
    if (game.map[this.y][this.x].inAttackRange)
    {
        if (game.selectedUnit.player.side !== this.player.side)
            return true;
    }
    return false;
};

Unit.prototype.turnStart = function() {

    this.defenseModifier=0;
    this.total_strength=0;
    this.evaluation=0;

    this.moved = false;
    this.attacked = false;

    // heal only units of your side
    if (this.player === game.currentPlayer) {
        game.healUnit(this);
    }    
};

Unit.prototype.attackOther = function(defender) {
    var dmg = game.calculateDamage(this, defender);
    defender.damage(dmg);
    --defender.defenseModifier;
    this.moved = true; // attacking ends turn for this unit  
    this.attacked = true;
    defender.attacked = true;
    defender.moved = true;
    view.unitAttacks(this,defender,this!==game.selectedUnit);
};