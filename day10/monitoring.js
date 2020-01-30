var input = [
`.#..#
.....
#####
....#
...##`, //3,4 = 8
`......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`, //5,8 = 33
`#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`, //1,2 = 35
`.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`, //6,3 = 41
`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##` //11,13 = 210
  ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var lines = input[i].split(/\s+/)

    var asteroids = []

    var grid = []
    for (var l = lines.length - 1; l >= 0; l--) {
      var cols = lines[l].split('')
      grid[l] = []
      for (var c = cols.length - 1; c >= 0; c--) {
        grid[l][c] = cols[c]
        if (cols[c] === '#') {
          asteroids.push({
            x:c,
            y:l,
            sight:0,
            blocked:0
          })
        }
      }
    }
    // console.log(grid)
    // console.log(grid[4][3])

    var topGrid = 0
    var bottomGrid = grid.length
    var leftGrid = 0
    var rightGrid = grid[0].length

    $.each(asteroids, (idx, ast) => {

      // calc all angles from ast to the rest and check if they happened already
      function angDeg(x, y) {
        return Math.atan2(y, x) * 180 / Math.PI;
      }
      var astAngles = {}
      $.each(asteroids, (idx2, ast2) => {
        var x = ast2.x - ast.x
        var y = ast2.y - ast.y
        if (x === 0 && y === 0) {
          return true
        }
        var ang = Math.round(angDeg(x,y) * 100) / 100
        astAngles[ang+''] = ast2
      })
      // console.log(astAngles)
      ast.sight = Object.keys(astAngles).length

    })
    // console.log(asteroids)

    var result = asteroids.reduce((acc, val) => {
      return acc > val.sight ? acc : val.sight
    }, 0)

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
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



$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
