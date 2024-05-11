const canvas = document.getElementById('canvas1');
const globalSeed = Math.random();
const ctx = canvas.getContext('2d');

// ctx.lineCap = 'round';
ctx.lineWidth = 2
canvas.style.background = 'black'
console.log(ctx)


const image1 = document.getElementById('workImage')

canvas.width = image1.width;
canvas.height = image1.height;
const batman = [-240, -240, -304, -198, -374, -124, -476, 82, -476, 164, -408, 126, -342, 106, -304, 130, -284, 102, -206, 96, -4, 232, 200, 96, 278, 100, 302, 134, 338, 108, 436, 138, 468, 166, 478, 100, 368, -126, 292, -204, 236, -240, 230, -204, 206, -185, 72, -161, 71, -209, 51, -185, -1, -187, -49, -183, -77, -209, -76, -159, -210, -187, -233, -208]
var initShape = []
// initShape[0] = []
// for (let i = 0; i < batman.length / 2; i++) {
//     initShape[0].push({ x: batman[2 * i] / 2 + canvas.width / 2, y: batman[2 * i + 1] / 2 + canvas.height / 2 })
// }
initShape[0] = [{x:0,y:0},{x:canvas.width,y:0},{x:canvas.width,y:canvas.height},{x:0,y:canvas.height}]


ctx.drawImage(image1, 0, 0, canvas.width, canvas.height)
const imData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
 
cellSize = 2;
let pixels = [];
cell = {
    width: Math.floor(canvas.width / cellSize),
    height: Math.floor(canvas.height / cellSize)
}

console.log("🚀 ~ cell:", cell)


for (let x = 0; x < cell.width; x++) {
    pixels[x] = []
    for (let y = 0; y < cell.height; y++) {
        let ind = (y * cell.width * cellSize + x) * cellSize * 4
        pixels[x][y] = {
            r: imData[ind],
            g: imData[ind + 1],
            b: imData[ind + 2],
            l: (imData[ind] + imData[ind + 1] + imData[ind + 2]) / 3
        }
    }
}

