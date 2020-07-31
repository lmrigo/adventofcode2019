var input = [
puzzleInput
]

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

var height = 50
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

    var comInputlist = []
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        comInputlist.push(x)
        comInputlist.push(y)
      }
    }

    while (comInputlist.length > 0) {

      var com = new Computer()
      com.ints = $.map(numbers, (val => {return Number(val)}))

      var inA = comInputlist.shift()
      var inB = comInputlist.shift()
      var comInput = inA
      var rx = 0
      var ry = 0
      var outputs = []
      var limit = 100000
      while (!com.halted && --limit>0) {
        if (com.waitingInput) {
          com.processInput(comInput)
          comInput = inB
          // console.log('input expected')
        }
        com.execute()
        if (com.outputReady) {
          outputs.push(com.readOutput())
        }
      }
      if (limit <= 0) {
        console.log('limit reached')
      }
      if (outputs.length >= 1) {
        var status = outputs.shift()
        grid[inA][inB] = status === 0 ? '.' : '#'
        // console.log(outputs)
      }

    }
    // printGrid(grid, minX, maxX, minY, maxY)

    // count #
    var result = grid.reduce((accy,valy) => {
      return accy + valy.reduce((accx,valx) => {
        return accx + (valx === '#' ? 1 : 0)
      },0)
    },0)

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)

    // reset grid to part 2 size
    height = 1200
    width = 1200
    for (var x = 0; x < width; x++) {
      grid[x] = []
      for (var y = 0; y < height; y++) {
        grid[x][y] = '_'
      }
    }
    maxX = width-1
    maxY = height-1

    // printGrid(grid, minX, maxX, minY, maxY)

    var comInputlist = []
    for (var x = 0; x < width; x++) {
      for (var y = x+(Math.floor(x/7)); y < (Math.ceil(x*1.5)); y++) {
        comInputlist.push(x)
        comInputlist.push(y)
      }
    }

    while (comInputlist.length > 0) {

      var com = new Computer()
      com.ints = $.map(numbers, (val => {return Number(val)}))

      var inA = comInputlist.shift()
      var inB = comInputlist.shift()
      var comInput = inA
      var rx = 0
      var ry = 0
      var outputs = []
      var limit = 100000
      while (!com.halted && --limit>0) {
        if (com.waitingInput) {
          com.processInput(comInput)
          comInput = inB
          // console.log('input expected')
        }
        com.execute()
        if (com.outputReady) {
          outputs.push(com.readOutput())
        }
      }
      if (limit <= 0) {
        console.log('limit reached')
      }
      if (outputs.length >= 1) {
        var status = outputs.shift()
        grid[inA][inB] = status === 0 ? '.' : '#'
        // console.log(outputs)
      }

    }

    var squareSide = 100-1
    var cutoff = 500

    var targetX = -1
    var targetY = -1
    for (var x = cutoff; x < width-squareSide; x++) {
      for (var y = x+(Math.floor(x/7)); y < (Math.ceil(x*1.5)); y++) {
        if (grid[x][y] === '#') {
          if (grid[x+squareSide][y] === '#') {
            if (grid[x][y+squareSide] === '#') {
              targetX = x
              targetY = y
              break;
            } else {
              break;
            }
          }
        }
      }
      if (targetX > 0) {
        break;
      }
    }

    //point's X coordinate, multiply it by 10000, then add the point's Y coordinate
    // console.log(targetX, targetY)
    // console.log((targetX + squareSide), targetY + squareSide)
    grid[targetX][targetY] = 'O'
    grid[targetX+squareSide][targetY+squareSide] = 'O'

    // printGrid(grid, cutoff, maxX, cutoff, maxY)

    var result = (targetX * 10000) + targetY

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
