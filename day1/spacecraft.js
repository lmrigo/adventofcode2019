var input = [
  `12
  14
  1969
  100756`
  ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\s+/)
    var mass = $.map(numbers, (val => {return Number(val)}))

    var fuel = []
    for (var m = 0; m < mass.length; m++) {
      fuel[m] = Math.floor(mass[m] / 3) - 2
      // console.log(fuel[m])
    }

    var fuelSum = fuel.reduce((acc, val) => {
      return acc + val
    }, 0)
    // console.log(fuelSum)
    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(fuelSum)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\s+/)
    var nums = $.map(numbers, (val => {return Number(val)}))
    var frequency = 0
    var pastFreqs = { 0: true }
    var twice = undefined
    while (twice === undefined) {
      for (var n = 0; n < nums.length; n++) {
        frequency += nums[n];
        if (pastFreqs[frequency]) {
          twice = frequency
          break;
        } else {
          pastFreqs[frequency] = true
        }
      }
    }

    // console.log(pastFreqs)
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(twice)
      .append('<br>')
  }

}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  // part2()
  $('#main').append('<br>')
})
