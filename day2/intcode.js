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

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\s+/)
    var mass = $.map(numbers, (val => {return Number(val)}))

    var fuel = []
    for (var m = 0; m < mass.length; m++) {
      fuel[m] = 0
      var next = mass[m]
      while (next > 0) {
        var curFu = Math.floor(next / 3) - 2
        if (curFu > 0) {
          fuel[m] += curFu
        }
        next = curFu
      }
      // console.log(fuel[m])
    }

    var fuelSum = fuel.reduce((acc, val) => {
      return acc + val
    }, 0)
    // console.log(fuelSum)
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(fuelSum)
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
