/* To test this sketch in mobile Chrome,
    please use the secret tab, which doesn't allow the cache
    so that we can immediately see the updated sketch. */

/* WebSocket */
const serverIP = location.hostname
const webSocket = new WebSocket("ws://" + serverIP + ":8080/message");

/* Location delimiter for the GUI components */
let yMatrix;
let yType;
let yR, yG, yB;
let yTurn;
let yApply;
let yFlip;

/* These variables will be used for GUI components */
let matrix;
let btnAll;
let btnPartial;
let btnSingle;
let txtR, valR, sliderR;
let txtG, valG, sliderG;
let txtB, valB, sliderB;
let btnFlipX;
let btnFlipY;
let btnTurnL;
let btnTurnR;
let btnApply;

/* Events */
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

/* variables for the draw handler */
let drawCnt = 0;

/* P5.js reserved fuctions
    - setup
    - draw
    - mouseClicked
    - windowResized */

function setup() {
    /* To make a P5 canvas that fits the entire screen
    that has 16:9 screen ratio */
    createCanvas(displayWidth, displayWidth*1.6)

    /* This block makes a matrix that consists of 
    64 circles. */
    yMatrix = 35;
    matrix = new Matrix();
    matrix.setPosition(85, yMatrix);
    matrix.setMode('All')

    /* This block makes the 3 buttons - All, Partial, and Single.
    These button can be used to pick the target circles */
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

    /* These 3 blocks below make the 3 sliders - R, G, and B. 
    Each slider changes the color of the selected circles at a moment. */
    yR = 360;
    txtR = new P("R:");
    txtR.setPosition(60, yR);
    txtR.setNormal();

    valR = new P("250");
    valR.setPosition(130, yR);
    valR.setNormal();

    sliderR = new Slider();
    sliderR.setRange(0, 255, 250, 10);    // Min, Max, Init, Step
    sliderR.setPosition(215, yR+15);
    sliderR.setEvent(eSliderR);

    /* ============================== */
    yG = yR + 40;
    txtG = new P("G:");
    txtG.setPosition(60, yG);
    txtG.setNormal();

    valG = new P("250");
    valG.setPosition(130, yG);
    valG.setNormal();

    sliderG = new Slider();
    sliderG.setRange(0, 255, 250, 10);
    sliderG.setPosition(215, yG+15);
    sliderG.setEvent(eSliderG);

    /* ============================== */
    yB = yG + 40;
    txtB = new P("B:");
    txtB.setPosition(60, yB);
    txtB.setNormal();

    valB = new P("250");
    valB.setPosition(130, yB);
    valB.setNormal();

    sliderB = new Slider();
    sliderB.setRange(0, 255, 250, 10);
    sliderB.setPosition(215, yB+15);
    sliderB.setEvent(eSliderB);

    /* Flip X and Y buttons can be used to flip the matrix. */
    yFlip = 490;
    btnFlipX = new Button('Flip X');
    btnFlipX.setPosition(50, yFlip);
    btnFlipX.setEvent(eBtnFlipX);

    btnFlipY = new Button('Flip Y');
    btnFlipY.setPosition(210, yFlip);
    btnFlipY.setEvent(eBtnFlipY);

    /* Turn L and R buttons can be used to turn the matrix. */
    yTurn = 540;
    btnTurnL = new Button('Turn Left');
    btnTurnL.setPosition(50, yTurn);
    btnTurnL.setEvent(eBtnTurnL);

    btnTurnR = new Button('Turn Right');
    btnTurnR.setPosition(210, yTurn);
    btnTurnR.setEvent(eBtnTurnR);

    /* Apply button can be used to send the current matrix' state
    to the server (of the REST API endpoint). */
    yApply = 590;
    btnApply = new Button('Apply');
    btnApply.setPosition(50, yApply);
    btnApply.setSize(310, 40);
    btnApply.setEvent(eBtnApply);

    /* To apply the sliders' state to all the circles. */
    slidersUpdated();
}

/* This function can be (typically) called 60 times per second */
function draw() {
    /* drawCnt limits the number of drawing in a second for the efficiency */
    drawCnt += 1;
    if (drawCnt > 10) {
        drawCnt = 0;
        background('#dddddd')

        // To update the matrix frequently 
        matrix.update();

        // To reset the font-weight of each button
        btnAll.setNormal();
        btnPartial.setNormal();
        btnSingle.setNormal();

        /* Then set the font-weight again 
        so that this can prevent any glitch */
        switch (matrix.getMode()) {
            case 'All':
                btnAll.setBold();
                break;
            case 'Partial':
                btnPartial.setBold();
                break;
            case 'Single':
                btnSingle.setBold();
                break;
            case 'None':
            default:
                break;
        }
    }
}

