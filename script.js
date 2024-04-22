"use strict";

console.log("Hello World");

/* CONTROLLER */

let lastTimestamp = 0;

function start(){
    console.log("Game started");

    createTiles();
    displayTiles();

    requestAnimationFrame(tick);
}

function tick(timestamp){
    requestAnimationFrame(tick);

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    movePlayer(deltaTime);
    checkForItemCollisions();

    displayPlayerAtPosition();
    displayPlayerAnimation();
    displayItems();


    showDebugging();
}



document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowLeft':
            controls.left = true;
            break;
        case 'ArrowRight':
            controls.right = true;
            break;
        case 'ArrowUp':
            controls.up = true;
            break;
        case 'ArrowDown':
            controls.down = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'ArrowLeft':
            controls.left = false;
            break;
        case 'ArrowRight':
            controls.right = false;
            break;
        case 'ArrowUp':
            controls.up = false;
            break;
        case 'ArrowDown':
            controls.down = false;
            break;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    start(); // Start the game once the DOM is fully loaded
});


/* MODEL */

const player = {
    x: 0,
    y: 0,
    regX: 10,
    regY: 25,
    hitbox: {
        x:4,
        y:7,
        w: 12,
        h: 17
    },
    speed: 100,
    moving: false,
    direction: undefined
}

const enemySlime = {
    x: 0,
    y: 0,
    regX: 10,
    regY: 25,
    hitbox: {
        x:4,
        y:7,
        w: 12,
        h: 17
    },
    speed: 100,
    moving: false,
    direction: undefined
}

const enemySpider = {
    x: 0,
    y: 0,
    regX: 10,
    regY: 25,
    hitbox: {
        x:4,
        y:7,
        w: 12,
        h: 17
    },
    speed: 100,
    moving: false,
    direction: undefined

}


const tiles = [
    [1,1,1,1,11,0,0,0,0,0,2,2,2,2,2,0],
    [12,12,12,1,11,0,0,0,7,0,2,8,5,5,2,0],
    [0,0,11,1,11,0,0,6,0,0,2,5,5,5,2,0],
    [0,0,11,1,11,0,0,0,0,0,2,2,4,2,2,0],
    [0,0,11,1,11,0,7,0,0,0,0,0,1,0,0,0],
    [0,0,0,1,11,0,0,6,0,7,6,0,1,0,7,0],
    [0,0,0,1,11,7,0,0,0,0,0,0,1,0,0,0],
    [0,0,7,1,0,0,0,0,6,0,6,0,1,0,9,9],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,9,9,0],
    [9,9,9,9,9,9,9,9,9,13,9,9,9,9,6,0],
    [0,7,0,0,6,0,6,0,0,1,0,0,9,9,9,9],
    [0,14,6,0,0,0,0,0,0,1,0,12,12,12,12,12],
    [14,15,14,7,0,6,0,0,0,1,0,11,1,1,1,11],
    [14,15,14,14,14,0,0,0,0,1,1,1,1,10,1,11],
    [15,15,15,15,14,0,6,0,0,1,0,11,1,1,1,11],
    [14,14,14,15,14,0,0,0,0,1,0,12,12,12,12,12]
]

const items = [
    { id: 1, type: "chest_closed", x: 35, y: 150, collected: false },
    { id: 3, type: "gems", x: 410, y: 45, collected: false },
    { id: 4, type: "gold", x: 250, y: 350, collected: false },
    { id: 6, type: "pot", x: 224, y: 96, collected: false },
    { id: 7, type: "sign", x: 350, y: 110, collected: false },
];

const GRID_WIDTH = tiles.length;
const GRID_HEIGHT = tiles[0].length;
const TILE_SIZE = 32;

function getTileAtCoord({row,col}){
  
    return tiles[row][col];
}

function coordFromPos({x,y}){
    const row = Math.floor(y / TILE_SIZE);
    const col = Math.floor(x / TILE_SIZE);
    const coord = {row, col};
    return coord;
    
}

