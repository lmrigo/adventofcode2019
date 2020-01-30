var input = [
`.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##`,
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

var bestAsteroid = []

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
            sight:0
          })
        }
      }
    }
    // console.log(grid)
    // console.log(grid[4][3])

    $.each(asteroids, (idx, ast) => {

      // calc all angles from ast to the rest and check if they happened already
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
    var best = asteroids.findIndex((elem) => {return elem.sight === result})
    bestAsteroid.push(asteroids[best])

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}


var part2 = function () {

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
            sight:0
          })
        }
      }
    }
    // console.log(grid)
    // console.log(grid[4][3])

    var ast = bestAsteroid[i]

    var bestIdx = asteroids.findIndex((elem) => {
      return elem.x === ast.x && elem.y === ast.y
    })
    asteroids.splice(bestIdx,1)

    var destroyed = 0
    var twoHundredAsts = undefined
    while (asteroids.length > 0) {

      var astAngles = {}
      $.each(asteroids, (idx2, ast2) => {
        var x = ast2.x - ast.x
        var y = ast2.y - ast.y
        var ang = Math.round((angDeg(x,y)+90) * 100) / 100
        var key = ang+''
        if (astAngles[key] === undefined) {
          astAngles[key] = ast2
        } else {
          var cur = astAngles[key]
          // store closer to ast (best)
          var curDist = Math.abs(cur.x - ast.x) + Math.abs(cur.y - ast.y)
          var ast2Dist = Math.abs(x) + Math.abs(y)
          if (ast2Dist < curDist) {
            astAngles[key] = ast2
          }
        }
      })

      if (destroyed+Object.keys(astAngles).length >= 200) {
        twoHundredAsts = astAngles
        break;
      }
      // console.log(astAngles)
      destroyed += Object.keys(astAngles).length
      // console.log(destroyed)
      // remove the ones destroyed
      asteroids = asteroids.filter((astEl) => {
        var fidx = Object.values(astAngles).findIndex((angEl) => {
          return angEl.x === astEl.x && angEl.y === astEl.y
        })
        if (fidx < 0) {
          return true
        }
      })
    }

    // console.log(i + '=' + destroyed)
    var finalAst = undefined
    if (twoHundredAsts) {
      // sort by angle clockwise 0->360
      var angles = Object.keys(astAngles)
      angles.sort((a,b)=>{
        var numA = Number(a)
        if (numA < 0) {
          numA += 360
        }
        var numB = Number(b)
        if (numB < 0) {
          numB += 360
        }
        return numA-numB
      })
      // calc 200th
      var finalIdx = 200 - destroyed - 1 // -1 because 1st is index 0
      // // remove 1 by 1 and count
      $.each(angles, (idx,ang) => {
        if (idx < finalIdx) {
          return true
        }
        finalAst = twoHundredAsts[ang]
        return false
      })
    }

    var result = 0
    if (finalAst) {
      result = (finalAst.x*100) + finalAst.y
    }

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

function angDeg(x, y) {
  return Math.atan2(y, x) * 180 / Math.PI;
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
