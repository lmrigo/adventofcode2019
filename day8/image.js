var input = [
`123456789012`
  ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var arrInput = input[i].split('')

    var width = i === 0 ? 3 : 25
    var height = i === 0 ? 2 : 6

    var layers = []
    var l = 0
    var layerSize = width*height
    while (arrInput.length > 0) {
      layers[l] = []
      for (var px = 0; px < layerSize; px++) {
        layers[l].push(arrInput.shift())
      }
      l++
    }
    // console.log(layers)

    // find the layer that contains the fewest 0 digits
    var fewestZeroIdx = -1
    var fewestZero = 99999
    for (var lr = 0; lr < layers.length; lr++) {
      var zeroCount = layers[lr].reduce((acc, val) => {
        return acc + (val === '0' ? 1 : 0)
      }, 0)
      if (zeroCount < fewestZero) {
        fewestZero = zeroCount
        fewestZeroIdx = lr
      }
    }
    // console.log(fewestZeroIdx, fewestZero)

    // On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
    var oneCount = layers[fewestZeroIdx].reduce((acc, val) => {
        return acc + (val === '1' ? 1 : 0)
    }, 0)
    var twoCount = layers[fewestZeroIdx].reduce((acc, val) => {
        return acc + (val === '2' ? 1 : 0)
    }, 0)

    var result = oneCount * twoCount

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}


var part2 = function () {


  for (var i = 0; i < input.length; i++) {
    var orbitsInput = input[i].split(/\s+/)

    var shortestPath = 3

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
