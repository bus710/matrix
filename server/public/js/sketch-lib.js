
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
        if ((r == 0) && (g == 0) && (b == 0)) {
            this.r = 255;
            this.g = 255;
            this.b = 255;
        } else {
            this.r = r;
            this.g = g;
            this.b = b;
        }
        this.a = 255
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
                    location: [i, j]};
                this.m[i][j].circle.setColor(0,0,0);
            }
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setMode(m){
        if ((m != 'All') && 
            (m != 'Partial') && 
            (m != 'Single')) {
            this.mode = 'All';
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

    checkSelectedCircle(x, y) {
        /* If there was a touch/click, 
            the mode should be changed to single 
            regardless of the action's accuracy. */
        if (this.mode == 'All') {
            this.mode = 'Single';
        }

        if (this.mode == 'Single') {
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
                }
            }
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
}