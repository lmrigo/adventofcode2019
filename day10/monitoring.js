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

/*
#.........
...A......
...B..a...
.EDCG....a
..F.c.b...
.....c....
..efd.c.gb
.......c..
....f...c.
...e..d..c
*/

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
      // check for sight in all lines of sight
      // 1,0 0,1 1,1 1,2 2,1 1,3 3,1 1,4 4,1 4,3 3,4

      var blocked // stop counting when blocks
      /*
      // section 1 - up down left right
      // straight right
      blocked = false
      for (var x = ast.x+1; x < rightGrid; x++) {
        if(grid[ast.y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
      }
      // straight left
      blocked = false
      for (var x = ast.x-1; x >= leftGrid; x--) {
        if(grid[ast.y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
      }
      // straight up
      blocked = false
      for (var y = ast.y-1; y >= topGrid; y--) {
        if(grid[y][ast.x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
      }
      // straight down
      blocked = false
      for (var y = ast.y+1; y < bottomGrid; y++) {
        if(grid[y][ast.x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
      }

      // section 2 - main diagonals (C) 1,1
      var x
      var y
      // right down
      blocked = false
      x = ast.x+1
      y = ast.y+1
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x++
        y++
      }
      // right up
      blocked = false
      x = ast.x+1
      y = ast.y-1
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x++
        y--
      }
      // left up
      blocked = false
      x = ast.x-1
      y = ast.y-1
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x--
        y--
      }
      // left down
      blocked = false
      x = ast.x-1
      y = ast.y+1
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x--
        y++
      }

      // section 3 - A diagonals 3,1
      // right down
      blocked = false
      x = ast.x+3
      y = ast.y+1
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=3
        y++
      }
      // right up
      blocked = false
      x = ast.x+3
      y = ast.y-1
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=3
        y--
      }
      // left up
      blocked = false
      x = ast.x-3
      y = ast.y-1
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=3
        y--
      }
      // left down
      blocked = false
      x = ast.x-3
      y = ast.y+1
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=3
        y++
      }

      // section 4 - B diagonals 3,2
      // right down
      blocked = false
      x = ast.x+3
      y = ast.y+2
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=3
        y+=2
      }
      // right up
      blocked = false
      x = ast.x+3
      y = ast.y-2
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=3
        y-=2
      }
      // left up
      blocked = false
      x = ast.x-3
      y = ast.y-2
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=3
        y-=2
      }
      // left down
      blocked = false
      x = ast.x-3
      y = ast.y+2
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=3
        y+=2
      }

      // section 5 - D diagonals 2,3
      // right down
      blocked = false
      x = ast.x+2
      y = ast.y+3
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=2
        y+=3
      }
      // right up
      blocked = false
      x = ast.x+2
      y = ast.y-3
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=2
        y-=3
      }
      // left up
      blocked = false
      x = ast.x-2
      y = ast.y-3
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=2
        y-=3
      }
      // left down
      blocked = false
      x = ast.x-2
      y = ast.y+3
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=2
        y+=3
      }

      // section 6 - E diagonals 1,3
      // right down
      blocked = false
      x = ast.x+1
      y = ast.y+3
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=1
        y+=3
      }
      // right up
      blocked = false
      x = ast.x+1
      y = ast.y-3
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=1
        y-=3
      }
      // left up
      blocked = false
      x = ast.x-1
      y = ast.y-3
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=1
        y-=3
      }
      // left down
      blocked = false
      x = ast.x-1
      y = ast.y+3
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=1
        y+=3
      }

      // section 7 - F diagonals 1,2
      // right down
      blocked = false
      x = ast.x+1
      y = ast.y+2
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=1
        y+=2
      }
      // right up
      blocked = false
      x = ast.x+1
      y = ast.y-2
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=1
        y-=2
      }
      // left up
      blocked = false
      x = ast.x-1
      y = ast.y-2
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=1
        y-=2
      }
      // left down
      blocked = false
      x = ast.x-1
      y = ast.y+2
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=1
        y+=2
      }

      // section 8 - G diagonals 4,3
      // right down
      blocked = false
      x = ast.x+4
      y = ast.y+3
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=4
        y+=3
      }
      // right up
      blocked = false
      x = ast.x+4
      y = ast.y-3
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=4
        y-=3
      }
      // left up
      blocked = false
      x = ast.x-4
      y = ast.y-3
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=4
        y-=3
      }
      // left down
      blocked = false
      x = ast.x-4
      y = ast.y+3
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=4
        y+=3
      }

      // section 9 - H diagonals 2,1
      // right down
      blocked = false
      x = ast.x+2
      y = ast.y+1
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=2
        y+=1
      }
      // right up
      blocked = false
      x = ast.x+2
      y = ast.y-1
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=2
        y-=1
      }
      // left up
      blocked = false
      x = ast.x-2
      y = ast.y-1
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=2
        y-=1
      }
      // left down
      blocked = false
      x = ast.x-2
      y = ast.y+1
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=2
        y+=1
      }

      // section 10 - I diagonals 3,4
      // right down
      blocked = false
      x = ast.x+3
      y = ast.y+4
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=3
        y+=4
      }
      // right up
      blocked = false
      x = ast.x+3
      y = ast.y-4
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=3
        y-=4
      }
      // left up
      blocked = false
      x = ast.x-3
      y = ast.y-4
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=3
        y-=4
      }
      // left down
      blocked = false
      x = ast.x-3
      y = ast.y+4
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=3
        y+=4
      }

      // section 11 - J diagonals 1,4
      // right down
      blocked = false
      x = ast.x+1
      y = ast.y+4
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=1
        y+=4
      }
      // right up
      blocked = false
      x = ast.x+1
      y = ast.y-4
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=1
        y-=4
      }
      // left up
      blocked = false
      x = ast.x-1
      y = ast.y-4
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=1
        y-=4
      }
      // left down
      blocked = false
      x = ast.x-1
      y = ast.y+4
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=1
        y+=4
      }

      // section 12 - K diagonals 4,1
      // right down
      blocked = false
      x = ast.x+4
      y = ast.y+1
      while (x < rightGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=4
        y+=1
      }
      // right up
      blocked = false
      x = ast.x+4
      y = ast.y-1
      while (x < rightGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x+=4
        y-=1
      }
      // left up
      blocked = false
      x = ast.x-4
      y = ast.y-1
      while (x >= leftGrid && y >= topGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=4
        y-=1
      }
      // left down
      blocked = false
      x = ast.x-4
      y = ast.y+1
      while (x >= leftGrid && y < bottomGrid) {
        if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
        x-=4
        y+=1
      }
      */

