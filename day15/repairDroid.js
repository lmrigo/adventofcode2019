var input = [
puzzleInput
]

var Computer = function () {
  this.ints = []
  this.pc = 0
  this.halted = false
  this.waitingInput = false
  this.inMode = 0
  this.outputReady = false
  this.outMode = 0
  this.relativeBase = 0
  this.execute = function() {
    var fullop = this.ints[this.pc]
    var op = fullop % 100
    var amode = Math.floor((fullop / 100) % 10);
    var bmode = Math.floor((fullop / 1000) % 10);
    var cmode = Math.floor((fullop / 10000) % 10);

    if (op === 1) { // sum
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[this.calcAddress(c, cmode)] = this.calcValue(a, amode) + this.calcValue(b, bmode)
      this.pc += 4
    } else if (op === 2) { // multiply
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[this.calcAddress(c, cmode)] = this.calcValue(a, amode) * this.calcValue(b, bmode)
      this.pc += 4
    } else if (op === 3) { // input
      this.waitingInput = true
      this.inMode = amode
      // call processInput from outside
    } else if (op === 4) { // output
      this.outputReady = true
      this.outMode = amode
      // call readOutput from outside
    } else if (op === 5) { // jump-if-true
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      if (this.calcValue(a, amode) !== 0) {
        this.pc = this.calcValue(b, bmode)
      } else {
        this.pc += 3
      }
    } else if (op === 6) { // jump-if-false
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      if (this.calcValue(a, amode) === 0) {
        this.pc = this.calcValue(b, bmode)
      } else {
        this.pc += 3
      }
    } else if (op === 7) { // less-than
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[this.calcAddress(c, cmode)] = this.calcValue(a, amode) < this.calcValue(b, bmode) ? 1 : 0
      this.pc += 4
    } else if (op === 8) { // equals
      var a = this.ints[this.pc+1]
      var b = this.ints[this.pc+2]
      var c = this.ints[this.pc+3]
      this.ints[this.calcAddress(c, cmode)] = this.calcValue(a, amode) === this.calcValue(b, bmode) ? 1 : 0
      this.pc += 4
    } else if (op === 9) { // update relative base
      var a = this.ints[this.pc+1]
      this.relativeBase += this.calcValue(a, amode)
      this.pc += 2
    } else if (op === 99) { // HALT
      this.halted = true
    } else {
      console.log('exception exception exception')
      this.halted = true
    }
  }
  this.processInput = function(val) {
    var a = this.ints[this.pc+1]
    this.ints[this.calcAddress(a, this.inMode)] = val
    this.pc += 2
    this.waitingInput = false
  }
  this.readOutput = function() {
    var a = this.ints[this.pc+1]
    var outVal = this.calcValue(a, this.outMode)
    this.pc += 2
    this.outputReady = false
    return outVal
  }
  this.calcValue = function(value, mode) {
    var retVal
    if (mode === 0) {
      retVal = this.ints[value]
    } else if (mode === 1) {
      retVal = value
    } else { // 2
      retVal = this.ints[value + this.relativeBase]
    }
    return retVal === undefined ? 0 : retVal
  }
  this.calcAddress = function(value, mode) {
    if (mode === 2) {
      return value + this.relativeBase
    } else {
      return value
    }
  }
}

