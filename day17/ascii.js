var input = [
puzzleInput
]

/*
..#..........
..#..........
#######...###
#.#...#...#.#
#############
..#...#...#..
..#####...^..

  |     |
  V     V

..#..........
..#..........
##O####...###
#.#...#...#.#
##O###O###O##
..#...#...#..
..#####...^..
*/


var Computer = function () {
  this.ints = []
  this.pc = 0
  this.halted = false
  this.waitingInput = false
  this.inMode = 0
  this.outputReady = false
  this.outMode = 0
  this.relativeBase = 0
  this.execute = function() {
    var fullop = this.ints[this.pc]
    var op = fullop % 100
    var amode = Math.floor((fullop / 100) % 10);
    var bmode = Math.floor((fullop / 1000) % 10);
    var cmode = Math.floor((fullop / 10000) % 10);

    if (op === 1) { // sum
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[this.calcAddress(c, cmode)] = this.calcValue(a, amode) + this.calcValue(b, bmode)
      this.pc += 4
    } else if (op === 2) { // multiply
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[this.calcAddress(c, cmode)] = this.calcValue(a, amode) * this.calcValue(b, bmode)
      this.pc += 4
    } else if (op === 3) { // input
      this.waitingInput = true
      this.inMode = amode
      // call processInput from outside
    } else if (op === 4) { // output
      this.outputReady = true
      this.outMode = amode
      // call readOutput from outside
    } else if (op === 5) { // jump-if-true
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      if (this.calcValue(a, amode) !== 0) {
        this.pc = this.calcValue(b, bmode)
      } else {
        this.pc += 3
      }
    } else if (op === 6) { // jump-if-false
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      if (this.calcValue(a, amode) === 0) {
        this.pc = this.calcValue(b, bmode)
      } else {
        this.pc += 3
      }
    } else if (op === 7) { // less-than
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[this.calcAddress(c, cmode)] = this.calcValue(a, amode) < this.calcValue(b, bmode) ? 1 : 0
      this.pc += 4
    } else if (op === 8) { // equals
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[this.calcAddress(c, cmode)] = this.calcValue(a, amode) === this.calcValue(b, bmode) ? 1 : 0
      this.pc += 4
    } else if (op === 9) { // update relative base
      var a = this.ints[this.pc+1]
      this.relativeBase += this.calcValue(a, amode)
      this.pc += 2
    } else if (op === 99) { // HALT
      this.halted = true
    } else {
      console.log('exception exception exception')
      this.halted = true
    }
  }
  this.processInput = function(val) {
    var a = this.ints[this.pc+1]
    this.ints[this.calcAddress(a, this.inMode)] = val
    this.pc += 2
    this.waitingInput = false
  }
  this.readOutput = function() {
    var a = this.ints[this.pc+1]
    var outVal = this.calcValue(a, this.outMode)
    this.pc += 2
    this.outputReady = false
    return outVal
  }
  this.calcValue = function(value, mode) {
    var retVal
    if (mode === 0) {
      retVal = this.ints[value]
    } else if (mode === 1) {
      retVal = value
    } else { // 2
      retVal = this.ints[value + this.relativeBase]
    }
    return retVal === undefined ? 0 : retVal
  }
  this.calcAddress = function(value, mode) {
    if (mode === 2) {
      return value + this.relativeBase
    } else {
      return value
    }
  }
}

var height = 152
var width = 50
var grid = []
for (var y = 0; y < height; y++) {
  grid[y] = []
  for (var x = 0; x < width; x++) {
    grid[y][x] = '_'
  }
}
var minX = 0
var maxX = width-1
var minY = 0
var maxY = height-1

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)

    // grid extracted to global
    // printGrid(grid, minX, maxX, minY, maxY)

    var com = new Computer()
    com.ints = $.map(numbers, (val => {return Number(val)}))

    var rx = 0
    var ry = 0
    var comInput = 'null'
    var outputs = []
    var limit = 100000
    while (!com.halted && --limit>0) {
      if (com.waitingInput) {
        com.processInput(comInput)
        console.log('input expected')
      }
      com.execute()
      if (com.outputReady) {
        outputs.push(com.readOutput())
      }
      if (outputs.length >= 1) {
        var ascii = outputs.shift()
        var char = String.fromCharCode(ascii)
        if (char === '\n') {
          ry++
          rx=0
          //minY = minY < ry ? minY : ry
          maxY = maxY > ry ? maxY : ry
        } else {
          grid[ry][rx] = char
          rx++
          //minX = minX < rx ? minX : rx
          maxX = maxX > rx ? maxX : rx
        }
      }
    }
    if (limit <= 0) {
      console.log('limit reached')
    }

    // printGrid(grid, minX, maxX, minY, maxY)

    var result = 0
    // find intersections
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (grid[y][x] === '#'
          && minY < y && y < maxY
          && grid[y-1][x] === '#' && grid[y+1][x] === '#'
          && grid[y][x-1] === '#' && grid[y][x+1] === '#') {
          grid[y][x] = 'O'
          var intersectionValue = x * y
          // console.log(intersectionValue)
          result += intersectionValue
        }
      }
    }

    // printGrid(grid, minX, maxX, minY, maxY)

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)

    var com = new Computer()
    com.ints = $.map(numbers, (val => {return Number(val)}))
    com.ints[0] = 2 // part 2 specific

    var strToCmd = function (str) {
      return $.map(str.split(''), (x => {return x.charCodeAt(0)}))
    }
    // Functions
    var funMain = strToCmd('A,B,A,B,A,C,B,C,A,C\n')
    var funA = strToCmd('R,4,L,10,L,10\n')
    var funB = strToCmd('L,8,R,12,R,10,R,4\n')
    var funC = strToCmd('L,8,L,8,R,10,R,4\n')
    var continuousVideoFeed = strToCmd('n\n')

    var rx = 0
    var ry = 0
    var comInput = funMain.concat(funA,funB,funC,continuousVideoFeed)
    // console.log(comInput)
    var outputs = []
    var buffer = ''
    var lastChar = ''
    var limit = 10000000
    while (!com.halted && --limit>0) {
      if (com.waitingInput) {
        com.processInput(comInput.shift())
      }
      com.execute()
      if (com.outputReady) {
        outputs.push(com.readOutput())
      }
      if (outputs.length >= 1) {
        var ascii = outputs.shift()
        var char = ascii > 255 ? (''+ascii) : String.fromCharCode(ascii)
        if (char === '\n' && lastChar === '\n') {
          console.log(buffer)
          buffer = ''
        } else {
          buffer += char
          lastChar = char
        }
      }
    }

    if (limit <= 0) {
      console.log('limit reached')
    }

    var result = buffer

    // printGrid(grid, minX, maxX, minY, maxY)

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var printGrid = function(grid, minX, maxX, minY, maxY) {
  var str = ''
  for (var y = minY; y <= maxY; y++) {
    for (var x = minX; x <= maxX; x++) {
      str += grid[y][x] === undefined ? '_' : grid[y][x]
    }
    str += '\n'
  }
  console.log(str)
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