console.log(pixels)
// var initShape = [
//     [{ x: 300, y: 100 }, { x: 500, y: 200 }, { x: 300, y: 300 }, { x: 100, y: 200 }],
//     [{ x: 300, y: 300 }, { x: 500, y: 200 }, { x: 500, y: 420 }, { x: 300, y: 520 }],
//     [{ x: 300, y: 300 }, { x: 300, y: 520 }, { x: 100, y: 420 }, { x: 100, y: 200 }],
// ]
canvas.addEventListener("click", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    console.log(pointInside(mousePos, initShape))
    console.log(mousePos.x + ',' + mousePos.y);
}, false);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function wiggle(t, frequency, octaves, seed) {
    function cyrb128(str) {
        var h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (var i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
    }

    function sfc32(a, b, c, d) {

        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;

    }

    var rand = (string) => { var seed = cyrb128(string); return sfc32(seed[0], seed[1], seed[2], seed[3]) }

    var R = (x) => {
        return rand(x.toString())
    }

    function mix(a, b, t) {
        return a + t * (b - a)
    }

    function hardwiggle(t = aCore.compositionTime, frequency = 1, seed = 0) {
        t *= frequency;
        a = R(Math.floor(t) + seed) * 2.0 - 1.0;
        b = R(Math.ceil(t) + seed) * 2.0 - 1.0;

        t -= Math.floor(t);

        return mix(a, b, Math.sin(t * t * Math.PI / 2.0)); // fake smooth blend
    }


    var w = 0.0;

    for (var i = 1; i <= octaves; i++) {
        f = i * i;
        w += hardwiggle(t, frequency * f, seed) / f;
    }

    return w;
}


function len(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function pointInside(point, shape) {
    // let ringRad = 200;
    // return (len(point, { x: this.width / 2, y: this.height / 2 }) < ringRad) ? 1 : 10 / len(point, { x: this.width / 2, y: this.height / 2 })

    intersection = 0;
    for (let i = 0; i < shape.length; i++) {
        a = shape[i]
        b = shape[(i != shape.length - 1) ? (i + 1) : 0];
        int = true;

        if (point.x > a.x && point.x > b.x) int = false
        else if ((point.y > a.y) == (point.y > b.y)) int = false
        else if (a.y == b.y) int = false
        else {
            k = (a.y - b.y) / (a.x - b.x);
            b0 = a.y - k * a.x
            x0 = (point.y - b0) / k
            if (point.x > x0) int = false
        }
        // if ((a.x - b.x) * (point.y - a.y) > (a.y-b.y)*(point.x - a.x)) int = false
        // console.log((a.x - b.x) * (point.y - a.y) > (a.y-b.y)*(point.x - a.x))

        if (int) intersection++
    }


    return intersection % 2
}

class Particle {


    constructor(effect) {


        this.effect = effect;
        this.cur = { x: 0, y: 0 };
        this.prev = { x: 0, y: 0 };
        this.vec = { x: 0, y: 0 }

        //         this.speed = {
        //             x: 1,
        //             y: 1
        //         };
        //         this.speedModifier = Math.random() * 3 + 1
        //         this.history = [{ x: this.x, y: this.y }];
        //         this.angle = 0;
        //         this.newAngle;
        //         this.angleCorrector = 0.2;
        //         this.maxLength = 10 * Math.random() + 10
        //         this.timer = this.maxLength * 2;
        //         this.colors = ['#123235', '#25CDA7', '#C41212']
        //         this.color = this.colors[Math.round(Math.random() * this.colors.length)]
    }
    // draw(context) {
    // }

}

class Effect {
    constructor(canvas, ctx) {

        this.context = ctx;
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = []
        this.particles[0] = []
        this.brightness = 200;
        this.brightnessModif = 0;

        this.debug = true;

        this.dotsCount = Math.floor(this.width);

        this.init()
        this.color = 'White'
        window.addEventListener('keydown', e => {
            if (e.key === 'q') this.debug = !this.debug
        })

        window.addEventListener('resize', e => {
            this.resize(e.target.innerWidth, e.target.innerHeight)
        })
    }
    drawText() {
        this.context.font = '500px Impact';
        const gradient1 = this.context.createLinearGradient(0, 0, this.width, this.height);
        gradient1.addColorStop(0.2, 'rgb(255,255,255)')
        gradient1.addColorStop(0.8, 'rgb(0,0,0)')

        const gradient2 = this.context.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.height / 2);
        gradient2.addColorStop(0.9, 'rgb(0,0,0)')
        gradient2.addColorStop(0.1, 'rgb(255,255,255)')

        this.context.fillStyle = 'White';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle'
        this.context.fillText('JS', this.width * 0.5, this.height * 0.5);
    }
    draw() {
        var miltipl = 1
        var blines = 1 * miltipl
        var rlines = 1 * miltipl
        var glines = 1 * miltipl
        var colorOffset = 0

        for (let p = this.particles.length - 1; p >= 0; p--) {
            if (this.particles[p].length > 0) {
                for (let i = 0; i < this.particles[p].length - 1; i++) {
                    this.context.beginPath()
                    this.context.moveTo(this.particles[p][i].cur.x, this.particles[p][i].cur.y)
                    this.context.lineTo(this.particles[p][i + 1].cur.x, this.particles[p][i + 1].cur.y)
                    var b = (1 / blines - ((i + iter * blines) % (this.particles[p].length / blines)) / this.particles[p].length) * blines * 100;
                    var r = (1 / rlines - ((i + 2 * colorOffset + iter * rlines) % (this.particles[p].length / rlines)) / this.particles[p].length) * rlines * 255;
                    var g = (1 / glines - ((i + colorOffset + iter * glines) % (this.particles[p].length / glines)) / this.particles[p].length) * glines * 255;

                    this.context.strokeStyle = `hsl(${p * 360 / this.particles.length},0%,100${b * (p + 1) / this.particles.length}%)`;
                    this.context.stroke()
                }
            }
        }
        this.brightness += this.brightnessModif + 1 * (Math.random() - 0.5);
        if (this.brightness >= 200 || this.brightness <= 10) this.brightnessModif = -this.brightnessModif
    }
    init() {

        // this.drawText()

        for (let shape = 0; shape < initShape.length; shape++) {
            this.particles[shape] = []
            var center = { x: 0, y: 0 };
            for (let i = 0; i < initShape[shape].length; i++) {
                center.x += initShape[shape][i].x
                center.y += initShape[shape][i].y
            }
            center.x /= initShape[shape].length
            center.y /= initShape[shape].length


            for (let i = 0; i < this.dotsCount; i++) {
                var part = new Particle(this)
                var rad = 10 + Math.random(2)
                part.cur.x = rad * Math.sin(2 * Math.PI * i / (this.dotsCount - 1)) + center.x
                part.cur.y = rad * Math.cos(2 * Math.PI * i / (this.dotsCount - 1)) + center.y


                part.prev = part.cur;

                this.particles[shape].push(part)
            }
            // console.log(this.particles[0])
            // const pixels = this.context.getImageData(0, 0, this.width, this.height).data
            // console.log(pixels)
        }

    }

    drawLine(start, end) {
        this.context.beginPath()
        this.context.moveTo(start.x, start.y)
        this.context.lineTo(end.x, end.y)
        this.context.strokeStyle = 'green'
        this.context.stroke()
    }

    drawCountur(shape) {
        this.context.beginPath()
        this.context.moveTo(shape[0].x, shape[0].y)

        this.context.strokeStyle = 'blue'
        for (let i = 0; i <= shape.length; i++) {
            this.context.lineTo(shape[i % shape.length].x, shape[i % shape.length].y)

        }
        this.context.stroke()
    }


    update() {


        // var dthreshhold = 1
        // var i1 = 100;
        // var i2 = i1 + 1;

        // while (i1 < this.particles[0].length - 4) {

        //     if (len(this.particles[0][i1].cur, this.particles[0][i2].cur) < dthreshhold) {


        //         let p = 1;
        //         while (p < this.particles.length && this.particles[p].length > 0) p++

        //         this.particles[p] = this.particles[0].slice(i1 + 2, i2 - 2)
        //         this.particles[0].splice(i1 - 10, (i2 - i1 + 10))

        //     }
        //     i2 += 1;
        //     if (i2 >= this.particles[0].length - 1) {
        //         i1 += 2;
        //         i2 = i1 + 2
        //     }
        // }




        var ithreshhold = 5;



        var relaxStep = 2
        var relaxPower = .5

        for (let p = 0; p < this.particles.length; p++) {
            if (this.particles[p].length > 1) {
                for (let partInd = 1; partInd < this.particles[p].length - 1; partInd++) {
                    this.particles[p][partInd].prev = this.particles[p][partInd].cur;
                    this.particles[p][partInd].cur.x += this.particles[p][partInd].vec.x;
                    this.particles[p][partInd].cur.y += this.particles[p][partInd].vec.y;
                }
                for (let i = 1; i < this.particles[p].length - 2; i++) {
                    if (len(this.particles[p][i].cur, this.particles[p][i + 1].cur) > ithreshhold) {
                        let newPart = new Particle(this)
                        newPart.cur = {
                            x: (this.particles[p][i].cur.x + this.particles[p][i + 1].cur.x) / 2,
                            y: (this.particles[p][i].cur.y + this.particles[p][i + 1].cur.y) / 2
                        }
                        newPart.prev = {
                            x: (this.particles[p][i].prev.x + this.particles[p][i + 1].prev.x) / 2,
                            y: (this.particles[p][i].prev.y + this.particles[p][i + 1].prev.y) / 2
                        }
                        this.particles[p].splice(i + 1, 0, newPart)
                        i += 2
                    }

                }
                for (let partInd = 0; partInd < this.particles[p].length; partInd++) {

                    var tx = 0;
                    var ty = 0;
                    for (let i = -relaxStep; i <= relaxStep; i++) {

                        var v = (partInd + i);
                        var s = (this.particles[p].length - 1);

                        var ind = (v > 0) ? (v % s) : (v % s + s)


                        tx += this.particles[p][ind].cur.x
                        ty += this.particles[p][ind].cur.y
                    }

                    this.particles[p][partInd].cur.x += relaxPower * (tx / (relaxStep * 2 + 1) - this.particles[p][partInd].cur.x)
                    this.particles[p][partInd].cur.y += relaxPower * (ty / (relaxStep * 2 + 1) - this.particles[p][partInd].cur.y)

                }


                var rthreshhold = 2;
                for (let i = 0; i < this.particles[p].length - 1; i++) {
                    if (len(this.particles[p][i].cur, this.particles[p][i + 1].cur) < rthreshhold) {
                        this.particles[p].splice(i, 1)
                        // i += 1
                    }
                }

                var vecIntStep = 6;
                for (let partInd = 0; partInd < this.particles[p].length; partInd++) {
                    var cur = this.particles[p][partInd].prev;
                    var bitanl = 2 / vecIntStep;
                    var tanl = .1

                    var bitanx = 0;
                    var bitany = 0;
                    var tanx = 0;
                    var tany = 0;
                    for (let i = -vecIntStep; i <= vecIntStep; i++) {
                        if (i != 0) {
                            var v = (partInd + i);
                            var s = (this.particles[p].length - 1);
                            var ind = (v > 0) ? (v % s) : (v % s + s)
                            var curLen = len(this.particles[p][ind].prev, cur)
                            bitanx += (this.particles[p][ind].prev.x - cur.x) / curLen
                            bitany += (this.particles[p][ind].prev.y - cur.y) / curLen
                            if (i > 0) {
                                tanx += (this.particles[p][ind].prev.x - cur.x) / curLen
                                tany += (this.particles[p][ind].prev.y - cur.y) / curLen
                            }
                        }
                    }

                    var stopThreshold = 4;
                    var minDist = 1000000;

                    for (let i = 0; i < this.particles[p].length; i++) {

                        var curDist = len(cur, this.particles[p][i].prev)
                        if (Math.abs(i - partInd) > stopThreshold) {
                            if (curDist < minDist)
                                minDist = curDist

                        }
                    }
 
                    let conv = 3;
                    let convVec = { x: 0, y: 0 }

                    for (let i = -conv; i <= conv; i++) {
                        let x = Math.min(Math.max(0, Math.floor((cur.x) / cellSize) + i), cell.width - 1);

                        for (let j = -conv; j <= conv; j++) {

                            if (i != 0 && j != 0) {
                                let y = Math.min(Math.max(0, Math.floor(cur.y / cellSize) + j), cell.height - 1);
                                convVec.x += conv/i * pixels[x][y].l / 255
                                convVec.y += conv/j * pixels[x][y].l / 255
                                // if (Math.random() < 0.00001) console.log(x,y,pixels[x][y])
                            }
                        }
                        // if (Math.random() < 0.00001) console.log(convVec)

                    }



 

                    var stopDist = ((minDist > stopThreshold) ? 1 : -1) * (pointInside(cur, initShape[p]))
                    var picInfl =.9;  


                    var vec = {
                        x: -bitanl * (bitanx - tanl * tanx  + picInfl * convVec.x) * stopDist,
                        y: -bitanl * (bitany - tanl * tany + picInfl * convVec.y) * stopDist
                    }

                    var line = 10
                    // this.drawLine(cur, { x: cur.x + line * vec.x, y: cur.y + line * vec.y })
                    this.particles[p][partInd].vec = vec;
                }
            } else { this.particles[p] = [] }
        }



 


    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.init()
    }


    render() {
        if (this.debug) {
            // this.drawGrid()
            // this.drawText()

        }


        // this.particles[0].forEach(particle => {
        //     // particle.draw(this.context);
        //     particle.update()
        // })
    }


}

const effect = new Effect(canvas, ctx);
 

var initIter = 0;
var iter = 0;
// while (initIter < 2000 && effect.particles[0].length < 20000) {
//     effect.update()
//     initIter++
//     console.log(initIter, effect.particles[0].length)

// }
var imgCounter = 0
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.draw()
    if (initIter < 1000 && effect.particles[0].length < 50000) {
        effect.update()
        for (let shape = 0; shape < initShape.length; shape++) {
            effect.drawCountur(initShape[shape])

        }
        initIter++
        console.log(initIter, effect.particles[0].length, effect.particles[0].length)

    }
    // var link = document.createElement('a');
    // link.setAttribute('download', `rope_seed_${(globalSeed * 100).toFixed()}_${imgCounter}.png`);
    // link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    // link.click();



    imgCounter++
    //     console.log('saved')
    // effect.render()
    // requestAnimationFrame(animate)

    iter++
}





setInterval(animate, 0)
