/* To test this sketch in mobile Chrome,
    please use the secret tab, which doesn't have cache
    so that we can immediately see the updated sketch. */

const serverIP = location.hostname
const socket = new WebSocket("ws://" + serverIP + ":8080/message");

let appTitle;

let txtR, valR;
let txtG, valG;
let txtB, valB;

let sliderR;
let sliderG;
let sliderB;

let btnFlipX;
let btnFlipY;
let btnTurnL;
let btnTurnR;
let btnApply;

let drawCnt = 0;

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


    /* ============================== */
    txtR = new P("R:");
    txtR.position(60, 325);
    txtR.makeNormal();

    valR = new P("0");
    valR.position(120, txtR.y);
    valR.makeNormal();

    sliderR = new Slider();
    sliderR.range(0, 100, 0);
    sliderR.position(210, txtR.y+15);

    /* ============================== */
    txtG = new P("G:");
    txtG.position(60, 365);
    txtG.makeNormal();

    valG = new P("0");
    valG.position(120, txtG.y);
    valG.makeNormal();

    sliderG = new Slider();
    sliderG.range(0, 100, 0);
    sliderG.position(210, 380);

    /* ============================== */
    txtB = new P("B:");
    txtB.position(60, 405);
    txtB.makeNormal();

    valB = new P("0");
    valB.position(120, txtB.y);
    valB.makeNormal();

    sliderB = new Slider();
    sliderB.range(0, 100, 0);
    sliderB.position(210, 420);

    /* ============================== */
    btnFlipX = new Button('Flip X');
    btnFlipX.position(50, 470);
    btnFlipX.addSocket(socket);

    btnFlipY = new Button('Flip Y');
    btnFlipY.position(210, 470);
    btnFlipY.addSocket(socket);

    /* ============================== */
    btnTurnL = new Button('Turn Left');
    btnTurnL.position(50, 525);
    btnTurnL.addSocket(socket);

    btnTurnR = new Button('Turn Right');
    btnTurnR.position(210, 525);
    btnTurnR.addSocket(socket);

    /* ============================== */
    btnApply = new Button('Apply');
    btnApply.position(50, 580);
    btnApply.size(310, 40);
    btnApply.addSocket(socket);
}

function draw() {
    drawCnt += 1;
    if (drawCnt > 10) {
        drawCnt = 0;
        background('#dddddd')

        sliderR.checkChanged();
        sliderG.checkChanged();
        sliderB.checkChanged();

        if (sliderR.getChanged() ||
            sliderG.getChanged() ||
            sliderB.getChanged()) {
            valR.update(sliderR.getValue());
            valG.update(sliderG.getValue());
            valB.update(sliderB.getValue());
        }
    }

}

function windowResized() {
    createCanvas(displayWidth, displayHeight)
}
