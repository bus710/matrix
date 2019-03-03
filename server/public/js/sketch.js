/* To test this sketch in mobile Chrome,
    please use the secret tab, which doesn't have cache
    so that we can immediately see the updated sketch. */

const serverIP = location.hostname
const socket = new WebSocket("ws://" + serverIP + ":8080/message");

let appTitle;

let yType;
let btnAll;
let btnPartial;
let btnSingle;

let yR, yG, yB;
let txtR, valR, sliderR;
let txtG, valG, sliderG;
let txtB, valB, sliderB;

let yFlip;
let btnFlipX;
let btnFlipY;

let yTurn;
let btnTurnL;
let btnTurnR;

let yApply;
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
    yType = 310;
    btnAll = new Button('All');
    btnAll.position(60, yType);
    btnAll.size(90, 40);
    btnAll.addSocket(socket);

    btnPartial= new Button('Partial');
    btnPartial.position(160, yType);
    btnPartial.size(90, 40);
    btnPartial.addSocket(socket);

    btnSingle= new Button('Single');
    btnSingle.position(260, yType);
    btnSingle.size(90, 40);
    btnSingle.addSocket(socket);

    /* ============================== */
    yR = 360;
    txtR = new P("R:");
    txtR.position(60, yR);
    txtR.makeNormal();

    valR = new P("0");
    valR.position(120, yR);
    valR.makeNormal();

    sliderR = new Slider();
    sliderR.range(0, 100, 0);
    sliderR.position(210, yR+15);

    /* ============================== */
    yG = yR + 40;
    txtG = new P("G:");
    txtG.position(60, yG);
    txtG.makeNormal();

    valG = new P("0");
    valG.position(120, yG);
    valG.makeNormal();

    sliderG = new Slider();
    sliderG.range(0, 100, 0);
    sliderG.position(210, yG+15);

    /* ============================== */
    yB = yG + 40;
    txtB = new P("B:");
    txtB.position(60, yB);
    txtB.makeNormal();

    valB = new P("0");
    valB.position(120, yB);
    valB.makeNormal();

    sliderB = new Slider();
    sliderB.range(0, 100, 0);
    sliderB.position(210, yB+15);

    /* ============================== */
    yFlip = 500;
    btnFlipX = new Button('Flip X');
    btnFlipX.position(50, yFlip);
    btnFlipX.addSocket(socket);

    btnFlipY = new Button('Flip Y');
    btnFlipY.position(210, yFlip);
    btnFlipY.addSocket(socket);

    /* ============================== */
    yTurn = 550;
    btnTurnL = new Button('Turn Left');
    btnTurnL.position(50, yTurn);
    btnTurnL.addSocket(socket);

    btnTurnR = new Button('Turn Right');
    btnTurnR.position(210, yTurn);
    btnTurnR.addSocket(socket);

    /* ============================== */
    yApply = 600;
    btnApply = new Button('Apply');
    btnApply.position(50, yApply);
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