function posFromCoord({row, col}){
}

function getTilesUnderPlayer(player){
    const tiles = [];

    const topLeft = {x: player.x - player.regX + player.hitbox.x, y: 
        player.y - player.regY + player.hitbox.y};
    const topRight = {x: player.x - player.regX + player.hitbox.x + player.hitbox.w, 
        y : player.y - player.regY + player.hitbox.y};



}

const controls = {
    left: false,
    right: false,
    up: false,
    down: false
}

function movePlayer(deltaTime){
    player.moving = false;

    const newPos = {
        x: player.x,
        y: player.y
    }

    if (controls.left){
        player.moving = true;
        player.direction = "left";
        newPos.x -= player.speed * deltaTime;
    }
    if (controls.right){
        player.moving = true;
        player.direction = "right";
        newPos.x += player.speed * deltaTime;
    }
    if (controls.up){
        player.moving = true;
        player.direction = "up";
        newPos.y  -= player.speed * deltaTime;
    }
    if (controls.down){
        player.moving = true;
        player.direction = "down";
        newPos.y  += player.speed * deltaTime;
    }

    if(canMoveto(newPos)){
        player.x = newPos.x;
        player.y = newPos.y;
    }
}

function canMoveto(pos){
    const {row,col} = coordFromPos(pos);

    if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH)
    {
        return false;
    } 

    const tileType = getTileAtCoord({row,col});
    switch(tileType){
        case 0: // grass
        case 1: // path
        case 5: // floor_planks
        case 7: // flowers
        case 4: // door
        case 13: // redwall
        return true;
    }
}

function checkForItemCollisions() {
    const playerRect = {
        x: player.x - player.regX,
        y: player.y - player.regY,
        width: player.hitbox.w,
        height: player.hitbox.h
    };

    items.forEach(item => {
        if (!item.collected) {
            const itemRect = { x: item.x, y: item.y, width: 32, height: 32 }; // Assume each item is 32x32 pixels
            if (rectsOverlap(playerRect, itemRect)) {
                console.log(`Collision detected with item id: ${item.id}`); // Debugging log
                handleItemCollection(item);
            }
        }
    });
}

