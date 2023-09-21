"use strict";

/*
* @class InfoBox
* @extends createjs.Container
* @constructor
**/

function InfoBox() {
    this.initialize();
    this.bounds = null;
    this.margin = 0;
}

(function() {
    var p = InfoBox.prototype = new createjs.Container();
    p.border = null;

    p.updateSize = function() {
        this.bounds = this.getBounds().clone();
        this.border.graphics.clear();
        this.border.graphics.beginFill("black").drawRect(this.bounds.x-3,this.bounds.y-3,this.bounds.width+6,this.bounds.height+6);        
        this.border.graphics.beginFill("#808080").drawRect(this.bounds.x-2,this.bounds.y-2,this.bounds.width+4,this.bounds.height+4);        
        this.border.shadow = new createjs.Shadow("#000000", 5, 5, 0);     
        this.x = view.canvas.width - this.bounds.width - 6 - this.margin;
        this.y = view.canvas.height - this.bounds.height - 6;
    };
        
// constructor:
    p.Container_initialize = p.initialize;
    p.initialize = function() {
        this.Container_initialize();
        this.snapToPixel = true;
        this.border = new createjs.Shape();
        this.addChild(this.border);                   
    };    
}());

