// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdy4kwFCOhFTp0D8VGkCDO5JXQmgvRWzs",
    authDomain: "suvaline-6de03.firebaseapp.com",
    databaseURL: "https://suvaline-6de03.firebaseio.com",
    projectId: "suvaline-6de03",
    storageBucket: "suvaline-6de03.appspot.com",
    messagingSenderId: "1003382351755",
    appId: "1:1003382351755:web:b55b3fba6a4b952d99b18e"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
let playersFire = firebase.database().ref("playersFire");
let playersMap = new Map();

class players {
    constructor(name, posx, posy, pcolor) {
        this.name = name;
        this.x = posx;
        this.y = posy;
        this.color = pcolor;
        this.width = 25;
        this.height = 25;
        this.speed = 3;
        this.velX = 0;
        this.velY = 0;
        this.jumping = false;
        this.grounded = false;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    };
};

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 1400,
    height = 700,
    keys = [],
    friction = 0.8,
    gravity = 0.4,
    boxes = [],
    playersarr = [],
    powerup = [];

boxes.push({
    x: 0,
    y: 690,
    width: 1400,
    height: 10,
    color: "#655643"
});
boxes.push({
    x: 1390,
    y: 0,
    width: 10,
    height: 700,
    color: "#655643"
});
boxes.push({
    x: 0,
    y: 0,
    width: 10,
    height: 700,
    color: "#655643"
});
boxes.push({
    x: 0,
    y: 0,
    width: 10,
    height: 400,
    color: "#655643"
});

function drawboxes() {
    for (var i = 0; i < boxes.length; i++) {
        //print boxes
        ctx.fillStyle = boxes[i].color;
        ctx.save();
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
    
    };
};

function update() {
    let prompt = document.getElementById("prompt");
    p5Prompt = new p5.Element(prompt);
    p5Prompt.position(450, 200);
    prompt.hidden = false;
    document.getElementById("promptInput").focus();
    if (keys[38] || keys[32] || keys[87]) {
        // ülesse või hüpe
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2.5; //hyppe kõrgus
        }
    }
    //paremale
    if (keys[39] || keys[68]) {
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    //vasakule
    if (keys[37] || keys[65]) {
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }

    player.velX *= friction;
    player.velY += gravity;
    ctx.clearRect(0, 0, 1400, 700);
    ctx.beginPath();

    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        //print boxes
        ctx.fillStyle = boxes[i].color;
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

        var dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }
    }

    for (let [playerName, player2] of playersMap) {
        if (player2.name == player.name) {
            continue;
        } else {
            var dir2 = colCheck(player, player2);
            if (dir2 === "l" || dir2 === "r") {
                player.velX = 0;
                player.jumping = false;
            } else if (dir2 === "b") {
                player.grounded = true;
                player.jumping = false;
            } else if (dir2 === "t") {
                player.velY *= -1;
            }
        };   
    };

    if (player.grounded) {
        player.velY = 0;
    }
    playersFire.child(player.name).update({
        x: player.x += player.velX,
        y: player.y += player.velY
    });
    ctx.fill();
    for (let [playerName, player2] of playersMap) {
        if (player2.name == player.name) {
            continue;
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
        };
        
        
    };

    
     // joonista enda mängija
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    //ctx.fillStyle = player1.color;
    //ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    //draw powerup stuff
    for (var j = 0; j < powerup.length; j++) {
        ctx.save();
        var cx = powerup[j].x + 0.5 * powerup[j].width, // x of shape center
            cy = powerup[j].y + 0.5 * powerup[j].height; //y of shape center
        ctx.translate(cx, cy); //translate to center of shape
        ctx.rotate((Math.PI / 180) * 45); //rotate 25 degrees.
        if (powerup[j].effect === "tele") {
            ctx.rotate((Math.PI / 180) * powerup[j].rotate); //rotate 25 degrees.
            powerup[j].rotate = (Math.PI / 180) * powerup[j].rotate;
        }
        ctx.translate(-cx, -cy); //translate center back to 0,0
        ctx.fillStyle = powerup[j].color;
        ctx.fillRect(
            powerup[j].x,
            powerup[j].y,
            powerup[j].width,
            powerup[j].height
        );
        ctx.restore();

        //powerup collision
        if (colCheck(player, powerup[j]) !== null) {
            //touched power up!
            if (powerup[j].effect === "gravity") {
                gravity = 0.4; //decrease gravity
                player.speed = 4;
                player.color = "white";
            } else if (powerup[j].effect === "shrink") {
                player.width = 10;
                player.height = 10;
                player.speed = 5;
            } else if (powerup[j].effect === "tele") {
                player.x = powerup[j].px;
                player.y = powerup[j].py;
            } else if (powerup[j].effect === "win") {
                var r = confirm("You win! Play again?");
                if (r == false) {
                    player.x = 200;
                    player.y = 200;
                } else {
                    window.location.href = window.location.href;
                }
            }
            if (powerup[j].stay !== true) powerup[j].width = 0; //make power up go away
        }
    }
    //powerup stuff

    requestAnimationFrame(update);
};

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = shapeA.x + shapeA.width / 2 - (shapeB.x + shapeB.width / 2),
        vY = shapeA.y + shapeA.height / 2 - (shapeB.y + shapeB.height / 2),
        // add the half widths and half heights of the objects
        hWidths = shapeA.width / 2 + shapeB.width / 2,
        hHeights = shapeA.height / 2 + shapeB.height / 2,
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
};

playersFire.on("child_added", (snapshot) => {
    if ((snapshot.key === player.nimi) || (snapshot.key === "Nimetu")) {
        
        console.log(playersMap);
    } else {
        playersMap.set(snapshot.key, new players(snapshot.key, snapshot.val().x, snapshot.val().y, snapshot.val().color));        
        console.log(playersMap);
        playersFire.child(snapshot.key).on("value", onChildValueChanged);
    };  
    
});

canvas.width = width;
canvas.height = height;
drawboxes();
player = new players("Nimetu", 100, 100, "blue");



document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load", function () {
    update();
});

function onPromptButtonClick(shouldTakeInputValue) {
    if (!shouldTakeInputValue) player.name = "ei taha nime panna" + Math.floor(Math.random() * 100);
    else {
        let inputValue = document.getElementById("promptInput").value.replace(/[\.\#\$\[\]\/]/g, "");
        player.name = inputValue || "ei taha nime panna" + Math.floor(Math.random() * 100);
    }
    playersFire.child(player.name).set({
        x: 540,
        y: 50,
        color: player.color,
        velY: 0
    });
    p5Prompt.hide();
};

function onPromptInputKeyup(event) {
    if (event.key === "Enter") onPromptButtonClick(true);
    if (event.key === "Escape") onPromptButtonClick(false);
};

function onChildValueChanged(snapshot) {
    if (!snapshot.val()) return;
    let player = playersMap.get(snapshot.key);
    player.x = snapshot.val().x;
    player.y = snapshot.val().y;
    player.color = snapshot.val().color;
}; 

window.addEventListener("beforeunload", function(e){
    console.log("Hello hello hello");
    playersFire.child(player.name).off();
    playersFire.child(player.name).remove();
 }, false);

 playersFire.on("child_removed", (snapshot) => {
    playersMap.delete(snapshot.key);
  });