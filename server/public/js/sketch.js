/* To test this sketch in mobile Chrome,
    please use the secret tab, which doesn't have cache
    so that we can immediately see the updated sketch. */

const serverIP = location.hostname
const socket = new WebSocket("ws://" + serverIP + ":8080/message");

let appTitle;

let btnFlipX;
let btnFlipY;
let btnTurnL;
let btnTurnR;
let btnApply;

socket.onopen = function () {
    console.log("socket is opened");
};

socket.onmessage = function (e) {
    console.log("got a message: " + e.data);
};

function setup() {
    // createCanvas(displayWidth, displayHeight)
    createCanvas(displayWidth, displayWidth*1.6)

    // appTitle = new P("Matrix");
    // appTitle.position(70,10);
    // appTitle.makeHeader();

    btnFlipX = new Button('Flip X');
    btnFlipX.position(50, 400);
    btnFlipX.addSocket(socket);

    btnFlipY = new Button('Flip Y');
    btnFlipY.position(210, 400);
    btnFlipY.addSocket(socket);

    btnTurnL = new Button('Turn Left');
    btnTurnL.position(50, 450);
    btnTurnL.addSocket(socket);

    btnTurnR = new Button('Turn Right');
    btnTurnR.position(210, 450);
    btnTurnR.addSocket(socket);

    btnApply = new Button('Apply');
    btnApply.position(50, 580);
    btnApply.size(310, 50);
    btnApply.addSocket(socket);
}

function draw() {
    background('#dddddd')
}

function windowResized() {
    createCanvas(displayWidth, displayHeight)
}
