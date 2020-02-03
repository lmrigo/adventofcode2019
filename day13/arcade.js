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


var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)

    var height = 500
    var width = 500
    var grid = []
    for (var y = 0; y < height; y++) {
      grid[y] = []
      for (var x = 0; x < width; x++) {
        grid[y][x] = '.'
      }
    }
    var minX = 0
    var maxX = width
    var minY = 0
    var maxY = height

    var com = new Computer()
    com.ints = $.map(numbers, (val => {return Number(val)}))

    var nextInput = 0
    var outputs = []
    var limit = 100000
    while (!com.halted && --limit>0) {
      if (com.waitingInput) {
        com.processInput(nextInput)
      }
      com.execute()
      if (com.outputReady) {
        outputs.push(com.readOutput())
      }
      if (outputs.length >= 3) {
        var x = outputs.shift()
        var y = outputs.shift()
        var tileId = outputs.shift()
        switch (tileId) {
          case 0 : grid[y][x] = ',';break; // empty
          case 1 : grid[y][x] = '|';break; // wall
          case 2 : grid[y][x] = '#';break; // block
          case 3 : grid[y][x] = '_';break; // horizontal paddle
          case 4 : grid[y][x] = 'O';break; // ball
        }
        minX = minX < x ? minX : x
        maxX = maxX > x ? maxX : x
        minY = minY < y ? minY : y
        maxY = maxY > y ? maxY : y
      }
    }
    if (limit <= 0) {
      console.log('limit reached')
    }

    var result = 0
    for (var y = minY; y <= maxY; y++) {
      if (grid[y] === undefined) {
        grid[y] = []
      }
      for (var x = minX; x <= maxX; x++) {
        result += grid[y][x] === '#' ? 1 : 0
      }
    }

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}


var part2 = function () {

  for (var i = 0; i < input.length; i++) {

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append()
      .append('<br>')
  }
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
