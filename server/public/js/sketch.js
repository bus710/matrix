/* To test this sketch in mobile Chrome,
    please use the secret tab, which doesn't have cache
    so that we can immediately see the updated sketch. */

const serverIP = location.hostname
const webSocket = new WebSocket("ws://" + serverIP + ":8080/message");

let yMatrix;
let matrix;

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

let eBtnAll = new Event('btnAllPressed');
let eBtnPartial = new Event('btnPartialPressed');
let eBtnSingle = new Event('btnSinglePressed');
let eBtnFlipX = new Event('btnFlipXPressed');
let eBtnFlipY = new Event('btnFlipYPressed');
let eBtnTurnL = new Event('btnTurnLPressed');
let eBtnTurnR = new Event('btnTurnRPressed');
let eBtnApply = new Event('btnApplyPressed');

let eSliderR = new Event('sliderRChanged');
let eSliderG = new Event('sliderGChanged');
let eSliderB = new Event('sliderBChanged');

/* ============================== */
function setup() {
    // createCanvas(displayWidth, displayHeight)
    createCanvas(displayWidth, displayWidth*1.6)

    /* ============================== */
    yMatrix = 30;

    // c = new Circle();
    // c.position(70, 50);
    // c.defaultColor(255, 255, 255);

    matrix = new Matrix();
    matrix.setPosition(80, yMatrix);

    /* ============================== */
    yType = 320;
    btnAll = new Button('All');
    btnAll.setPosition(50, yType);
    btnAll.setSize(100, 40);
    btnAll.setEvent(eBtnAll);

    btnPartial = new Button('Partial');
    btnPartial.setPosition(155, yType);
    btnPartial.setSize(100, 40);
    btnPartial.setEvent(eBtnPartial);

    btnSingle = new Button('Single');
    btnSingle.setPosition(260, yType);
    btnSingle.setSize(100, 40);
    btnSingle.setEvent(eBtnSingle);

    /* ============================== */
    yR = 360;
    txtR = new P("R:");
    txtR.setPosition(60, yR);
    txtR.setNormal();

    valR = new P("0");
    valR.setPosition(130, yR);
    valR.setNormal();

    sliderR = new Slider();
    sliderR.setRange(0, 255, 0, 10);
    sliderR.setPosition(215, yR+15);
    sliderR.setEvent(eSliderR);

    /* ============================== */
    yG = yR + 40;
    txtG = new P("G:");
    txtG.setPosition(60, yG);
    txtG.setNormal();

    valG = new P("0");
    valG.setPosition(130, yG);
    valG.setNormal();

    sliderG = new Slider();
    sliderG.setRange(0, 255, 0, 10);
    sliderG.setPosition(215, yG+15);
    sliderG.setEvent(eSliderG);

    /* ============================== */
    yB = yG + 40;
    txtB = new P("B:");
    txtB.setPosition(60, yB);
    txtB.setNormal();

    valB = new P("0");
    valB.setPosition(130, yB);
    valB.setNormal();

    sliderB = new Slider();
    sliderB.setRange(0, 255, 0, 10);
    sliderB.setPosition(215, yB+15);
    sliderB.setEvent(eSliderB);

    /* ============================== */
    yFlip = 490;
    btnFlipX = new Button('Flip X');
    btnFlipX.setPosition(50, yFlip);
    btnFlipX.setEvent(eBtnFlipX);

    btnFlipY = new Button('Flip Y');
    btnFlipY.setPosition(210, yFlip);
    btnFlipY.setEvent(eBtnFlipY);

    /* ============================== */
    yTurn = 540;
    btnTurnL = new Button('Turn Left');
    btnTurnL.setPosition(50, yTurn);
    btnTurnL.setEvent(eBtnTurnL);

    btnTurnR = new Button('Turn Right');
    btnTurnR.setPosition(210, yTurn);
    btnTurnR.setEvent(eBtnTurnR);

    /* ============================== */
    yApply = 590;
    btnApply = new Button('Apply');
    btnApply.setPosition(50, yApply);
    btnApply.setSize(310, 40);
    btnApply.setEvent(eBtnApply);
}

function draw() {
    drawCnt += 1;
    if (drawCnt > 10) {
        drawCnt = 0;
        background('#dddddd')

        matrix.update();
    }
}

function mouseClicked () {
    if (mouseY < yType) {
        btnAll.setNormal();
        btnPartial.setNormal();
        btnSingle.setNormal();

        if (matrix.getMode() == 'Partial') {
            btnPartial.setBold();
        } else {
            btnSingle.setBold();
        }

        matrix.checkSelectedCircle(mouseX, mouseY)
    }
}

function windowResized() {
    createCanvas(displayWidth, displayHeight)
}

/* Event Handlers =========================== */
document.addEventListener('btnAllPressed', function(e){
    sliderR.setValue(0);
    sliderG.setValue(0);
    sliderB.setValue(0);
    slidersUpdated();
    matrix.update();
    matrix.setMode('All');
    btnAll.setBold();
    btnPartial.setNormal();
    btnSingle.setNormal();
});

document.addEventListener('btnPartialPressed', function(e){
    matrix.setMode('Partial');
    btnAll.setNormal();
    btnPartial.setBold();
    btnSingle.setNormal();
});

document.addEventListener('btnSinglePressed', function(e){
    matrix.setMode('Single');
    btnAll.setNormal();
    btnPartial.setNormal();
    btnSingle.setBold();
});

document.addEventListener('btnFlipXPressed', function(e){
});

document.addEventListener('btnFlipYPressed', function(e){
});

document.addEventListener('btnTurnLPressed', function(e){
});

document.addEventListener('btnTurnRPressed', function(e){
});

document.addEventListener('btnApplyPressed', function(e){
    webSocket.send(
        JSON.stringify({message: "hello server!"}))
    axios.get('/api')
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
    });
});

document.addEventListener('sliderRChanged', function(e){
    slidersUpdated();
});

document.addEventListener('sliderGChanged', function(e){
    slidersUpdated();
});

document.addEventListener('sliderBChanged', function(e){
    slidersUpdated();
});

/* Helper functions =================== */
function slidersUpdated() {
    valR.update(sliderR.getValue());
    valG.update(sliderG.getValue());
    valB.update(sliderB.getValue());
    matrix.setColor(
        sliderR.getValue(), 
        sliderG.getValue(),
        sliderB.getValue());
}

/* Network Handlers =================== */
webSocket.onopen = function () {
    console.log('socket is opened');
};

webSocket.onmessage = function (e) {
    console.log('got a message: ' + e.data);
};