/* This function checks where a click/touch happened
so that the app can know which circle was chosen. */
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

        /* Chosen circles have thicker stroke line.
        Depends on the context (all, partial, or single),
        this function checks which was chosen. */
        matrix.checkSelectedCircle(mouseX, mouseY)
    }
}

/* To fix the size of the canvas 
even if the window size is changed. */
function windowResized() {
    createCanvas(displayWidth, displayWidth*1.6)
}

/* Event Handlers =========================== */

/* This handler resets all the circles' color to be white and chosen */
document.addEventListener('btnAllPressed', function(e){
    sliderR.setValue(250);
    sliderG.setValue(250);
    sliderB.setValue(250);
    slidersUpdated();
    matrix.update();
    matrix.setMode('All');
    btnAll.setBold();
    btnPartial.setNormal();
    btnSingle.setNormal();
});

/* This handler sets the mode to be partial. 
This makes all the circles to be unchosen first 
so that users can start to chose. */
document.addEventListener('btnPartialPressed', function(e){
    matrix.setMode('Partial');
    btnAll.setNormal();
    btnPartial.setBold();
    btnSingle.setNormal();
});

/* This handler sets the mode to be single. 
This makes all the circles to be unchosen first 
so that users can start to chose. */
document.addEventListener('btnSinglePressed', function(e){
    matrix.setMode('Single');
    btnAll.setNormal();
    btnPartial.setNormal();
    btnSingle.setBold();
});

/* This handler fires the flipping up-down function. */
document.addEventListener('btnFlipXPressed', function(e){
    matrix.flip('ud');
    matrix.setMode('None');
    btnAll.setNormal();
    btnPartial.setNormal();
    btnSingle.setNormal();
    matrix.checkSelectedCircle(0, 0)
});

/* This handler fires the flipping left-right function. */
document.addEventListener('btnFlipYPressed', function(e){
    matrix.flip('lr');
    matrix.setMode('None');
    btnAll.setNormal();
    btnPartial.setNormal();
    btnSingle.setNormal();
    matrix.checkSelectedCircle(0, 0)
});

/* This handler fires the left turning function. */
document.addEventListener('btnTurnLPressed', function(e){
    matrix.rot90('left');
    matrix.setMode('None');
    btnAll.setNormal();
    btnPartial.setNormal();
    btnSingle.setNormal();
    matrix.checkSelectedCircle(0, 0)
});

/* This handler fires the right turning function. */
document.addEventListener('btnTurnRPressed', function(e){
    matrix.rot90('right');
    matrix.setMode('None');
    btnAll.setNormal();
    btnPartial.setNormal();
    btnSingle.setNormal();
    matrix.checkSelectedCircle(0, 0)
});

/* This handler:
- gets the matrix's status
- makes the arrays for RGB as stringifued json 
- sends the strings to the REST end point. */
document.addEventListener('btnApplyPressed', function(e){
    /* The matrix should be flipped once before get it.
    to match the array's order and the LED's order. 
    However, it should be flipped again for the GUI's order. */
    matrix.flip('lr')
    let matrixCurrentState = matrix.getAllColor();
    matrix.flip('lr')

    /* Check if the arrays returned have right JSON structure. */
    try {
        JSON.parse(JSON.stringify(matrixCurrentState));
    } catch (e) {
        console.log('JSON format violation!');
    }

    // console.log(matrixCurrentState)
    console.log(new Date())

    /* To send the arrays to the server */
    axios.post('/api', matrixCurrentState)
        .then(function (response) {
            console.log(`POST's result: ${response.statusText}`);  // template literal
        })
        .catch(function (error) {
            console.log(`POST's result: ${error}`);
    });

    /* Just in case WebSocket connection is needed.
    For example, if someone wants to develop their own application 
    for the motion sensor on Sense Hat. */
    console.log("sent a WS message");
    webSocket.send(
        JSON.stringify({message: "hello server!"}))
});

/* A handler for the R slider */
document.addEventListener('sliderRChanged', function(e){
    slidersUpdated();
});

/* A handler for the G slider */
document.addEventListener('sliderGChanged', function(e){
    slidersUpdated();
});

/* A handler for the B slider */
document.addEventListener('sliderBChanged', function(e){
    slidersUpdated();
});

/* Helper functions =================== */

/* This function gets the sliders' status 
and applies the value to the circles chosen at a moment (+label). */
function slidersUpdated() {
    valR.update(sliderR.getValue());
    valG.update(sliderG.getValue());
    valB.update(sliderB.getValue());
    matrix.setColor(
        sliderR.getValue(), 
        sliderG.getValue(),
        sliderB.getValue());
}

/* Web Socket Handlers =================== */

/* To check if the socket is opened properly */
webSocket.onopen = function () {
    console.log('socket is opened');
};

/* A handler for the web socket. */
webSocket.onmessage = function (e) {
    console.log('got a WS message: ' + JSON.parse(e.data).message);
};