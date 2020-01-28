var input = [
`3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`,
`3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0`,
`3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`
  ,puzzleInput
]


/*var Computer = function () {
  this.program = []
  this.pc = 0
  this.amode = 0
  this.bmode = 0
  this.cmode = 0
  this.decodeOp = function() {
    var fullop = program[this.pc]
    var op = fullop % 100
    this.amode = Math.floor((fullop / 100) % 10);
    this.bmode = Math.floor((fullop / 1000) % 10);
    this.cmode = Math.floor((fullop / 10000) % 10);
    if (op === 1) {
      this.sum()
    } else if (op === 2) { // multiply
    }
  }
  this.sum = function() {
    var a = this.program[pc+1]
    var b = this.program[pc+2]
    var c = this.program[pc+3]
    this.program[c] = (this.amode === 0 ? this.program[a] : a) + (this.bmode === 0 ? this.program[b] : b)
    this.pc += 4
  }
}*/

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)
    var ints

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
      var signals = [0]
      var intInputs = []

      while (phases.length > 0) {
        ints = $.map(numbers, (val => {return Number(val)})) // re read the program
        // prepare both inputs
        intInputs.push(phases.shift())
        intInputs.push(signals.shift())
        var pc = 0
        while (pc >= 0) {
          var fullop = ints[pc]
          var op = fullop % 100
          var amode = Math.floor((fullop / 100) % 10);
          var bmode = Math.floor((fullop / 1000) % 10);
          var cmode = Math.floor((fullop / 10000) % 10);

          if (op === 1) { // sum
            var a = ints[pc+1]
            var b = ints[pc+2]
            var c = ints[pc+3]
            ints[c] = (amode === 0 ? ints[a] : a) + (bmode === 0 ? ints[b] : b)
            pc += 4
          } else if (op === 2) { // multiply
            var a = ints[pc+1]
            var b = ints[pc+2]
            var c = ints[pc+3]
            ints[c] = (amode === 0 ? ints[a] : a) * (bmode === 0 ? ints[b] : b)
            pc += 4
          } else if (op === 3) { // input
            var a = ints[pc+1]
            ints[a] = intInputs.shift()
            pc += 2
          } else if (op === 4) { // output
            var a = ints[pc+1]
            var intOut = (amode === 0 ? ints[a] : a)
            // console.log(intOut)
            signals.push(intOut)
            pc += 2
          } else if (op === 5) { // jump-if-true
            var a = ints[pc+1]
            var b = ints[pc+2]
            if ((amode === 0 ? ints[a] : a) !== 0) {
              pc = (bmode === 0 ? ints[b] : b)
            } else {
              pc += 3
            }
          } else if (op === 6) { // jump-if-false
            var a = ints[pc+1]
            var b = ints[pc+2]
            if ((amode === 0 ? ints[a] : a) === 0) {
              pc = (bmode === 0 ? ints[b] : b)
            } else {
              pc += 3
            }
          } else if (op === 7) { // less-than
            var a = ints[pc+1]
            var b = ints[pc+2]
            var c = ints[pc+3]
            ints[c] = (amode === 0 ? ints[a] : a) < (bmode === 0 ? ints[b] : b) ? 1 : 0
            pc += 4
          } else if (op === 8) { // equals
            var a = ints[pc+1]
            var b = ints[pc+2]
            var c = ints[pc+3]
            ints[c] = (amode === 0 ? ints[a] : a) === (bmode === 0 ? ints[b] : b) ? 1 : 0
            pc += 4
          } else if (op === 99) { // HALT
            pc = -999
          } else {
            console.log('exception exception exception')
            break;
          }
        }
      }

      var amplifiedSignal = signals.shift()
      if (maxSignal < amplifiedSignal) {
        maxSignal = amplifiedSignal
      }
    }

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(maxSignal)
      .append('<br>')
  }
}


var part2 = function () {


  for (var i = 0; i < input.length; i++) {
    var orbitsInput = input[i].split(/\s+/)
    var orbitList = {}
    $.each(orbitsInput, (idx, val) => {
      var pair = val.split(')')
      if (orbitList[pair[0]] === undefined) {
        orbitList[pair[0]] = []
      }
      orbitList[pair[0]].push(pair[1])
    })
    // console.log(orbitList)

    var shortestPath = 999999

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(shortestPath)
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
