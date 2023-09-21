"use strict";

/*
 * @class PaperView
 * @extends createjs.Container
 * @constructor
 **/

function PaperView() {
    this.initialize();
}

(function() {
    var p = PaperView.prototype = new createjs.Container();

// constructor:
    p.Container_initialize = p.initialize;
    p.initialize = function() {
        this.Container_initialize();

        this.playerNameText = new createjs.Text("Player", "bold 30px Arial, 'Arial', sans-serif", "#000000");
        this.playerNameText.x = 133;
        this.playerNameText.y = 60;
        this.playerNameText.textAlign = "center";
        this.playerNameTextOutline = this.playerNameText.clone();
        this.playerNameTextOutline.outline=1;
        this.playerNameTextOutline.color=("#000");
        this.playerNameText.shadow = new createjs.Shadow("#000000", 0, 0, 20);
        

        this.paperBitmap = new createjs.Bitmap(paperGfx);  
        this.turnNumberText = new createjs.Text("turn\n1 of 30", "30px Arial, 'Arial', sans-serif", "#000000");
        this.turnNumberText.x = 133;
        this.turnNumberText.y = 130;
        this.turnNumberText.textAlign="center";  
        this.turnNumberText.shadow = new createjs.Shadow("#000000", 0, 0, 20);

// Add all objects 

        this.addChild(this.paperBitmap);
        this.addChild(this.playerNameText);
        this.addChild(this.playerNameTextOutline);
        this.addChild(this.turnNumberText);
    };
}());



