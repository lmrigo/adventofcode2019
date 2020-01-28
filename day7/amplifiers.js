var input = [
`3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`,
`3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0`,
`3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`
  ,puzzleInput
]

var input2 = [
`3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`,
`3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`
  ,puzzleInput
]

var Computer = function () {
  this.ints = []
  this.pc = 0
  this.halted = false
  this.waitingInput = false
  this.outputReady = false
  this.outMode = 0
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
      this.ints[c] = (amode === 0 ? this.ints[a] : a) + (bmode === 0 ? this.ints[b] : b)
      this.pc += 4
    } else if (op === 2) { // multiply
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[c] = (amode === 0 ? this.ints[a] : a) * (bmode === 0 ? this.ints[b] : b)
      this.pc += 4
    } else if (op === 3) { // input
      this.waitingInput = true
      // call processInput from outside
    } else if (op === 4) { // output
      this.outputReady = true
      this.outMode = amode
    } else if (op === 5) { // jump-if-true
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      if ((amode === 0 ? this.ints[a] : a) !== 0) {
        this.pc = (bmode === 0 ? this.ints[b] : b)
      } else {
        this.pc += 3
      }
    } else if (op === 6) { // jump-if-false
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      if ((amode === 0 ? this.ints[a] : a) === 0) {
        this.pc = (bmode === 0 ? this.ints[b] : b)
      } else {
        this.pc += 3
      }
    } else if (op === 7) { // less-than
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[c] = (amode === 0 ? this.ints[a] : a) < (bmode === 0 ? this.ints[b] : b) ? 1 : 0
      this.pc += 4
    } else if (op === 8) { // equals
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[c] = (amode === 0 ? this.ints[a] : a) === (bmode === 0 ? this.ints[b] : b) ? 1 : 0
      this.pc += 4
    } else if (op === 99) { // HALT
      // this.pc = -999
      // this.pc += 1
      this.halted = true
    } else {
      console.log('exception exception exception')
      this.halted = true
    }
  }
  this.processInput = function(val) {
    var a = this.ints[this.pc+1]
    this.ints[a] = val
    this.pc += 2
    this.waitingInput = false
  }
  this.readOutput = function() {
    var a = this.ints[this.pc+1]
    var outVal = (this.outMode === 0 ? this.ints[a] : a)
    this.pc += 2
    this.outputReady = false
    return outVal
  }
}

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)

    var permutations = []

    //Generating permutation using Heap Algorithm
    var heapPermutation = function(array, size) {
      if (size == 1) { // finish
        permutations.push(array.join(','))
      }

      for (var i=0; i<size; i++) {
        heapPermutation(array, size-1);
        // if size is odd, swap first and last element
        if (size % 2 == 1) {
          var temp = array[0];
          array[0] = array[size-1];
          array[size-1] = temp;
        } else { // If size is even, swap ith and last element
          var temp = array[i];
          array[i] = array[size-1];
          array[size-1] = temp;
        }
      }
    }

    var amplifiers = [0,1,2,3,4]
    heapPermutation(amplifiers, amplifiers.length)

    var maxSignal = -1

    while (permutations.length > 0) {

      var phases = $.map(permutations.shift().split(','), (val => {return Number(val)})) //[1,0,4,3,2]
      var outSignals = [0]
      var inSignals = []

      while (phases.length > 0) {
        var com = new Computer()
        com.ints = $.map(numbers, (val => {return Number(val)})) // re read the program
        // prepare both inputs
        inSignals.push(phases.shift())
        inSignals.push(outSignals.shift())

        while (!com.halted && !com.outputReady) {
          com.execute()
          if (com.waitingInput) {
            com.processInput(inSignals.shift())
          }
        }
        if (com.outputReady) {
          outSignals.push(com.readOutput())
        }
      } // phases

      var amplifiedSignal = outSignals.shift()
      if (maxSignal < amplifiedSignal) {
        maxSignal = amplifiedSignal
      }
    } // permutations

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(maxSignal)
      .append('<br>')
  }
}

var part2 = function () {


  for (var i = 0; i < input2.length; i++) {
    var numbers = input2[i].split(/\,+/)

    var permutations = []
    //Generating permutation using Heap Algorithm
    var heapPermutation = function(array, size) {
      if (size == 1) { // finish
        permutations.push(array.join(','))
      }

      for (var i=0; i<size; i++) {
        heapPermutation(array, size-1);
        // if size is odd, swap first and last element
        if (size % 2 == 1) {
          var temp = array[0];
          array[0] = array[size-1];
          array[size-1] = temp;
        } else { // If size is even, swap ith and last element
          var temp = array[i];
          array[i] = array[size-1];
          array[size-1] = temp;
        }
      }
    }

    var amplifiers = [5,6,7,8,9]
    heapPermutation(amplifiers, amplifiers.length)

    var maxSignal = -1

    while (permutations.length > 0) {

      var phases = $.map(permutations.shift().split(','), (val => {return Number(val)}))
      var outSignals = [0]
      var inSignals = []
      var coms = []
      for (var ph = 0; ph < phases.length; ph++) {
        coms[ph] = new Computer()
        coms[ph].ints = $.map(numbers, (val => {return Number(val)}))
      }
      var c = 0 // current computer

      var lastOutSignal = undefined
      while (!coms[4].halted) { // until Amp E (4) halts

        // prepare both inputs
        if (phases.length > 0) {
          inSignals.push(phases.shift())
        }

        if (outSignals.length > 0) {
          lastOutSignal = outSignals.shift()
          inSignals.push(lastOutSignal)
        } // else: the previous has halted

        // execute
        while (!coms[c].halted && !coms[c].outputReady) {
          coms[c].execute()
          if (coms[c].waitingInput) {
            coms[c].processInput(inSignals.shift())
          }
        }
        if (coms[c].outputReady) {
          outSignals.push(coms[c].readOutput())
        } // else: it's a halt

        // next Amp continues execution
        c = (c + 1) % 5
      } // phases

      var amplifiedSignal = lastOutSignal
      if (maxSignal < amplifiedSignal) {
        maxSignal = amplifiedSignal
      }

    } // permutations

    $('#part2').append(input2[i])
      .append('<br>&emsp;')
      .append(maxSignal)
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