/*
_OOOO_OOOO_
O_O_O_O_O_O
OO_OO_OO_OO
O_O_O_O_O_O
OOOOOOOOOOO
____OXO____
OOOOOOOOOOO
O_O_O_O_O_O
OO_OO_OO_OO
O_O_O_O_O_O
_OOOO_OOOO_
*/

/*
      // all angles:
      var angles = [
        [0,1],[1,0],[1,1],[1,2],[2,1],[1,3],[3,1],[1,4],[4,1],
        [2,3],[3,2],[2,5],[5,2],[3,4],[4,3],[4,5],[5,4]
      ]

      $.each(angles, (idx, ang)=> {
        var addx = ang[0]
        var addy = ang[1]
        // right down
        blocked = false
        x = ast.x+addx
        y = ast.y+addy
        while (x < rightGrid && y < bottomGrid) {
          if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
          x+=addx
          y+=addy
        }
        // right up
        blocked = false
        x = ast.x+addx
        y = ast.y-addy
        while (x < rightGrid && y >= topGrid) {
          if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
          x+=addx
          y-=addy
        }
        // left up
        blocked = false
        x = ast.x-addx
        y = ast.y-addy
        while (x >= leftGrid && y >= topGrid) {
          if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
          x-=addx
          y-=addy
        }
        // left down
        blocked = false
        x = ast.x-addx
        y = ast.y+addy
        while (x >= leftGrid && y < bottomGrid) {
          if(grid[y][x]==='#'){if(!blocked){ast.sight++;blocked=true;}else{ast.blocked++}}
          x-=addx
          y+=addy
        }
      })
*/

      // calc all angles from ast to the rest and check if they happened already
      function angDeg(x, y) {
        return Math.atan2(y, x) * 180 / Math.PI;
      }
      var astAngles = {}
      // var astAngles = {q1:{}, q2:{}, q3:{}, q4:{}}
      $.each(asteroids, (idx2, ast2) => {
        var x = ast2.x - ast.x
        var y = ast2.y - ast.y
        if (x === 0 && y === 0) {
          return true
        }
        var ang = Math.round(angDeg(x,y) * 100) / 100
        astAngles[ang+''] = ast2
        // if (x >= 0) { // right half 0-180
        //   if (y < 0) { // Q1 top right quadrant 0-90
        //     astAngles.q1[ang+''] = ast2
        //   } else { // Q2 bottom right quadrant 90-180
        //     astAngles.q2[ang+''] = ast2
        //   }
        // } else { // left half 180-360
        //   if (y >= 0) { // Q3 bottom left quadrant 180-270
        //     astAngles.q3[ang+''] = ast2
        //   } else { // Q4 top left quadrant 270-360
        //     astAngles.q4[ang+''] = ast2
        //   }
        // }

      })
      // console.log(astAngles)
      ast.sight = Object.keys(astAngles).length

    })
    // console.log(asteroids)


    // var lessBlocks = asteroids.reduce((acc, val) => {
    //   return acc < val.blocked ? acc : val.blocked
    // }, 999)

    // var astIdx = asteroids.findIndex((el) => el.blocked === lessBlocks)
    // var result = asteroids.length - asteroids[astIdx].blocked -1

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
