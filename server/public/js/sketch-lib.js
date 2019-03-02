
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
        this.p.style('font-size', '16px');
        this.p.style('height', '1px');
        this.p.style('width', '400px');
        this.p.style('margin', '0px');
        this.p.style('line-height', '1.7')
        this.p.style('text-align', 'justify')
    }
}

class Circle {
    constructor() {
        this.x = windowWidth - 17;
        this.y = windowHeight - 17;
        this.h = 20;
        this.w = 20;
        this.blinkFlag = 0;
        this.hz = 0;
    }

    blink() {
        stroke('black');
        this.hz += 1;
        if (this.hz > 30) {
            this.hz = 0;
            if (this.blinkFlag == 0) {
                this.blinkFlag = 1;
                fill('white');
            }
            else {
                this.blinkFlag = 0;
                fill('black');
            }
        }
        ellipse(this.x, this.y, this.h, this.w);
    }
}

