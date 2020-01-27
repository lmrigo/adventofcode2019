var input = [
`111111-111111`,
`111111-123789`
  ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var range = input[i].split(/\-+/)
    var start = Number(range[0])
    var end = Number(range[1])
    var validPasswords = 0

    for (var p = start; p <= end; p++) {
      if (checkPass(p)) {
        validPasswords++
      }
    }


    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(validPasswords)
      .append('<br>')
  }
}

var checkPass = function(pass) {
  var parr = $.map((pass+'').split(''), (val) => { return Number(val) })
  var double = false
  var crescent = true
  for (var d = 0; d < parr.length-1; d++) {
    double = double || (parr[d] === parr[d+1])
    crescent = crescent && (parr[d] <= parr[d+1])
  }

  return parr.length === 6
    &&  double
    && crescent
}

var part2 = function () {


  for (var i = 0; i < input.length; i++) {
    var wires = input[i].split(/\s+/)

    var shortestSteps = Number.MAX_SAFE_INTEGER

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(shortestSteps)
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
