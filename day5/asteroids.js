var input = [
`1002,4,3,4,33`,
`1101,100,-1,4,0`
  ,puzzleInput
]

var input2 = [
`1002,4,3,4,33`,
`1101,100,-1,4,0`,
`3,9,8,9,10,9,4,9,99,-1,8`,
`3,9,7,9,10,9,4,9,99,-1,8`,
`3,3,1108,-1,8,3,4,3,99`,
`3,3,1107,-1,8,3,4,3,99`,
`3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9`,
`3,3,1105,-1,9,1101,0,0,12,4,12,99,1`,
`3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`
  ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)
    var ints = $.map(numbers, (val => {return Number(val)}))

    var testIn = 1
    var diagnosticCodes = []

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
        ints[a] = testIn
        pc += 2
      } else if (op === 4) { // output
        var a = ints[pc+1]
        var testOut = ints[a]
        // console.log(testOut)
        diagnosticCodes.push(testOut)
        pc += 2
      } else if (op === 99) { // HALT
        pc = -999
      } else {
        console.log('exception exception exception')
        break;
      }
    }

    var diagnosticCode = diagnosticCodes.join(',')


    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(diagnosticCode)
      .append('<br>')
  }
}


var part2 = function () {

  for (var i = 0; i < input2.length; i++) {
    var numbers = input2[i].split(/\,+/)
    var ints = $.map(numbers, (val => {return Number(val)}))

    var testIn = 5
    var diagnosticCodes = []

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
        ints[a] = testIn
        pc += 2
      } else if (op === 4) { // output
        var a = ints[pc+1]
        var testOut = (amode === 0 ? ints[a] : a)
        // console.log(testOut)
        diagnosticCodes.push(testOut)
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

    var diagnosticCode = diagnosticCodes.join(',')

    $('#part2').append(input2[i])
      .append('<br>&emsp;')
      .append(diagnosticCode)
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
