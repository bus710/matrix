
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
        this.socket;
    }

    addSocket(socket) {
        this.socket = socket;
    }

    /* This is a handler for the button. */
    buttonReaction() {
        switch (event.type) {
            case 'mouseup':
                // console.log(event);
                this.socket.send(
                    JSON.stringify({message: "hello server!"}))
                axios.get('/api')
                    .then(function (response) {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                break;
            default:
                // console.log(event);
                break;
        }
    }

    get x() {
        return this.button.x;
    }
    set x(x) {
        this.button.x = x;
    }
    get y() {
        return this.button.y;
    }
    set y(y) {
        this.button.y = y;
    }

    get w() {
        return this.button.width;
    }
    set w(w) {
        this.button.width = w;
    }
    get h() {
        return this.button.height;
    }
    set h(h) {
        this.button.height = h;
    }

    position(x, y) {
        this.x = x;
        this.y = y;
        this.button.position(x, y);
    }

    size(w, h) {
        this.w = w;
        this.h = h;
        this.button.size(w, h);
    }
}

class P {
    constructor(name) {
        this.name = name;
        this.p = createP(this.name);
        this.x = 0;
        this.y = 0;
    }

    position(x, y) {
        this.x = x;
        this.y = y;
        this.p.position(this.x, this.y);
    }

    makeHeader() {
        this.p.style('font-size', '40px');
        this.p.style('height', '1px');
        this.p.style('width', '500px');
        this.p.style('margin', '0px');
        this.p.style('text-align', 'justify')
    }

    makeNormal() {
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
        this.changed = 0;
        this.value = 0;
    }

    range(min, max, value) {
        this.s.elt.min = min;
        this.s.elt.max = max;
        this.s.elt.value = value;
    }

    getValue() {
        return this.s.elt.value;
    }

    setValue(v) {
        this.s.elt.value = v;
        this.value = v;
    }

    getChanged() {
        return this.changed;
    }

    clearChanged() {
        this.changed = 0;
    }

    checkChanged() {
        if (this.s.elt.value != this.value) {
            this.value = this.s.elt.value;
            this.changed = 1;
        }
    }

    get x() {
        return this.s.x;
    }
    set x(x) {
        this.s.x = x;
    }
    get y() {
        return this.s.y;
    }
    set y(y) {
        this.s.y = y;
    }

    position(x, y) {
        this.x = x;
        this.y = y;
        this.s.position(x, y);
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

    defaultColor(r, g, b) {
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

    position(x, y) {
        delete this.e;
        this.x = x;
        this.y = y;
        this.e = ellipse(this.x, this.y, this.h, this.w);
    }

    update() {
        delete this.e;
        if (this.selected) {
            stroke('black')
        } else {
            stroke('white')
        }
        fill(this.r, this.g, this.b, this.a)
        this.e = ellipse(this.x, this.y, this.h, this.w);
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
                // console.log(i, j)
                this.m[i][j] = {
                    circle: new Circle(),
                    location: [i, j]};
                this.m[i][j].circle.defaultColor(0,0,0);
            }
        }
    }

    position(x, y) {
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
    }

    update() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // console.log(i, j)
                this.m[i][j].circle.defaultColor(0,0,0);
                this.m[i][j].circle.position(this.x + 35 * i, this.y + 35 * j);
                this.m[i][j].circle.update();
            }
            this.m[2][2].circle.defaultColor(200,0,0);
            this.m[2][2].circle.update();
            this.m[4][4].circle.defaultColor(0,0,200);
            this.m[4][4].circle.update();
        }
    }

}