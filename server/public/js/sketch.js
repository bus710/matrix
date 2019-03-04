/* To test this sketch in mobile Chrome,
    please use the secret tab, which doesn't have cache
    so that we can immediately see the updated sketch. */

const serverIP = location.hostname
const socket = new WebSocket("ws://" + serverIP + ":8080/message");

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

/* Events =========================== */
socket.onopen = function () {
    console.log('socket is opened');
};

socket.onmessage = function (e) {
    console.log('got a message: ' + e.data);
};

let eBtnAll = new Event('btnAllPressed');
let eBtnPartial = new Event('btnPartialPressed');
let eBtnSingle = new Event('btnSinglePressed');
let eBtnFlipX = new Event('btnFlipXPressed');
let eBtnFlipY = new Event('btnFlipYPressed');
let eBtnTurnL = new Event('btnTurnLPressed');
let eBtnTurnR = new Event('btnTurnRPressed');
let eBtnApply = new Event('btnApplyPressed');

let eSliderR = new CustomEvent('sliderRChanged', {detail: { value: 0}});
let eSliderG = new CustomEvent('sliderGChanged');
let eSliderB = new CustomEvent('sliderBChanged');

/* Handlers =========================== */
document.addEventListener('btnAllPressed', function(e){console.log('click!')});

document.addEventListener('btnPartialPressed', function(e){console.log('click!')});
document.addEventListener('btnSinglePressed', function(e){console.log('click!')});
document.addEventListener('btnFlipXPressed', function(e){console.log('click!')});
document.addEventListener('btnFlipYPressed', function(e){console.log('click!')});
document.addEventListener('btnTurnLPressed', function(e){console.log('click!')});
document.addEventListener('btnTurnRPressed', function(e){console.log('click!')});
document.addEventListener('btnApplyPressed', function(e){console.log('click!')});

document.addEventListener('sliderRChanged', function(e){
    console.log(sliderR.getValue());
});
document.addEventListener('sliderGChanged', function(e){console.log('click!')});
document.addEventListener('sliderBChanged', function(e){console.log('click!')});

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
    matrix.position(80, yMatrix);

    /* ============================== */
    yType = 320;
    btnAll = new Button('All');
    btnAll.position(50, yType);
    btnAll.size(100, 40);
    btnAll.addEvent(eBtnAll);
    btnAll.addSocket(socket);

    btnPartial = new Button('Partial');
    btnPartial.position(155, yType);
    btnPartial.size(100, 40);
    btnPartial.addEvent(eBtnPartial);
    btnPartial.addSocket(socket);

    btnSingle = new Button('Single');
    btnSingle.position(260, yType);
    btnSingle.size(100, 40);
    btnSingle.addEvent(eBtnSingle);
    btnSingle.addSocket(socket);

    /* ============================== */
    yR = 360;
    txtR = new P("R:");
    txtR.position(60, yR);
    txtR.makeNormal();

    valR = new P("0");
    valR.position(130, yR);
    valR.makeNormal();

    sliderR = new Slider();
    sliderR.range(0, 255, 0);
    sliderR.position(215, yR+15);
    sliderR.addEvent(eSliderR);

    /* ============================== */
    yG = yR + 40;
    txtG = new P("G:");
    txtG.position(60, yG);
    txtG.makeNormal();

    valG = new P("0");
    valG.position(130, yG);
    valG.makeNormal();

    sliderG = new Slider();
    sliderG.range(0, 255, 0);
    sliderG.position(215, yG+15);
    sliderG.addEvent(eSliderG);

    /* ============================== */
    yB = yG + 40;
    txtB = new P("B:");
    txtB.position(60, yB);
    txtB.makeNormal();

    valB = new P("0");
    valB.position(130, yB);
    valB.makeNormal();

    sliderB = new Slider();
    sliderB.range(0, 255, 0);
    sliderB.position(215, yB+15);
    sliderB.addEvent(eSliderB);

    /* ============================== */
    yFlip = 490;
    btnFlipX = new Button('Flip X');
    btnFlipX.position(50, yFlip);
    btnFlipX.addSocket(socket);
    btnFlipX.addEvent(eBtnFlipX);

    btnFlipY = new Button('Flip Y');
    btnFlipY.position(210, yFlip);
    btnFlipY.addSocket(socket);
    btnFlipY.addEvent(eBtnFlipY);

    /* ============================== */
    yTurn = 540;
    btnTurnL = new Button('Turn Left');
    btnTurnL.position(50, yTurn);
    btnTurnL.addSocket(socket);
    btnTurnL.addEvent(eBtnTurnL);

    btnTurnR = new Button('Turn Right');
    btnTurnR.position(210, yTurn);
    btnTurnR.addSocket(socket);
    btnTurnR.addEvent(eBtnTurnR);

    /* ============================== */
    yApply = 590;
    btnApply = new Button('Apply');
    btnApply.position(50, yApply);
    btnApply.size(310, 40);
    btnApply.addSocket(socket);
    btnApply.addEvent(eBtnApply);
}

function draw() {
    drawCnt += 1;
    if (drawCnt > 10) {
        drawCnt = 0;
        background('#dddddd')

        if (btnAll.getPressed()) {
            matrix.setMode('All');
            sliderR.setValue(0);
            sliderG.setValue(0);
            sliderB.setValue(0);
        }

        if (btnPartial.getPressed()) {
            matrix.setMode('Partial');
        }

        if (btnSingle.getPressed()) {
            matrix.setMode('Single');
        }

        /* This methods just update the internal variable */
        sliderR.updateChanged();
        sliderG.updateChanged();
        sliderB.updateChanged();

        /* This methods actually check if the internal variables are changed */
        if (sliderR.getChanged() ||
            sliderG.getChanged() ||
            sliderB.getChanged()) {
            valR.update(sliderR.getValue());
            valG.update(sliderG.getValue());
            valB.update(sliderB.getValue());
            matrix.setColor(
                sliderR.getValue(), 
                sliderG.getValue(),
                sliderB.getValue());
        }

        matrix.update();
    }
}

function mouseClicked () {
    switch(matrix.getMode()) {
        case 'All':
            break;
        case 'Partial':
        case 'Single':
            matrix.checkSelectedCircle(mouseX, mouseY)
            break;
        default:
            break;
    }
}

function windowResized() {
    createCanvas(displayWidth, displayHeight)
}
