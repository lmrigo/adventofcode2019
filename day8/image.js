var input = [
`123456789012`
  ,puzzleInput
]

var input2 = [
`0222112222120000`
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

  for (var i = 0; i < input2.length; i++) {
    var arrInput = input2[i].split('')

    var width = i === 0 ? 2 : 25
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

    // decode image
    var image = []
    for (var lr = 0; lr < layers.length; lr++) {
      for (var px = 0; px < layers[lr].length; px++) {
        if (layers[lr][px] !== '2' && image[px] === undefined) {
          image[px] = layers[lr][px] === '0' ? '_' : '#'
        }
      }
    }
    // console.log(image)

    var result = ''
    // print image
    for (var px = 0; px < image.length; px++) {
      result += image[px]
      if ((px+1) % width === 0) {
        result += '\n'
      }
    }
    console.log(result) //JYZHF

    $('#part2').append(input2[i])
      .append('<br>&emsp;')
      .append(result.replace(/\n/g,'<br>&emsp;'))
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
