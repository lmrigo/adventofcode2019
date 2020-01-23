var input = [
`R8,U5,L5,D3
U7,R6,D4,L4`,
`R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`,
`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`
  ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var wires = input[i].split(/\s+/)

    var grid = []
    grid[0] = []
    grid[0][0] = 'O'

    var shortestDistance = Number.MAX_SAFE_INTEGER

    for (var w = 0; w < wires.length; w++) {
      var curx = 0
      var cury = 0
      var positions = wires[w].split(/\,/)
      // console.log(positions)
      $.each(positions, (idx, pos) => {
        var dir = pos.substr(0,1)
        var steps = Number(pos.substr(1))
        while (steps-- > 0) {
          switch (dir) {
            case 'U': cury++;break;
            case 'R': curx++;break;
            case 'D': cury--;break;
            case 'L': curx--;break;
            default: break;
          }
          if (grid[curx] === undefined) {
            grid[curx] = []
          }
          if (grid[curx][cury] === undefined) {
            grid[curx][cury] = ''+w
          } else if (grid[curx][cury] !== ''+w && grid[curx][cury] !== 'O') {
            grid[curx][cury] = 'X'
            var candidate = Math.abs(curx) + Math.abs(cury)
            if (candidate < shortestDistance) {
              shortestDistance = candidate
            }
          }
        }
      })
    }
    // console.log(grid)
    // console.log(printGrid(grid))


    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(shortestDistance)
      .append('<br>')
  }
}

var part2 = function () {


  for (var i = 0; i < input.length; i++) {

    var answer = 100
    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(answer)
      .append('<br>')
  }

}


var printGrid = function(grid,startX=0, startY=0, endX, endY) {
  endX = endX === undefined ? grid.length : endX
  endY = endY === undefined ? grid[0].length : endY
  var str = ''
  for (var y = startY; y < endY; y++) {
    for (var x = startX; x < endX; x++) {
      var val = grid[x][y] === undefined ? '.' : grid[x][y]
      str += val
    }
    str += '\n'
  }
  return str
}


$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
