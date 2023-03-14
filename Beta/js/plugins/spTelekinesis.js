// create an object to hold properties and functions related to telekinesis ability
var tks = {active:false, limit : 2, lifting : false, origin : {}, object : {}};

//Using Touch Input
tks.moveObject = function(){
    console.log('running move object')
    let destX = $gameMap.canvasToMapX(TouchInput._curX);
    let destY = $gameMap.canvasToMapY(TouchInput._curY);

    if(sMapDist(this.origin, {x:destX, y:destY}) <= this.limit){
        this.object._realX = destX;
        this.object._x = destX;
        this.object._realY = destY;
        this.object._y = destY;
    } 
}

tks.isMoveable = function(obj){
    let evId = obj._eventId;
    let note = $dataMap.events[evId].note;

    if(obj._tksMoved)
        return
    if(note.contains("<sp_tk>")){
        obj._tkMoved = true;
        return true;
    }

    return false;
}

function spCursorCollision(a){ // the argument 'a' is the sprite you're clicking on. 
    let b = {x : TouchInput._curX, y : TouchInput._curY};
    a = {x : a.scrolledX() * 48, y : a.scrolledY() * 48, width : 48, height : 48};

    if(b.x > a.x && b.x < a.x + a.width && b.y > a.y && b.y < a.y + a.height)
    return true;
    return false;
}

// Get the tile x and y of the mouse click, and return a list of events within that tile.
function spClickMapEvents(){
    let x = $gameMap.canvasToMapX(TouchInput._curX);
    let y = $gameMap.canvasToMapY(TouchInput._curY);
    let res = $gameMap.eventsXy(x, y);
    return res

}

//Shorter version of $gameMap.distance
function sMapDist(ent1, ent2){
    return $gameMap.distance(ent1.x, ent1.y, ent2.x, ent2.y);
}

//alias Scene Map update
let alias_tsk_SceneMap_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function(){
    //Call pre-alias Scene Map update
    alias_tsk_SceneMap_update.call(this); 
    let evs = [];
    //if the ability to use telekinesis is not currently active, break out of custom update
    if(!tks.active) return 

    //Change tks.lifting to false if Touch Input is released
    if(TouchInput.isReleased())
        tks.lifting = false;

    //If tks.lifting, run the moveObject function
    if(tks.lifting)
        tks.moveObject();

    //When TouchInput gets clicked down, get the map x and map y (tile coords) of current click. 
    //Check if there is an event on that tile, then check if that event is moveable 
    //If it isn't, exit the function. Otherwise, update the tks.origin property and store the moveable
    //event in tks.object
    if(TouchInput.isTriggered()){
        evs = spClickMapEvents();
        console.log(evs)
        if(evs.length > 0){
            if(!tks.isMoveable(evs[0])) return
            
            tks.origin = evs[0].moveOrigin;
            tks.object = evs[0];
            tks.lifting = true;
        }
    }
}

//alias TouchInput _onMouseMove event to record the cursor's current x and y, regarless of last click location
let sp_alias_TouchInput_onMouseMove = TouchInput._onMouseMove;
TouchInput._onMouseMove = function(event){
    sp_alias_TouchInput_onMouseMove.call(this, event);
    TouchInput._curX = Graphics.pageToCanvasX(event.pageX);
    TouchInput._curY = Graphics.pageToCanvasY(event.pageY);
}


//alias Scene Map start to get the original x and y of events, to prevent repeatedly picking
//an object up and moving it all over the map. Using the original x and y, you'll only be able
//to move it from it's original position.
let sp_alias_SceneMap_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function(){
    sp_alias_SceneMap_start.call(this);
    let evs = $gameMap.events();
    let i = {};
    for(i of evs){
        i.moveOrigin = {x: i.x, y: i.y};
    }

}