function rectsOverlap(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function handleItemCollection(item) {
    const itemElem = document.querySelector(`[data-item-id="${item.id}"]`);

    if (item.type === "chest_closed") {
        // If the item is a chest, open it
        item.type = "chest_open"; // Change the type to 'chest_open'
        if (itemElem) {
            itemElem.classList.remove("chest_closed");
            itemElem.classList.add("chest_open");
            itemElem.style.backgroundImage = "url('images/simple-assets/images/items/chest_open.png')";
        }
    } else if (item.type === "gems" || item.type === "gold") {
        // If the player steps on gems or gold, they disappear
        item.collected = true; // Mark the item as collected
        if (itemElem) {
            // First make the item invisible
            itemElem.style.opacity = '0';
            // Then, after a short delay to allow CSS transition, remove the item element
            setTimeout(() => {
                itemElem.remove();
                console.log(`Item with id ${item.id} removed`); // Debugging log
            }, 500); // The item will be removed after 0.5 seconds
        } else {
            console.error(`No element found with item ID ${item.id}`);
        }
    } else if (item.type === "pot") {
        // If the player goes to a pot, it gets smashed
        item.type = "pot_smashed"; // Change the type to 'pot_smashed'
        if (itemElem) {
            itemElem.classList.remove("pot");
            itemElem.classList.add("pot_smashed");
            itemElem.style.backgroundImage = "url('images/simple-assets/images/items/pot_smashed.png')";
        }
    }
}





/* VIEW */

function createTiles(){
    const background = document.querySelector("#background");
    // Scan igemmen alle rows & cols
    for (let row = 0; row < GRID_HEIGHT; row++){
        for (let col = 0; col < GRID_WIDTH; col++){
            // - for hver af dem: lav en div.item og tilføj til background.
            const tile = document.createElement("div");
            tile.classList.add("tile");
            background.appendChild(tile);
        }
    
    }
    background.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
    background.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
    background.style.setProperty("--TILE_SIZE", TILE_SIZE+"px");
}

function displayTiles(){
    const visualTiles = document.querySelectorAll("#background .tile");


    for(let row = 0; row < GRID_HEIGHT; row++){
        for(let col = 0; col < GRID_WIDTH; col++){
            const tileType = tiles[row][col]; // Correctly access the tile type from the tiles array
            const visualTile = visualTiles[row*GRID_WIDTH+col]; // Access the corresponding visual tile

    
            visualTile.classList.add(getClassForTiletype(tileType)); // Add the appropriate class to the visual tile
        }
    }
}


function getClassForTiletype(tileType){
    switch(tileType){
        case 0: return "grass";
        case 1: return "path"; 
        case 2: return "wall"; 
        case 3: return "key";
        case 4: return "door";
        case 5: return "floor_planks";
        case 6: return "tree";
        case 7: return "flowers";
        case 8: return "mine";
        case 9: return "water";
        case 10: return "well";
        case 11: return "fence_vert"
        case 12: return "fence_hori"
        case 13: return "redwall"
        case 14: return "cliff"
        case 15: return "lava"
    }
}


function displayPlayerAtPosition(){
    const visualPlayer = document.querySelector("#player");
    // Correct the property names from player.reqX to player.regX and player.reqY to player.regY
    visualPlayer.style.transform = `translate(${player.x - player.regX}px, ${player.y - player.regY}px)`;
}
function displayPlayerAnimation(){
    const visualPlayer = document.querySelector("#player");

    if (player.moving){
        visualPlayer.classList.add("animate");
        visualPlayer.classList.remove("up", "down", "left", "right");
        visualPlayer.classList.add(player.direction);
    } else {
        visualPlayer.classList.remove("animate");
    }
}

function displayItems() {
    const itemContainer = document.getElementById("items");
    items.forEach(item => {
        if (!item.collected) {
            const itemElem = document.createElement("div");
            itemElem.className = `item ${item.type}`;
            itemElem.style.backgroundImage = `url('images/simple-assets/images/items/${item.type}.png')`;
            itemElem.style.transform = `translate(${item.x}px, ${item.y}px)`;
            itemElem.dataset.itemId = item.id; // Make sure this is set
            itemContainer.appendChild(itemElem);
        }
    });
}


//#region DEBUGGING

let lastPlayerCoord = {row: 0,col: 0};

function showDebugging(){
    showDebugTileUnderPlayer();
    showDebugPlayerRect();
    showDebugPlayerRegistrationPoint();

}

function showDebugTileUnderPlayer(){
    const coord = coordFromPos(player);
    

    if(coord.row != lastPlayerCoord.row || coord.col != lastPlayerCoord.col){
        unhighlightTile(lastPlayerCoord);
        highlightTile(coord);
    }   
    lastPlayerCoord = coord;
}

function showDebugPlayerRect(){
    const visualPlayer = document.querySelector("#player");
    if(!visualPlayer.classList.contains("show-rect")){
        visualPlayer.classList.add("show-rect");
    }
}

function showDebugPlayerRegistrationPoint(){
    const visualPlayer = document.querySelector("#player");
    if(!visualPlayer.classList.contains("show-reg-point")){
        visualPlayer.classList.add("show-reg-point");
    }

    visualPlayer.style.setProperty("--regX", player.regX + "px");
    visualPlayer.style.setProperty("--regY", player.regY + "px");
}

function highlightTile({row,col}){
    const visualTiles = document.querySelectorAll("#background .tile");
    const visualTile = visualTiles[row * GRID_WIDTH + col];
    visualTile.classList.add("highlight");
}

function unhighlightTile({row,col}){
    const visualTiles = document.querySelectorAll("#background .tile");
    const visualTile = visualTiles[row * GRID_WIDTH + col];
    visualTile.classList.remove("highlight");
}