const NORTH = 1
const SOUTH = 2
const WEST = 3
const EAST = 4

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)

    var height = 50
    var width = 50
    var grid = []
    for (var y = 0; y < height; y++) {
      grid[y] = []
      for (var x = 0; x < width; x++) {
        grid[y][x] = '_'
      }
    }
    var minX = 0
    var maxX = width-1
    var minY = 0
    var maxY = height-1
    // printGrid(grid, minX, maxX, minY, maxY)

    var dx = width / 2
    var dy = height / 2
    grid[dy][dx] = 'D'

    var com = new Computer()
    com.ints = $.map(numbers, (val => {return Number(val)}))

    var rx = dx
    var ry = dy
    var initialWalk = true
    var oxygenFound = false
    var ox = -1
    var oy = -1
    var comInput = NORTH
    var outputs = []
    var limit = 2000000
    while (!oxygenFound && !com.halted && --limit>0) {
      if (com.waitingInput) {
        com.processInput(comInput)
      }
      com.execute()
      if (com.outputReady) {
        outputs.push(com.readOutput())
      }
      if (outputs.length >= 1) {
        var status = outputs.shift()
        switch (status) {
          case 0 : { // wall
            switch(comInput) {
              case NORTH: grid[ry-1][rx] = '#';break;
              case SOUTH: grid[ry+1][rx] = '#';break;
              case WEST: grid[ry][rx-1] = '#';break;
              case EAST: grid[ry][rx+1] = '#';break;
            }
            break;
          }
          case 1 : { // empty
            switch(comInput) {
              case NORTH: ry--;break;
              case SOUTH: ry++;break;
              case WEST: rx--;break;
              case EAST: rx++;break;
            }
            grid[ry][rx] = '.';
            break;
          }
          case 2 : { // oxygen
            switch(comInput) {
              case NORTH: ry--;break;
              case SOUTH: ry++;break;
              case WEST: rx--;break;
              case EAST: rx++;break;
            }
            // grid[ry][rx] = 'O';
            // oxygenFound = true
            grid[ry][rx] = '.';
            ox = rx
            oy = ry
            break;
          }
        }
        minX = minX < rx ? minX : rx
        maxX = maxX > rx ? maxX : rx
        minY = minY < ry ? minY : ry
        maxY = maxY > ry ? maxY : ry


        if (initialWalk) { // walk until northern wall is found
          initialWalk = !isWall(grid, rx, ry, NORTH)
          if (initialWalk) {
            comInput = NORTH
          } else {
            comInput = EAST
          }
        } else {
          // use left hand rule (follow a path with a wall on left always)
          // decide next direction based on previous output, which had a wall on left
          var roboDir = calcDirections(comInput)
          if (isNewPath(grid, rx, ry, roboDir.left)) { //check left wall
            comInput = roboDir.left
          } else if (isWall(grid, rx, ry, roboDir.left)
              && isNewPath(grid, rx, ry, roboDir.fwd)) { // wall on left, clear front
            comInput = roboDir.fwd
          } else if (isWall(grid, rx, ry, roboDir.left)
              && isWall(grid, rx, ry, roboDir.fwd)
              && isNewPath(grid, rx, ry, roboDir.right)) { // wall on left, fwd, clear right
            comInput = roboDir.right
          } else if (isWall(grid, rx, ry, roboDir.left)
              && isWall(grid, rx, ry, roboDir.fwd)
              && isPath(grid, rx, ry, roboDir.right)) { // wall on left, fwd, clear pathed right
            comInput = roboDir.right
          } else if (isWall(grid, rx, ry, roboDir.left)
              && isPath(grid, rx, ry, roboDir.fwd)) { // wall on left, clear pathed front
            comInput = roboDir.fwd
          } else if (isPath(grid, rx, ry, roboDir.left)) { // clear pathed left
            comInput = roboDir.left
          } else {
            comInput = roboDir.right
            // console.log("o que fazer?")
          }
        }
        // dirToString(comInput)
      }
    }
    if (limit <= 0) {
      console.log('limit reached')
    }

    grid[oy][ox] = 'O'
    printGrid(grid, minX, maxX, minY, maxY)

    //BFS on grid and serach for shortest path from D to O

    var shortestDist = Number.MAX_SAFE_INTEGER

    var initialState = {x:dx,y:dy,history:dx+','+dy,steps:0}
    var nextStates = [initialState]
    var timeout = 1*1*1000
    while (nextStates.length > 0 && --timeout) {
      var st = nextStates.shift()
      if (st.x===ox && st.y===oy) { // found oxygen
        if (shortestDist > st.steps) {
          shortestDist = st.steps
        }
      } else { // genstates
        // north
        if (st.y-1 >= 0 // within boundary
          && '.DO'.includes(grid[st.y-1][st.x]) // is pathable
          && !st.history.includes(';'+st.x+','+(st.y-1))) { // new step
          var northState = cloneState(st)
          northState.y--
          northState.history += ';'+northState.x+','+northState.y
          northState.steps++
          nextStates.push(northState)
        }
        // east
        if (st.x+1 < width
          && '.DO'.includes(grid[st.y][st.x+1])
          && !st.history.includes(';'+(st.x+1)+','+st.y)) {
          var eastState = cloneState(st)
          eastState.x++
          eastState.history += ';'+eastState.x+','+eastState.y
          eastState.steps++
          nextStates.push(eastState)
        }
        // south
        if (st.y+1 < height
          && '.DO'.includes(grid[st.y+1][st.x])
          && !st.history.includes(';'+st.x+','+(st.y+1))) {
          var southState = cloneState(st)
          southState.y++
          southState.history += ';'+southState.x+','+southState.y
          southState.steps++
          nextStates.push(southState)
        }
        // west
        if (st.x-1 >= 0
          && '.DO'.includes(grid[st.y][st.x-1])
          && !st.history.includes(';'+(st.x-1)+','+st.y)) {
          var westState = cloneState(st)
          westState.x--
          westState.history += ';'+westState.x+','+westState.y
          westState.steps++
          nextStates.push(westState)
        }
      }
    }
    if (timeout <= 0) {
      console.log('timeout!')
    }

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(shortestDist)
      .append('<br>')
  }
}

var cloneState = function(st) {
  var clone = {
    x: st.x,
    y: st.y,
    history: st.history,
    steps: st.steps
  }
  return clone
}

