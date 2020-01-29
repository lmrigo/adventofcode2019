var input = [
`109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99`,
`1102,34915192,34915192,7,4,7,99,0`,
`104,1125899906842624,99`
  ,puzzleInput
]

var input2 = [
``
  ,puzzleInput
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

    var com = new Computer()
    com.ints = $.map(numbers, (val => {return Number(val)}))

    var outputs = []
    var limit = 10000
    while (!com.halted && --limit>0) {
      if (com.waitingInput) {
        com.processInput(1) // part 1 input
      }
      if (com.outputReady) {
        outputs.push(com.readOutput())
      }
      com.execute()
    }
    if (limit <= 0) {
      console.log('limit reached')
    }

    var keycode = outputs.join(' ')

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(keycode)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)

    var com = new Computer()
    com.ints = $.map(numbers, (val => {return Number(val)}))

    var outputs = []
    var limit = 1000000
    while (!com.halted && --limit>0) {
      if (com.waitingInput) {
        com.processInput(2) // part 2 input
      }
      if (com.outputReady) {
        outputs.push(com.readOutput())
      }
      com.execute()
    }
    if (limit <= 0) {
      console.log('limit reached')
    }

    var keycode = outputs.join(' ')

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(keycode)
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
