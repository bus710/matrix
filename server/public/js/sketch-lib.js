
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

class Circle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.h = 20;
        this.w = 20;
        this.selected = 0;
        this.hz = 0;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
        this.e = ellipse(this.x, this.y, this.h, this.w);
    }

    defaultColor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
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


class ListBox {
    constructor(name) {
        this.select = createSelect(name);
        this.select.changed(() => this.itemChanged())
        this.channel = [];
        this.select.position(0, 0);
        this.addItem('None');
    }

    addItem(item) {
        this.select.option(item);
    }

    /* This makes an item to be selected. */
    selectItem(index) {
        this.elt = new p5.Element(this.select.elt);
        if (this.elt.elt.options.length >= index) {
            this.elt.elt.options[index].selected = true;
        }
    }

    /* This returns the string if a selected item. */
    selectedItem() {
        this.elt = new p5.Element(this.select.elt);
        var selectedIndex = this.elt.elt.options.selectedIndex;
        return this.elt.elt.options[selectedIndex].value;
    }

    addChannel(channel) {
        if ((channel != null) &&
            (channel.length == 2)) {
            this.channel = channel;
        }
    }

    itemChanged() {
        var selectedIndex = this.select.elt.options.selectedIndex;
        this.elt = new p5.Element(this.select.elt);
        var selectedItem = this.elt.elt.options[selectedIndex].label;
        // console.log(selectedItem);
        if (selectedItem != 'None') {
            /* A channel for connection request - comport open request */
            // toRendererEmitter.emit(this.channel[0], selectedItem);
        } else {
            /* A channel for disconnection request - comport close request */
            // toRendererEmitter.emit(this.channel[1], 'None');
        }
    }

    hasItem(item) {
        var len = this.select.elt.options.length;

        for (var i = 0; i < len; i++) {
            var v = this.select.elt.options[i].value;
            if (v == item) {
                return true;
            }
        }
        return false;
    }

    get x() {
        return this.select.x;
    }
    set x(x) {
        this.select.x = x;
    }
    get y() {
        return this.select.y;
    }
    set y(y) {
        this.select.y = y;
    }
    position(x, y) {
        this.x = x;
        this.y = y;
        this.select.position(x, y);
    }
}

class Slider {
    constructor(name) {
        this.name = name;
        this.s = createSlider(0, 100, 0, 10);
        this.min = 0;
        this.max = 64;
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