/*
__________________________________________________
__________________________________________________
__________________________________________________
__________________________________________________
_____#####_###########_#####_###_###########______
____#.....#...........#.....#...#...........#_____
_____##.#.#######.###.#.###.#.#.###########.#_____
____#...#.#.....#.#...#.#...#.#.........#...#_____
____#.###.#.###.#.###.#.#.###.#########.#.#.#_____
____#.#.#.#.#...#...#...#.#.....#.......#.#.#_____
____#.#.#.#.#.#####.#####.#.#####.#######.#.#_____
____#.#.....#.#.....#.....#.#.....#.......#.#_____
____#.#######.#.#####.#####.#.#####.#######.#_____
____#.......#...#...#...#...#...#...#.......#_____
____#.#####.#####.#.###.#.#####.###.#.######______
____#.....#.#.#...#...#.#.#.....#...#.#.....#_____
_____######.#.#.#.#####.#.#.#####.###.#.###.#_____
____#...#...#.#.#.......#.#.....#.#.#.#.#...#_____
____#.#.#.###.#.#########.#####.#.#.#.#.#.##______
____#.#...#...#.#...#...#...#...#.#...#.#...#_____
____#.#######.#.#.#.#.#####.#.###.#.#######.#_____
____#...#...#...#.#...#.....#.#...#.#.....#.#_____
____#.#.#.#.#.###.#.###.#####.###.#.#.###.#.#_____
____#.#...#.#.#...#.#.......#.#...#...#.#.#.#_____
_____######.#.#.###.#.#####.#.#.#######.#.#.#_____
____#.......#.#...#.#...#D#.#.#.#...#...#.#.#_____
____#.#######.###.#####.#.###.#.###.#.#.#.#.#_____
____#...#...#...#.#.....#.#...#...#...#.#.#.#_____
____#.#.###.###.#.#.#####.#.#####.#.###.#.#.#_____
____#.#.#.....#...#.....#.#.#.....#.#.#...#.#_____
____#.#.#.#.#####.#####.#.#.###.###.#.#####.#_____
____#.#.#.#.#.....#.....#...#...#.#...#...#.#_____
____#.#.#.###.#####.#########.###.###.#.#.#.#_____
____#.#.#...#...#...#.....#.....#.....#.#.#.#_____
_____##.###.#.###.#####.#.###.#.#.#####.#.#.#_____
____#...#...#.#...#.....#...#.#.#.#.....#.#.#_____
____#.###.###.#.#####.#####.###.#.#.###.#.#.#_____
____#.#O......#.....#.#...#.....#.#...#.#...#_____
____#.########_####.#.#.#.#######.###.#.###.#_____
____#.#.......#...#.#...#.#.#...#.#...#...#.#_____
____#.#.#####.#.#.#.#.###.#.#.#.#.#####.#.#.#_____
____#.#.#...#.#.#.#.#.#...#...#...#...#.#.#.#_____
____#.#.###.#.#.#.#.###.###.#######.#.###.#.#_____
____#.......#...#.......#...........#.....#.#_____
_____#######_###_#######_###########_#####_#______
__________________________________________________
__________________________________________________
__________________________________________________
__________________________________________________
__________________________________________________
*/

var calcDirections = function(dir) {
  var dirs
  switch(dir) {
    case NORTH: dirs = {fwd: NORTH, left: WEST, right: EAST};break;
    case SOUTH: dirs = {fwd: SOUTH, left: EAST, right: WEST};break;
    case WEST: dirs = {fwd: WEST, left: SOUTH, right: NORTH};break;
    case EAST: dirs = {fwd: EAST, left: NORTH, right: SOUTH};break;
  }
  return dirs
}

var isSomething = function(grid, robox, roboy, dir, obj) {
  var objFound = false
  switch(dir) {
    case NORTH: objFound = grid[roboy-1][robox]   === obj;break;
    case SOUTH: objFound = grid[roboy+1][robox]   === obj;break;
    case WEST:  objFound = grid[roboy][  robox-1] === obj;break;
    case EAST:  objFound = grid[roboy][  robox+1] === obj;break;
  }
  return objFound
}

var isWall = function(grid, robox, roboy, dir) {
  return isSomething(grid, robox, roboy, dir, '#')
}

var isNewPath = function(grid, robox, roboy, dir) {
  return isSomething(grid, robox, roboy, dir, '_')
}

var isPath = function(grid, robox, roboy, dir) {
  return isSomething(grid, robox, roboy, dir, '.')
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

var dirToString = function(dir) {
  switch(dir) {
    case NORTH: console.log('N');break;
    case SOUTH: console.log('S');break;
    case WEST:  console.log('W');break;
    case EAST:  console.log('E');break;
  }
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
