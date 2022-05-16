// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRgb = hex => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

const Vector = class {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

const colors = [
    ['#3EAB62', '#C7C445', '#BF7117', '#B91919', '#61141F'],
    ['#7F82AA', '#CEA7A1', '#B53E4F', '#D466AD', '#D5C565'],
    ['#1D111B', '#1FCFCF', '#E1BB49', '#D4734C', '#CD5148'],
    ['#1F3759', '#3B5782', '#002240', '#E78B85', '#C21821'],
    ['#EBEBEB', '#8F8F8F', '#4A4A4A', '#282B2B', '#0D0D0D'],
    ['#272844', '#D9D186', '#EFD0C7', '#E36752', '#E3AB9A'],
    ['#B6CDE3', '#4B6E9C', '#7FA243', '#9B8232', '#9C5F4D'],
    ['#EDCF39', '#E0943D', '#BF4722', '#52121E', '#2A0101']
]

const newVector = (x, y) => new Vector(x, y)

const operators = ['*', '/', '+', '-']

const getRandom = bounds => Math.floor(Math.random() * bounds)

const palette = colors[getRandom(colors.length)]

const svgNameSpace = 'http://www.w3.org/2000/svg'

const windowWidth = parseInt(getComputedStyle(document.body).width)

const canvasWidth = parseInt(windowWidth / 1.7)

var grid = []

var density = getRandom(10) + 6

var sqDensity = Math.ceil(density / (getRandom(2) + 2))

var rn = getRandom(8) + 4

var space = canvasWidth / density

var sqSpace = canvasWidth / sqDensity

var offset = 1 + Math.random()

var opacity = 0.5

const getNum = () => {
    return Math.random() > 0.6 ? getRandom(25) : 225 + getRandom(20)
}

var first3 = palette.slice(0,3)
var last2 = palette.slice(3, palette.length)

var grad1 = hexToRgb(first3[getRandom(first3.length)])
var grad2 = hexToRgb(last2[getRandom(last2.length)])
 
// https://stackoverflow.com/questions/13760299/dynamic-svg-linear-gradient-when-using-javascript
var defs = document.createElementNS(svgNameSpace, 'defs')
var gradient = document.createElementNS(svgNameSpace, 'linearGradient')
var stops = [
    {
        // 'color': `rgb(${getNum()}, ${getNum()}, ${getNum()})`,
        'color': `rgb(${grad1.r}, ${grad1.g}, ${grad1.b})`,
        'offset': `${getRandom(10)}%`
    },{
        // 'color': `rgb(${getNum()}, ${getNum()}, ${getNum()})`,
        'color': `rgb(${grad2.r}, ${grad2.g}, ${grad2.b})`,
        'offset': `${90 + getRandom(10)}%`
    }
]

for (var i = 0, length = stops.length; i < length; i++) {

    // Create a <stop> element and set its offset based on the position of the for loop.
    var stop = document.createElementNS(svgNameSpace, 'stop');
    stop.setAttribute('offset', stops[i].offset);
    stop.setAttribute('stop-color', stops[i].color);

    // Add the stop to the <lineargradient> element.
    gradient.appendChild(stop);

}

gradient.id = 'Gradient'
gradient.setAttribute('gradientTransform', `rotate(${getRandom(360)})`)
defs.appendChild(gradient)

var svg = document.createElementNS(svgNameSpace, 'svg')
svg.setAttribute('height', `${canvasWidth}`)
svg.setAttribute('width', `${canvasWidth}`)
svg.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasWidth}`)
document.body.appendChild(svg)
svg.appendChild(defs)

for (y = space; y <= canvasWidth - (space / 2); y += space) {
    for (x = space; x <= canvasWidth - (space / 2); x += space) {
        grid.push(new Vector(x, y))
    }
}

// make a shape from points on the grid
var shape = []

for (j = 0; j < 6; j++) {
    let point = grid[getRandom(grid.length)]
    while(shape.includes(point)) {
        point = grid[getRandom(grid.length)]
    }
    shape.push(point)
}

var squareGrid = []

for (y = 0; y < canvasWidth - (sqSpace * 1.5); y += sqSpace) {
    for (x = 0; x <= canvasWidth - (sqSpace * 1.5); x += sqSpace) {
        squareGrid.push(new Vector(x + (sqSpace / 2), y + (sqSpace / 2)))
    }
}

const circ = (x, y, f) => {
    let ranNum = getRandom(5) + 5
    let cir = document.createElementNS(svgNameSpace, 'ellipse')
    cir.setAttribute('cx', x)
    cir.setAttribute('cy', y)
    cir.setAttribute('rx', `${space / ranNum}`)
    cir.setAttribute('fill', f)
    svg.appendChild(cir)
}

const square = (x, y, w) => {
    let ranNum = getRandom(5) + 5
    let sq = document.createElementNS(svgNameSpace, 'rect')
    let fill = palette[getRandom(palette.length)]
    let fillToRgb = hexToRgb(fill)
    sq.setAttribute('x', x)
    sq.setAttribute('y', y)
    sq.setAttribute('width', w)
    sq.setAttribute('height', w)
    sq.setAttribute('stroke', `rgba(${fillToRgb.r}, ${fillToRgb.g}, ${fillToRgb.b}, ${opacity}`)
    sq.setAttribute('fill', 'transparent')
    sq.setAttribute('stroke-width', `${space / ranNum}`)
    svg.appendChild(sq)
}

const doPath = () => {
    let p1 = shape[getRandom(shape.length)]
    let p2 = shape[getRandom(shape.length)]
    let p3 = shape[getRandom(shape.length)]
    let p4 = shape[getRandom(shape.length)]
    let dString = `M ${p1.x} ${p1.y} C ${p2.x} ${p2.y}, ${p3.x} ${p3.y}, ${p4.x} ${p4.y}`
    let path = document.createElementNS(svgNameSpace, 'path')
    path.setAttribute('d', dString)
    path.setAttribute('stroke', `${palette[getRandom(palette.length)]}`)
    path.setAttribute('stroke-width', `${Math.round(space / 4)}`)
    path.setAttribute('fill', 'transparent')
    svg.appendChild(path)
}

const makePath = (x, y) => {
    let p1 = new Vector(x + getRandom(sqSpace), y + getRandom(sqSpace))
    let p2 = new Vector(x + getRandom(sqSpace), y + getRandom(sqSpace))
    let p3 = new Vector(x + getRandom(sqSpace), y + getRandom(sqSpace))
    let p4 = new Vector(x + getRandom(sqSpace), y + getRandom(sqSpace))
    let dString = `M ${p1.x} ${p1.y} C ${p2.x} ${p2.y}, ${p3.x} ${p3.y}, ${p4.x} ${p4.y}`
    let path = document.createElementNS(svgNameSpace, 'path')
    path.setAttribute('d', dString)
    path.setAttribute('stroke', `${palette[getRandom(palette.length)]}`)
    path.setAttribute('stroke-width', `${Math.round(space / 8)}`)
    path.setAttribute('fill', 'transparent')
    svg.appendChild(path)
}

console.log(grid)

const dist = (x1, y1, x2, y2) => {
    if (x1 == x2) {
        return Math.abs(x1 - x2)
    } else if (y1 == y2) {
        return Math.abs(y1 - y2) 
    }
    return Math.hypot(Math.abs(x1 - x2), Math.abs(y1 - y2))
}

const drawPaths = () => {
    for (i = 0; i < getRandom(5) + 4; i++) {
        for (j = 0; j < 4 + getRandom(4); j++) {
            doPath()
        }
    }

    for (j = 0; j < squareGrid.length; j++) {
        makePath(squareGrid[j].x, squareGrid[j].y)
    }
}

const drawCircs = () => {
    for (i = 0; i < grid.length; i++) {
        let fToRgb = hexToRgb(palette[getRandom(palette.length)])
        let f = `rgba(${fToRgb.r}, ${fToRgb.g}, ${fToRgb.b}, ${Math.random()})`
        let x = eval(`${grid[i].x} ${operators[getRandom(operators.length)]} ${offset}`)
        let y = eval(`${grid[i].y} ${operators[getRandom(operators.length)]} ${offset}`)
        circ(
            x,
            y,
            f
        )
    }
}

const drawSquares = () => {
    
    for (i = 0; i < squareGrid.length; i++) {
        square(squareGrid[i].x, squareGrid[i].y, sqSpace)

        let current = {
            x: squareGrid[i].x,
            y: squareGrid[i].y,
            width: sqSpace
        }

        while (current.width > 0) {
            current.x += sqSpace / 8 + j
            current.y += sqSpace / 8 + j
            current.width -= (sqSpace / 8 + j) * 2
            if (current.width > 0) {
                square(current.x, current.y, current.width)
            }
        }

    }
}

const fillBg = () => {
    let sq = document.createElementNS(svgNameSpace, 'rect')
    sq.setAttribute('x', '0')
    sq.setAttribute('y', '0')
    sq.setAttribute('width', canvasWidth)
    sq.setAttribute('height', canvasWidth)
    sq.setAttribute('fill', 'url(#Gradient)')
    svg.appendChild(sq)
}

var counter = 0

fillBg()

const draw = () => {
    // drawSquares()
    drawPaths()
    drawCircs()
    drawPaths()
    drawCircs()
    drawPaths()
    // setTimeout(draw, 350)
}

// stops after eight runs instead of recursively calling the draw() function
for (i = 0; i < 8; i++) {
    draw()
}
