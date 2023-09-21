/**
This is a very simple version of a larger app/game i am creating
uses a large map that is drawn in sectors (createjs shapes)
I have not figured out the best way to cache, because if i cache all at once, its a lot of overhead.

My main issue is the zoom levels, the zoom simply adjusts the sectorsize.
The problem with this is that there seems to be a wierd performance problem at certain zoom levels.

To test this out, adjust the camera zoom property. I do not recommend anything more that 6.

*/

//Generic Settings
var Settings = {
    block_size: 50,
    rows: 30,
    cols: 30
}

//Create Camera
var Camera = {
    /*
    
    HERE IS THE ZOOM PROBLEM
      
      Chrome
      zoom : 1 = good fps
      zoom : 2 - 4 = bad fps
      zoom : 5 - 6 = good fps again ... wtf
    
      Safari
      Zoom: 7 = Good fps
     
  */
    x: 0,
    y: 0,
    zoom:1
}

//Create Short Alias
var Stage = createjs.Stage;
var Ticker = createjs.Ticker;
var Container = createjs.Container;
var Graphics = createjs.Graphics;
var Shape = createjs.Shape;


//Full Screen Canvas
var canvas = document.getElementById("mainCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Create Stage
var mainStage = new Stage(canvas);
mainStage.snameToPixelsEnabled = true;
mainStage.autoClear = true;

//Start Ticker
Ticker.addListener(this);
Ticker.useRAF = true;
Ticker.setFPS(30);

//Create Container;
var mainContainer = new Container();
mainContainer.snapToPixel = true;

//Add Container to Stage
mainStage.addChild(mainContainer);


//Create Lots of Shapes
var size = Settings.block_size * Camera.zoom;

//For the purpose of demonstration, I am only creating a square
//My actual app has much more complex drawings
var graphics = new Graphics();
graphics.setStrokeStyle(1 * Camera.zoom, "round");
graphics.beginFill(Graphics.getRGB(230,230,230,0.5));
graphics.beginStroke(null);
graphics.rect(-10, -10, size+10, size+10);
graphics.beginStroke('#000000');
graphics.moveTo(0,0);
graphics.lineTo(size,size);
graphics.moveTo(size,0);
graphics.lineTo(0,size);


var cols = Settings.cols;
var rows = Settings.rows;
for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
        
        var shape = new Shape(graphics);
        shape.x = x * size;
        shape.y = y * size;
        
        //Cache the shape, (the offset is to prevent the cache from chopping off complex shapes)
        var cache_offset = 10 * Camera.zoom;
        shape.cache(-cache_offset,-cache_offset, size + cache_offset, size + cache_offset);
        
        //Add shape to container
        mainContainer.addChild(shape);
    }
}

//Make map draggable
var lastX,lastY;

mainStage.onMouseDown = function(evt){
    lastX = evt.stageX;
    lastY = evt.stageY;
}

mainStage.onMouseMove = function(evt){
    if(lastX && lastY){
        var stageX = evt.stageX;
        var stageY = evt.stageY;
        var diffX = lastX - stageX;
        var diffY = lastY - stageY;
        lastX = stageX;
        lastY = stageY;
        Camera.x += diffX / Camera.zoom;
        Camera.y += diffY / Camera.zoom;
    }    
}

mainStage.onMouseUp = function(evt){
    lastX = null;
    lastY = null;
}

//Update the container position based on camera position and zoom
updatePosition = function () {

    var floor = Math.floor;

    var min_x = 0 + Camera.x * Camera.zoom - size;
    var min_y = 0 + Camera.y * Camera.zoom - size;
    var max_x = Screen.width + Camera.x * Camera.zoom + size
    var max_y = Screen.height + Camera.y * Camera.zoom + size;



    mainContainer.x = -Camera.x * Camera.zoom;
    mainContainer.y = -Camera.y * Camera.zoom;

    var shape_count = mainContainer.getNumChildren() - 1;

    for (var i = 0; i <= shape_count; i++) {
        var shape = mainContainer.getChildAt(i);

        if(shape.x < min_x || shape.x > max_x){
            shape.visible = false;
        }
        else if(shape.y < min_y || shape.y > max_y){
           shape.visible = false; 
        }
        else {
            shape.visible = true;
        }

    }

}


tick = function(){
    updatePosition();
    mainStage.update();
    var fps = document.getElementById('fps');
    fps.innerHTML = Ticker.getMeasuredFPS();
}







