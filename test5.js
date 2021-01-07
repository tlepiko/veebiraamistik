// firebase algus
const firebaseConfig = {
    apiKey: "AIzaSyAdy4kwFCOhFTp0D8VGkCDO5JXQmgvRWzs",
    authDomain: "suvaline-6de03.firebaseapp.com",
    databaseURL: "https://suvaline-6de03.firebaseio.com",
    projectId: "suvaline-6de03",
    storageBucket: "suvaline-6de03.appspot.com",
    messagingSenderId: "1003382351755",
    appId: "1:1003382351755:web:b55b3fba6a4b952d99b18e"
};


firebase.initializeApp(firebaseConfig);
let playersFire = firebase.database().ref("playersFire");
//firebase lõpp

//kohalik
let playersMap = new Map();

//mängija constructor algus
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
    };
};
//mängija constructor lõpp

//canvase andmed algus
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 1400,
    height = 700,
    keys = [],
    friction = 0.8,
    gravity = 0.4,
    boxes = [],
    boxes2 = [];
//canvase andmed lõpp

//platvormide nimekiri algus
boxes.push({
    x: 0,
    y: 690,
    width: 1400,
    height: 10,
    color: "#655643"
},
{
    x: 0,
    y: 0,
    width: 1400,
    height: 10,
    color: "#655643"
},
{
    x: 1390,
    y: 0,
    width: 10,
    height: 700,
    color: "#655643"
},
{
    x: 0,
    y: 0,
    width: 10,
    height: 700,
    color: "#655643"
},
{
    x: 150,
    y: 625,
    width: 100,
    height: 10,
    color: "#655643"
},
{
    x: 275,
    y: 560,
    width: 100,
    height: 10,
    color: "#655643"
},
{
    x: 450,
    y: 560,
    width: 100,
    height: 10,
    color: "#655643"
},
{
    x: 675,
    y: 560,
    width: 100,
    height: 10,
    color: "#655643"
},
{
    x: 675,
    y: 560,
    width: 100,
    height: 10,
    color: "#655643"
},
{
    x: 800,
    y: 500,
    width: 50,
    height: 10,
    color: "#655643"
},
{
    x: 700,
    y: 440,
    width: 50,
    height: 10,
    color: "#655643"
},
{
    x: 900,
    y: 440,
    width: 50,
    height: 10,
    color: "#655643"
},
{
    x: 500,
    y: 440,
    width: 10,
    height: 10,
    color: "#655643"
},
{
    x: 600,
    y: 440,
    width: 10,
    height: 10,
    color: "#655643"
},
{
    x: 400,
    y: 440,
    width: 10,
    height: 10,
    color: "#655643"
},
{
    x: 300,
    y: 400,
    width: 10,
    height: 10,
    color: "#655643"
},
{
    x: 200,
    y: 340,
    width: 10,
    height: 10,
    color: "#655643"
},
{
    x: 125,
    y: 10,
    width: 10,
    height: 400,
    color: "#655643"
},
{
    x: 200,
    y: 100,
    width: 10,
    height: 200,
    color: "#655643"
},
{
    x: 200,
    y: 90,
    width: 200,
    height: 10,
    color: "#655643"
},
{
    x: 135,
    y: 300,
    width: 20,
    height: 10,
    color: "#655643"
},
{
    x: 180,
    y: 240,
    width: 20,
    height: 10,
    color: "#655643"
},
{
    x: 135,
    y: 180,
    width: 20,
    height: 10,
    color: "#655643"
},
{
    x: 180,
    y: 120,
    width: 20,
    height: 10,
    color: "#655643"
},
{
    x: 450,
    y: 90,
    width: 100,
    height: 10,
    color: "#655643"
},
{
    x: 600,
    y: 90,
    width: 400,
    height: 10,
    color: "#655643"
},
{
    x: 1300,
    y: 90,
    width: 10,
    height: 610,
    color: "#655643"
},
{
    x: 1250,
    y: 100,
    width: 10,
    height: 155,
    color: "#655643"
},
{
    x: 1260,
    y: 240,
    width: 10,
    height: 10,
    color: "#655643"
},
{
    x: 1260,
    y: 140,
    width: 10,
    height: 10,
    color: "#655643"
},
{
    x: 1290,
    y: 190,
    width: 10,
    height: 10,
    color: "#655643"
},
{
    x: 700,
    y: 300,
    width: 30,
    height: 10,
    color: "#655643"
},
{
    x: 1050,
    y: 90,
    width: 210,
    height: 10,
    color: "#655643"
},
{
    x: 950,
    y: 440,
    width: 350,
    height: 10,
    color: "#655643"
},
);
boxes2.push({
    x: 400,
    y: 90,
    width: 50,
    height: 10,
    color: "#655643"
},
{
    x: 550,
    y: 90,
    width: 50,
    height: 10,
    color: "#655643"
}
);
//platvormide nimekiri lõpp

