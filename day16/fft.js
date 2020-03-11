var input = [
'12345678',
'80871224585914546619083218645595',
'19617804207202209144916044189917',
'69317163492948606335995924319873',
puzzleInput
]

var patternBase = [0, 1, 0, -1]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split('')
    var signal = $.map(numbers, (x) => {return Number(x)})

    var phase = 0

    var maxPhases = i==0?4:100

    while (phase < maxPhases) {
      var rounds = ''

      for (var r = 0; r < signal.length; r++) {
        //TODO: refazer os rounds pra calcular signal 10000 vezes concatenado*
        var skipZeroes = r // the first "r" elements are zeroes
        var calcLine = 0
        for (var n = skipZeroes; n < signal.length; n++) {
          // talvez botar uma condição pra pular r ou r-1 elementos toda vez q acha um 0 no pattern
          var patElem = getPattern(r,n)
          if (patElem === 0) { // skip r elements whenever there's a 0
            n += r
          } else {
            calcLine += signal[n] * getPattern(r,n)
          }
        }
        rounds += (calcLine + '').substr(-1,1)
      }
      // console.log(rounds)

      signal = rounds.split('')
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

  for (var i = 1; i < input.length-3; i++) {
    var numbers = input[i].split('')
    var signal = $.map(numbers, (x) => {return Number(x)})

    var phase = 0

    var maxPhases = i==0?4:100

    while (phase < maxPhases) {
      var rounds = ''

      for (var r = 0; r < signal.length; r++) {
        //TODO: refazer os rounds pra calcular signal 10000 vezes concatenado*
        var skipZeroes = r // the first "r" elements are zeroes
        var calcLine = 0
        for (var n = skipZeroes; n < signal.length; n++) {
          // talvez botar uma condição pra pular r ou r-1 elementos toda vez q acha um 0 no pattern
          var patElem = getPattern(r,n)
          if (patElem === 0) { // skip r elements whenever there's a 0
            n += r
          } else {
            calcLine += signal[n] * getPattern(r,n)
          }
        }
        rounds += (calcLine + '').substr(-1,1)
      }
      // console.log(rounds)

      signal = rounds.split('')
      phase++
    }

    var output = signal.slice(0,8).join('')

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(output)
      .append('<br>')
  }
}

var getPattern = function(round, idx) {
  // round + 1 because first(0) round is 1 repetition, second(1) round is 2 repetitions
  // idx + 1 because requirements tell to skip the first index
  var div = ((idx+1) / (round+1)) >> 0 // integer division
  var pidx = div % 4 //patternBase.length
  return patternBase[pidx]
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
