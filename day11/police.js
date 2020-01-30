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

    var height = 5000
    var width = 5000
    var grid = []
    for (var y = 0; y < height; y++) {
      grid[y] = []
      for (var x = 0; x < width; x++) {
        grid[y][x] = '.'
      }
    }
    var rx = 2500
    var ry = 2500
    var rdir = 'UP'

    var com = new Computer()
    com.ints = $.map(numbers, (val => {return Number(val)}))

    var nextInput = 0
    var outputs = []
    var limit = 1000000
    while (!com.halted && --limit>0) {
      if (com.waitingInput) {
        com.processInput(nextInput)
      }
      com.execute()
      if (com.outputReady) {
        outputs.push(com.readOutput())
      }
      if (outputs.length > 1) {
        var color = outputs.shift()
        grid[ry][rx] = color
        var direction = outputs.shift()
        if (direction === 0) { // turn left
          switch (rdir) {
            case 'UP' : rdir = 'LEFT';break;
            case 'LEFT' : rdir = 'DOWN';break;
            case 'DOWN' : rdir = 'RIGHT';break;
            case 'RIGHT' : rdir = 'UP';break;
          }
        } else { // turn right
          switch (rdir) {
            case 'UP' : rdir = 'RIGHT';break;
            case 'RIGHT' : rdir = 'DOWN';break;
            case 'DOWN' : rdir = 'LEFT';break;
            case 'LEFT' : rdir = 'UP';break;
          }
        }
        switch (rdir) { // walk
          case 'UP' : ry--;break;
          case 'RIGHT' : rx++;break;
          case 'DOWN' : ry++;break;
          case 'LEFT' : rx--;break;
        }
        nextInput = grid[ry][rx] === 1 ? 1 : 0
      }
    }
    if (limit <= 0) {
      console.log('limit reached')
    }

    var result = grid.reduce((accy, valy) => {
      return accy + valy.reduce((accx, valx) => {
        return accx + (valx !== '.' ? 1 : 0)
      }, 0)
    }, 0)

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}


var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)

    var height = 5000
    var width = 5000
    var grid = []
    for (var y = 0; y < height; y++) {
      grid[y] = []
      for (var x = 0; x < width; x++) {
        grid[y][x] = '.'
      }
    }
    var rx = 2500
    var ry = 2500
    var rdir = 'UP'

    var minX = 2500
    var maxX = 2500
    var minY = 2500
    var maxY = 2500

    var com = new Computer()
    com.ints = $.map(numbers, (val => {return Number(val)}))

    var nextInput = 1
    var outputs = []
    var limit = 1000000
    while (!com.halted && --limit>0) {
      if (com.waitingInput) {
        com.processInput(nextInput)
      }
      com.execute()
      if (com.outputReady) {
        outputs.push(com.readOutput())
      }
      if (outputs.length > 1) {
        var color = outputs.shift()
        grid[ry][rx] = color
        var direction = outputs.shift()
        if (direction === 0) { // turn left
          switch (rdir) {
            case 'UP' : rdir = 'LEFT';break;
            case 'LEFT' : rdir = 'DOWN';break;
            case 'DOWN' : rdir = 'RIGHT';break;
            case 'RIGHT' : rdir = 'UP';break;
          }
        } else { // turn right
          switch (rdir) {
            case 'UP' : rdir = 'RIGHT';break;
            case 'RIGHT' : rdir = 'DOWN';break;
            case 'DOWN' : rdir = 'LEFT';break;
            case 'LEFT' : rdir = 'UP';break;
          }
        }
        switch (rdir) { // walk
          case 'UP' : {
            ry--
            minY = minY < ry ? minY : ry
            break;
          }
          case 'RIGHT' :{
            rx++
            maxX = maxX > rx ? maxX : rx
            break;
          }
          case 'DOWN' :{
            ry++
            maxY = maxY > ry ? maxY : ry
            break;
          }
          case 'LEFT' :{
            rx--
            minX = minX < rx ? minX : rx
            break;
          }
        }
        nextInput = grid[ry][rx] === 1 ? 1 : 0
      }
    }
    if (limit <= 0) {
      console.log('limit reached')
    }

    var result = ''
    for (var y = minY; y <= maxY; y++) {
      for (var x = minX; x <= maxX; x++) {
        result += grid[y][x] === 1 ? '#' : '_'
      }
      result += '\n'
    }

    console.log(result) //JFBERBUH

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result.replace(/\n/g,'<br>&emsp;'))
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
