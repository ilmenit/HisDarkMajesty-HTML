var preload;
var manifest = [
    {src: 'gfx/terrain.png', id: 'terrainGfx'},
    {src: 'gfx/hdm-units.png', id: 'unitsGfx'},
    {src: 'gfx/unit-side.gif', id: 'sidesGfx'},
    {src: 'gfx/yesno.png', id: 'yesno'},
    {src: 'gfx/gui.png', id: 'gui'},
    {src: 'gfx/turn.png', id: 'turn'},
    {src: 'gfx/icons.png', id: 'icons'},
    {src: 'gfx/paper.png', id: 'paper'},
    {src: 'snd/horsemove.mp3', id: 'snd_horsemove'}
//    {src: 'map.json', id: 'map'},
];

function  preloadComplete()
{
    /* Loaded images */
    DEBUG && console.log("preloadComplete()");

    if (preload.getResult("snd_horsemove") === null)
        alert("No sound!");

    var terrainSrc = preload.getResult("terrainGfx");
    var unitsSrc = preload.getResult("unitsGfx");
    var sidesSrc = preload.getResult("sidesGfx");
    var yesnoSrc = preload.getResult("yesno");
    var iconsSrc = preload.getResult("icons");        
    var buttonsSrc = preload.getResult("gui");
    turnGfx = preload.getResult("turn");
    paperGfx = preload.getResult("paper");
    
    DEBUG && console.log("Getting map data");
//    mapData=preload.getResult("map");
    mapData = mapDataFromFile;
    DEBUG && console.log(mapData);

    DEBUG && console.log("Loading graphics");
    var map_tiles_data = {
        images: [terrainSrc],
        frames: {width: tileSizeX, height: tileSizeY}
    };
    DEBUG && console.log(map_tiles_data);
    terrainSheet = new createjs.SpriteSheet(map_tiles_data);
    DEBUG && console.log("Map frames: " + terrainSheet.getNumFrames());

    var units_tiles_data = {
        images: [unitsSrc],
        frames: {width: unitSizeX, height: unitSizeY}
    };
    DEBUG && console.log(units_tiles_data);
    unitsSheet = new createjs.SpriteSheet(units_tiles_data);
    DEBUG && console.log("Units frames: " + unitsSheet.getNumFrames());

    var sides_tiles_data = {
        images: [sidesSrc],
        frames: {width: unitSizeX, height: unitSizeY}
    };
    DEBUG && console.log(sides_tiles_data);
    sidesSheet = new createjs.SpriteSheet(sides_tiles_data);
    DEBUG && console.log("Sides frames: " + sidesSheet.getNumFrames());

    var gui_data = {
        images: [buttonsSrc],
        frames: {width: 72, height: 72}
    };
    buttonsSheet = new createjs.SpriteSheet(gui_data);
    DEBUG && console.log("Button frames: " + buttonsSheet.getNumFrames());

    var yesno_data = {
        images: [yesnoSrc],
        frames: {width: 64, height: 64}
    };
    yesnoSheet = new createjs.SpriteSheet(yesno_data);
    DEBUG && console.log("YesNo frames: " + yesnoSheet.getNumFrames());


    var icons_data = {
        images: [iconsSrc],
        frames: {width: 73, height: 71}
    };
    iconsSheet = new createjs.SpriteSheet(icons_data);
    DEBUG && console.log("Button frames: " + iconsSheet.getNumFrames());

    view.preloadComplete();
}

