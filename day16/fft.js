var input = [
'12345678',
'80871224585914546619083218645595',
'19617804207202209144916044189917',
'69317163492948606335995924319873',
puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split('')
    var signal = $.map(numbers, (x) => {return Number(x)})

    var patternBase = [0, 1, 0, -1]
    var phase = 0

    var maxPhases = i==0?4:100

    while (phase < maxPhases) {
      var rounds = []
      var matrix = []
      for (var r = 0; r < signal.length; r++) {
        var roundPattern = []
        var pidx = 0
        while (roundPattern.length < signal.length+1) {
          for (var rj=0; rj<=r; rj++) { //tá passando do len maximo
            roundPattern.push(patternBase[pidx])
          }
          pidx = (pidx + 1) % patternBase.length
        }
        roundPattern.shift()
        // console.log(roundPattern)
        matrix[r] = []
        for (var n = 0; n < signal.length; n++) {
          matrix[r][n] = signal[n] * roundPattern[n]
        }
      }
      // console.log(matrix)

      for (var r = 0; r < signal.length; r++) {
        var roundSum = matrix[rounds.length].reduce((acc,val) => {
          return acc + val
        })
        rounds[rounds.length] = Number((roundSum + '').substr(-1,1))
      }
      // console.log(rounds)

      // console.log('new signal', Number(rounds.join('')))
      signal = rounds
      phase++
    }

    var output = signal.slice(0,8).join('')

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(output)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append()
      .append('<br>')
  }
}

var printGrid = function(grid, minX, maxX, minY, maxY) {
  var str = ''
  for (var y = minY; y <= maxY; y++) {
    for (var x = minX; x <= maxX; x++) {
      str += grid[y][x] === undefined ? '_' : grid[y][x]
    }
    str += '\n'
  }
  console.log(str)
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
