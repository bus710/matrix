
class Button {
    /* This function generates the test button. */
    constructor(name) {
        this.name = name;
        this.button = createButton(this.name);
        this.button.position(10, 10);
        this.button.size(150, 40);
        this.button.mouseOver(() => this.buttonReaction());
        this.button.mouseOut(() => this.buttonReaction());
        this.button.mousePressed(() => this.buttonReaction());
        this.button.mouseReleased(() => this.buttonReaction());
        this.event;
    }

    addSocket(socket) {
        this.socket = socket;
    }

    /* This is a handler for the button. */
    buttonReaction() {
        switch (event.type) {
            case 'mouseup':
                document.dispatchEvent(this.event);
                break;
            default:
                // console.log(event);
                break;
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.button.position(x, y);
    }

    setSize(w, h) {
        this.w = w;
        this.h = h;
        this.button.size(w, h);
    }

    setBold() {
        this.button.style('font-weight', 'bold');
    }

    setNormal() {
        this.button.style('font-weight', 'normal');
    }

    setEvent(e) {
        this.event = e;
    }
}

class P {
    constructor(name) {
        this.name = name;
        this.p = createP(this.name);
        this.x = 0;
        this.y = 0;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.p.position(this.x, this.y);
    }

    setHeader() {
        this.p.style('font-size', '40px');
        this.p.style('height', '1px');
        this.p.style('width', '500px');
        this.p.style('margin', '0px');
        this.p.style('text-align', 'justify')
    }

    setNormal() {
        this.p.style('font-size', '30px');
        this.p.style('height', '1px');
        this.p.style('width', '400px');
        this.p.style('margin', '0px');
        this.p.style('line-height', '1.7')
        this.p.style('text-align', 'justify')
    }

    update(string) {
        this.p.elt.innerText = string;
    }
}

class Slider {
    constructor(name) {
        this.name = name;
        this.s = createSlider(0, 255, 0, 10);
        this.min = 0;
        this.max = 255;
        this.x = 0;
        this.y = 0;
        this.value = 0;
        this.s.changed(() => this.sliderReaction());
    }

    setRange(min, max, value, step) {
        this.s.elt.min = min;
        this.s.elt.max = max;
        this.s.elt.value = value;
        this.s.elt.setp = step;
    }

    getValue() {
        return this.s.elt.value;
    }

    setValue(v) {
        this.s.elt.value = v;
        this.value = v;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.s.position(x, y);
    }

    setEvent(e) {
        this.event = e;
    }

    sliderReaction() {
        document.dispatchEvent(this.event);
    }
}

class Circle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.h = 22;
        this.w = 22;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;

        this.selected = 0;
        this.hz = 0;
        this.e = ellipse(this.x, this.y, this.h, this.w);
    }

    setColor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 255
    }

    getColor() {
        return [this.r, this.g, this.b];
    }

    setPosition(x, y) {
        delete this.e;
        this.x = x;
        this.y = y;
        this.e = ellipse(this.x, this.y, this.h, this.w);
    }

    getPosition() {
        return [this.x, this.y];
    }

    getSelected() {
        return this.selected;
    }

    setSelected(value) {
        this.selected = value;
    }

    update() {
        delete this.e;
        if (this.selected) {
            strokeWeight(3);
            stroke('black')
        } else {
            strokeWeight(1);
            stroke('black')
        }
        fill(this.r, this.g, this.b, this.a)
        this.e = ellipse(this.x, this.y, this.h, this.w);
        strokeWeight(1);
    }
}

