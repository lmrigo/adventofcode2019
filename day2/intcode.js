var input = [
  '1,9,10,3,2,3,11,0,99,30,40,50',
  '1,0,0,0,99',
  '2,3,0,3,99',
  '2,4,4,5,99,0',
  '1,1,1,4,99,5,6,0,99'
  ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)
    var ints = $.map(numbers, (val => {return Number(val)}))

    if (i === 5) { // puzzle input
      ints[1] = 12
      ints[2] = 2
    }

    var pc = 0
    while (pc >= 0) {
      var op = ints[pc]
      if (op === 1) { // sum
        var apos = ints[pc+1]
        var bpos = ints[pc+2]
        var cpos = ints[pc+3]
        ints[cpos] = ints[apos] + ints[bpos]
      } else if (op === 2) { // multiply
        var apos = ints[pc+1]
        var bpos = ints[pc+2]
        var cpos = ints[pc+3]
        ints[cpos] = ints[apos] * ints[bpos]
      } else if (op === 99) { // HALT
        pc = -999
      } else {
        console.log('exception exception exception')
      }
      pc += 4
    }

    var pos0 = ints[0]

    // console.log(pos0)
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(pos0)
      .append('<br>')
  }
}

var part2 = function () {

  var desiredOutput = 19690720

  for (var i = 5; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)

    var noun = 0
    var verb = 0
    var pos0 = 0
    for (var n = 0; n <= 99; n++) {
      noun = n
      for (var v = 0; v <= 99; v++) {
        verb = v

        var ints = $.map(numbers, (val => {return Number(val)}))
        ints[1] = noun
        ints[2] = verb

        var pc = 0
        while (pc >= 0) {
          var op = ints[pc]
          if (op === 1) { // sum
            var apos = ints[pc+1]
            var bpos = ints[pc+2]
            var cpos = ints[pc+3]
            ints[cpos] = ints[apos] + ints[bpos]
          } else if (op === 2) { // multiply
            var apos = ints[pc+1]
            var bpos = ints[pc+2]
            var cpos = ints[pc+3]
            ints[cpos] = ints[apos] * ints[bpos]
          } else if (op === 99) { // HALT
            pc = -999
          } else {
            console.log('exception exception exception')
          }
          pc += 4
        }

        pos0 = ints[0]

        if (pos0 === desiredOutput) {
          break;
        }
      }
      if (pos0 === desiredOutput) {
        break;
      }
    }

    var answer = 100 * noun + verb
    console.log(noun, verb)
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(answer)
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