function update() {
    //vorm
    let naming = document.getElementById("naming");
    let taken = document.getElementById("taken");
    namingPopup = new p5.Element(naming);
    namingPopup.position(600, 250);
    naming.hidden = false;
    document.getElementById("name").focus();
    //hüpe
    if (keys[38] || keys[32] || keys[87]) {
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2.5; //hüppe kõrgus
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
    //Mängija gravitatsioon ja hõõrdejõud
    player.velX *= friction;
    player.velY += gravity;
    ctx.clearRect(0, 0, 1400, 700);
    ctx.beginPath();

    //Kontroll, kas mängija asub maas
    player.grounded = false;
    //platvormide ja piirete joonistamine algus
    for (var i = 0; i < boxes.length; i++) {
        ctx.fillStyle = boxes[i].color;
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
        ctx.fill();
        //platvormide ja piirete joonistamine lõpp

        //kokkupõrke kontroll kastidega algus
        var dir = collisionCheck(player, boxes[i]);
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
    //kokkupõrke kontroll kastidega lõpp
    for (var f = 0; f < boxes2.length; f++) {
        ctx.fillStyle = boxes2[f].color;
        ctx.rect(boxes2[f].x, boxes2[f].y, boxes2[f].width, boxes2[f].height);
        ctx.fill();
    };
    //teiste mängijatega kokkupõrke kontroll algus
    for (let [playerName, player2] of playersMap) {
        if (player2.name == player.name) {
            continue;
        } else {
            var dir2 = collisionCheck(player, player2);
            if (dir2 === "l") {
                player.velX = 0;
                player2.velX = -1;
                player2.x += player2.velX;
                player.jumping = false;
            } else if (dir2 === "r") {
                player.velX = 0;
                player2.velX = 1;
                player2.x += player2.velX;
                player.jumping = false;
            }
            else if (dir2 === "b") {
                player.grounded = true;
                player.jumping = false;
            } else if (dir2 === "t") {
                player.velY *= -1;
            }
        };
    };
    //teiste mängijatega kokkupõrke kontroll lõpp

    //mängija langemiskiiruse nullimine algus
    if (player.grounded) {
        player.velY = 0;
    }
    //mängija langemiskiiruse nullimine lõpp

    //mängija positsiooni uuendamine firebase andmebaasis algus
    playersFire.child(player.name).update({
        x: player.x += player.velX,
        y: player.y += player.velY
    });
    //mängija positsiooni uuendamine firebase andmebaasis lõpp

    //teise mängijate joonistamine algus
    for (let [playerName, player2] of playersMap) {
        if (player2.name == player.name) {
            continue;
        } else {
            ctx.fillStyle = player2.color;
            ctx.font = "12px Arial";
            ctx.fillText(player2.name, player2.x + 12.5, player2.y - 5);
            ctx.textAlign = "center";
            ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
        };
    };
    //teise mängijate joonistamine lõpp


    //enda mängija joonistamine algus
    ctx.fillStyle = document.getElementById("coloring").value;
    ctx.font = "12px Arial";
    ctx.fillText(player.name, player.x + 12.5, player.y - 5);
    ctx.textAlign = "center";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    //enda mängija joonistamine lõpp

    requestAnimationFrame(update);
};

//kokkupõrke kontrolli funktsiooni algus
function collisionCheck(shapeA, shapeB) {
    var vX = shapeA.x + shapeA.width / 2 - (shapeB.x + shapeB.width / 2),
        vY = shapeA.y + shapeA.height / 2 - (shapeB.y + shapeB.height / 2),
        hWidths = shapeA.width / 2 + shapeB.width / 2,
        hHeights = shapeA.height / 2 + shapeB.height / 2,
        colDir = null;
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
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
//kokkupõrke kontrolli funktsiooni lõpp

//uue mängija lisamine algus
playersFire.on("child_added", (snapshot) => {
    if ((snapshot.key === player.nimi) || (snapshot.key === "Nimetu") || (!snapshot.key)) {
        console.log(playersMap);
    } else {
        playersMap.set(snapshot.key, new players(snapshot.key, snapshot.val().x, snapshot.val().y, snapshot.val().color));
        console.log(playersMap);
        playersFire.child(snapshot.key).on("value", onChildValueChanged);
    };

});
//uue mängija lisamine lõpp

//canvas dimensioonid algus
canvas.width = width;
canvas.height = height;
//canvas dimensioonid lõpp

//algne mängija - nimeta ja värvita
player = new players("Nimetu", 100, 100, "blue");


//nupuvajutuse kuulajad algus
document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});
//nupuvajutuse kuulajad lõpp

//alglaadimise kuulaja algus
window.addEventListener("load", function () {
    update();
});
//alglaadimise kuulaja lõpp

//nime ja värvi küsimine algus
function onButtonClick(ok) {
    if (!ok) return;
    let potName = document.getElementById("name").value.replace(/[\.\#\$\[\]\/]/g, "");
    if (playersMap.has(potName) || (potName === "")) {
        onButtonClick();
        taken.hidden = false;
    } else {
        
        player.name = potName;
        playersFire.child(player.name).set({
            x: 540,
            y: 50,
            color: document.getElementById("coloring").value,
        });
        taken.hidden = true;
        namingPopup.hide();
    }
};

//nime ja värvi küsimine lõpp
//mängija kustutamine brauseri akna sulgemisel algus
window.onbeforeunload = function () {
    playersFire.child(player.name).remove();


};
window.onunload = function () {
    playersMap.delete(player.name);

};

function onChildValueChanged(snapshot) {
    if (!snapshot.val()) return;
    let player = playersMap.get(snapshot.key);
    if (typeof player === 'undefined') {
    } else {
        player.x = snapshot.val().x;
        player.y = snapshot.val().y;
        player.color = snapshot.val().color;
    }

};

playersFire.on("child_removed", (snapshot) => {
    playersFire.child(snapshot.key).remove();
    playersMap.delete(snapshot.key);
    console.log(playersMap);
});
//mängija kustutamine brauseri akna sulgemisel lõpp