class Matrix {
    constructor(name) {
        this.m = new Array(8);
        this.x = 80;
        this.y = 50;
        this.mode = 'All';

        let i, j;

        for (i = 0; i < 8; i++) {
            this.m[i] = new Array(8);
            for (j = 0; j < 8; j++) {
                this.m[i][j] = {
                    circle: new Circle(),
                    location: [i, j]
                };
                this.m[i][j].circle.setColor(250, 250, 250);
            }
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setMode(m) {
        if ((m != 'All') &&
            (m != 'Partial') &&
            (m != 'Single')) {
            this.mode = 'None';
        } else {
            this.mode = m;
        }

        switch (this.mode) {
            case 'All':
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        this.m[i][j].circle.setSelected(true);
                    }
                }
                break;
            case 'Partial':
            case 'Single':
            case 'None':
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        this.m[i][j].circle.setSelected(false);
                    }
                }
                break;
            default:
                break;
        }
    }

    getMode() {
        return this.mode;
    }

    setColor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    getAllColor() {
        let allColor = {
            meta: 'matrixCurrentState',
            r64: '',
            b64: '',
            g64: '',
        };
        let r64 = new Array(64).fill(0);
        let g64 = new Array(64).fill(0);
        let b64 = new Array(64).fill(0);

        let k = 0;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let tmp = this.m[i][j].circle.getColor();
                r64[k] = tmp[0];
                g64[k] = tmp[1];
                b64[k] = tmp[2];
                k ++;
            }
        }
        allColor.r64 = '{"r64":' + JSON.stringify(r64) + '}';
        allColor.g64 = '{"g64":' + JSON.stringify(g64) + '}';
        allColor.b64 = '{"b64":' + JSON.stringify(b64) + '}';
        return allColor;
    }

    checkSelectedCircle(x, y) {
        let pressed = false;
        /* If there was a touch/click, 
            the mode should be changed to single 
            regardless of the action's accuracy. */
        if (this.mode == 'All') {
            this.mode = 'Single';
        }

        if ((this.mode == 'Single') ||
            (this.mode == 'None')) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    this.m[i][j].circle.setSelected(false);
                }
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let circlePosition = this.m[i][j].circle.getPosition();

                if ((circlePosition[0] > x - 15) &&
                    (circlePosition[0] < x + 15) &&
                    (circlePosition[1] > y - 15) &&
                    (circlePosition[1] < y + 15)) {
                    if (this.m[i][j].circle.getSelected()) {
                        this.m[i][j].circle.setSelected(false);
                    } else {
                        this.m[i][j].circle.setSelected(true);
                    }
                    pressed = true;
                }
            }
        }

        if ((this.mode == 'Partial') &&
            (pressed == false)) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    this.m[i][j].circle.setSelected(false);
                }
            }
            this.mode = 'Single'
        }
    }

    update() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.m[i][j].circle.getSelected()) {
                    this.m[i][j].circle.setColor(
                        parseInt(this.r, 10),
                        parseInt(this.g, 10),
                        parseInt(this.b, 10));
                }
                this.m[i][j].circle.setPosition(this.x + 35 * i, this.y + 35 * j);
                this.m[i][j].circle.update();
            }
        }
    }

    flip(dir) {
        if ((dir != 'lr') &&
            (dir != 'ud')) {
            return;
        }

        let matrixR = new Array(8);
        let matrixG = new Array(8);
        let matrixB = new Array(8);
        let matrixA = new Array(8);    // Anti Diagonal to flip.

        for (let i = 0; i < 8; i++) {
            matrixR[i] = new Array(8).fill(0);
            matrixG[i] = new Array(8).fill(0);
            matrixB[i] = new Array(8).fill(0);
            matrixA[i] = new Array(8).fill(0);
            matrixA[i][7 - i] = 1;
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let tmpR = 0;
                let tmpG = 0;
                let tmpB = 0;
                for (let k = 0; k < 8; k++) {
                    if (dir == 'ud') {
                        /* Flip the matrix based on X axis */
                        let tmp1 = matrixA[k][j];
                        let tmp2 = this.m[i][k].circle.getColor();
                        tmpR += (tmp1 * tmp2[0]);
                        tmpG += (tmp1 * tmp2[1]);
                        tmpB += (tmp1 * tmp2[2]);
                    } else {
                        /* Flip the matrix based on Y axis */
                        let tmp1 = this.m[k][j].circle.getColor();
                        let tmp2 = matrixA[i][k];
                        tmpR += (tmp1[0] * tmp2);
                        tmpG += (tmp1[1] * tmp2);
                        tmpB += (tmp1[2] * tmp2);
                    }
                }
                matrixR[i][j] = tmpR;
                matrixG[i][j] = tmpG;
                matrixB[i][j] = tmpB;
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.m[i][j].circle.setColor(
                    matrixR[i][j],
                    matrixG[i][j],
                    matrixB[i][j]
                );
            }
        }
    }

    rot90(dir) {
        if ((dir != 'left') &&
            (dir != 'right')) {
            return;
        }

        let boundary = 7;
        let tmp = [];
        let index = [
            [0, 7],
            [1, 6],
            [2, 5],
            [3, 4]
        ];

        for (let j = 0; j < 4; j++) {

            let start = index[j][0];
            let end = index[j][1]

            for (let i = start; i < end; i++) {
                if (dir == 'left') {
                    tmp = this.m[i][start].circle.getColor();
                    this.m[i][start].circle.setColor(
                        this.m[end][i].circle.getColor()[0],
                        this.m[end][i].circle.getColor()[1],
                        this.m[end][i].circle.getColor()[2]);
                    this.m[end][i].circle.setColor(
                        this.m[boundary - i][end].circle.getColor()[0],
                        this.m[boundary - i][end].circle.getColor()[1],
                        this.m[boundary - i][end].circle.getColor()[2]);
                    this.m[boundary - i][end].circle.setColor(
                        this.m[start][boundary - i].circle.getColor()[0],
                        this.m[start][boundary - i].circle.getColor()[1],
                        this.m[start][boundary - i].circle.getColor()[2]);
                    this.m[start][boundary - i].circle.setColor(
                        tmp[0],
                        tmp[1],
                        tmp[2]);
                } else {
                    tmp = this.m[i][start].circle.getColor();
                    this.m[i][start].circle.setColor(
                        this.m[start][boundary - i].circle.getColor()[0],
                        this.m[start][boundary - i].circle.getColor()[1],
                        this.m[start][boundary - i].circle.getColor()[2]);
                    this.m[start][boundary - i].circle.setColor(
                        this.m[boundary - i][end].circle.getColor()[0],
                        this.m[boundary - i][end].circle.getColor()[1],
                        this.m[boundary - i][end].circle.getColor()[2]);
                    this.m[boundary - i][end].circle.setColor(
                        this.m[end][i].circle.getColor()[0],
                        this.m[end][i].circle.getColor()[1],
                        this.m[end][i].circle.getColor()[2]);
                    this.m[end][i].circle.setColor(
                        tmp[0],
                        tmp[1],
                        tmp[2]);
                }
            }
        } // end loop j
    } // end of rot90

}