var input = [
`1002,4,3,4,33`,
`1101,100,-1,4,0`
  ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)
    var ints = $.map(numbers, (val => {return Number(val)}))

    var testIn = 1

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
        console.log(testOut)
        pc += 2
      } else if (op === 99) { // HALT
        pc = -999
      } else {
        console.log('exception exception exception')
        break;
      }
    }

    var diagnosticCode = ints[0]


    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(diagnosticCode)
      .append('<br>')
  }
}


var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var range = input[i].split(/\-+/)

    var validPasswords = 0

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(validPasswords)
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
