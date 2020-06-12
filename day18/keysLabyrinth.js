var input = [
`#########
#b.A.@.a#
#########`, // 8
`########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`, // 86
`########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`, // 132
`#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`, // 136
`########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`, // 81
puzzleInput
]


var part1 = function() {

  for (var i = 3; i < input.length-2; i++) {
    var lines = input[i].split(/\n/)

    // player coords @
    var px = 0
    var py = 0
    var doorKeys = {}

    var height = lines.length
    var width = lines[0].length
    var grid = []
    for (var y = 0; y < height; y++) {
      grid[y] = []
      for (var x = 0; x < width; x++) {
        var char = lines[y][x]
        grid[y][x] = char
        if (char === '@') {
          px = x
          py = y
        } else if (char !== '.' && char !== '#') {
          doorKeys[char] = {'x':x, 'y':y}
        }
      }
    }
    // console.log(px, py, doorKeys)
    var minX = 0
    var maxX = width-1
    var minY = 0
    var maxY = height-1
    grid[py][px] = '.' // set starting position as walkable

    var shortestSteps = Number.MAX_SAFE_INTEGER

    var genState = function(st, newx, newy) {
      var newState
      var nextPos = grid[newy][newx]
      var code = nextPos.charCodeAt(0)
      //             upper alpha (A-Z)             lower alpha (a-z)
      var isletter = (65 <= code && code <= 90) || (97 <= code && code <= 122)
      if (nextPos === '.' || isletter) { // is walkable
        newState = cloneState(st)
        newState.x = newx
        newState.y = newy
        var newHistory = ';'+newState.x+','+newState.y
        if (isletter) { // is a key or door
          var isDoor = nextPos === nextPos.toUpperCase()
          if (isDoor) {
            newHistory += '|'+ nextPos
            /*
            // key not in array means already has access to door
            if (!newState.keys.includes(nextPos.toLowerCase())) {
              // do nothing?
            } else { // no access
              newState = undefined // invalidate state
            }
            */
          }/* else { // is key
            if (newState.keys.includes(nextPos)) { // new key
              // remove key from state
              var keyIdx = newState.keys.findIndex((x)=>{return x===nextPos})
              newState.keys.splice(keyIdx,1)
              // newHistory += ';'+nextPos // add key to history
              //TODO: testar: erase history here to avoid <--><-
              //newState.history = ''
              newState.lastKey = nextPos
            } else { // already has key
              // do nothing?
            }
          }*/
        }

        if (newState && !st.history.includes(newHistory)) { // is new step
          newState.history += newHistory
          newState.steps++
        } else {
          newState = undefined // invalidate state if it doesn't meet the criteria
        }
      }
      return newState
    }

    var allKeys = Object.keys(doorKeys).filter((x) => {return x === x.toLowerCase()})
    // the objective is to find distance from each key to the others
    // also need to save the keys required to reach so that later
    // it's possible to rearrange the sequence
    var keyDists = []
    // initialize keyDists
    for (var ki = 0; ki < allKeys.length; ki++) {
      var sourceK = allKeys[ki]
      if (keyDists[sourceK] === undefined) {
        keyDists[sourceK] = {}
      }
      for (var kj = 0; kj < allKeys.length; kj++) {
        var destK = allKeys[kj]
        if (keyDists[destK] === undefined) {
          keyDists[destK] = {}
        }
        keyDists[sourceK][destK] = { steps:9999, doors:[] }
      }
    }

    // this should generate data like a simetric table
    // x|a|b|c
    // a|0|1|2
    // b|1|0|3
    // c|2|3|0
    for (var ki = 0; ki < allKeys.length; ki++) {
      var sourceK = allKeys[ki]
      for (var kj = ki; kj < allKeys.length; kj++) {
        var destK = allKeys[kj]

        var initx = doorKeys[sourceK].x
        var inity = doorKeys[sourceK].y

        var initialState = {x:initx, y:inity, history:';'+initx+','+inity, steps:0}
        var nextStates = [initialState]
        var timeout = 1*100*1000
        var testMap = {}
        while (nextStates.length > 0 && --timeout) {
          var st = nextStates.shift()
          if (timeout % 10000 === 0) {
            // console.log('')
          }
          var stPos = grid[st.y][st.x]
          if (stPos === destK) { // dest key found
            if (keyDists[sourceK][destK].steps > st.steps) {
              keyDists[sourceK][destK].steps = st.steps
              keyDists[destK][sourceK].steps = st.steps

              var doors = st.history.split('').filter((x) => {
                var code = x.charCodeAt(0)
                return (65 <= code && code <= 90) // upper alpha (A-Z)
              })
              keyDists[sourceK][destK].doors = doors
              keyDists[destK][sourceK].doors = doors
            }
          } else { // genstates
            var generated = []

            var northState = genState(st, st.x, st.y-1)
            if (northState) { generated.push(northState) }
            var southState = genState(st, st.x, st.y+1)
            if (southState) { generated.push(southState) }
            var westState = genState(st, st.x-1, st.y)
            if (westState) { generated.push(westState) }
            var eastState = genState(st, st.x+1, st.y)
            if (eastState) { generated.push(eastState) }

            nextStates.push(...generated)
          }
        }
        if (timeout <= 0) {
          console.log('timeout!', nextStates.length)
        }

      }
    }
    console.log(keyDists)

    // continuar: fazer todas permutações e calcular menor caminho
    // todas permutações é muito grande

    // depois disso, excluir permutações que não respeitem chave<porta

/*

    var genState = function(st, newx, newy) {
      var newState
      var nextPos = grid[newy][newx]
      var code = nextPos.charCodeAt(0)
      //             upper alpha (A-Z)             lower alpha (a-z)
      var isletter = (65 <= code && code <= 90) || (97 <= code && code <= 122)
      if (nextPos === '.' || isletter) { // is walkable
        newState = cloneState(st)
        newState.x = newx
        newState.y = newy
        var newHistory = ';'+newState.x+','+newState.y+'|'+newState.lastKey
        if (isletter) { // is a key or door
          var isDoor = nextPos === nextPos.toUpperCase()
          if (isDoor) {
            // key not in array means already has access to door
            if (!newState.keys.includes(nextPos.toLowerCase())) {
              // do nothing?
            } else { // no access
              newState = undefined // invalidate state
            }
          } else { // is key
            if (newState.keys.includes(nextPos)) { // new key
              // remove key from state
              var keyIdx = newState.keys.findIndex((x)=>{return x===nextPos})
              newState.keys.splice(keyIdx,1)
              // newHistory += ';'+nextPos // add key to history
              //TODO: testar: erase history here to avoid <--><-
              //newState.history = ''
              newState.lastKey = nextPos
            } else { // already has key
              // do nothing?
            }
          }
        }

        if (newState && !st.history.includes(newHistory)) { // is new step
          newState.history += newHistory
          newState.steps++
        } else {
          newState = undefined // invalidate state if it doesn't meet the criteria
        }
      }
      return newState
    }

    var initialState = {x:px, y:py, history:';'+px+','+py+'|', steps:0, keys:allKeys, lastKey:''}
    var nextStates = [initialState]
    var timeout = 1*100*1000
    var poporshift = true // t=shift;f=pop
    while (nextStates.length > 0 && --timeout) {
      //TODO: o melhor jeito é fazer os menores caminhos entre todas as keys e a posicao incial
      var st = poporshift ? nextStates.shift() : nextStates.pop()
      if (timeout % 10000 === 0) {
        // poporshift = !poporshift
      }
      if (st.keys.length === 0) { // all keys found
        if (shortestSteps > st.steps) {
          shortestSteps = st.steps
          console.log(shortestSteps)
        }
      } else { // genstates
        var generated = []

        var northState = genState(st, st.x, st.y-1)
        if (northState) { generated.push(northState) }
        var southState = genState(st, st.x, st.y+1)
        if (southState) { generated.push(southState) }
        var westState = genState(st, st.x-1, st.y)
        if (westState) { generated.push(westState) }
        var eastState = genState(st, st.x+1, st.y)
        if (eastState) { generated.push(eastState) }

        nextStates.push(...generated)
      }
    }
    if (timeout <= 0) {
      console.log('timeout!', nextStates.length)
    }
*/
    // printGrid(grid, minX, maxX, minY, maxY)

    var result = shortestSteps

    $('#part1').append(input[i].replace(/\n/g,'<br/>'))
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var result = 0

    $('#part2').append(input[i].replace(/\n/g,'<br/>'))
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}


/*var cloneState = function(st) {
  var clone = {
    x: st.x,
    y: st.y,
    history: st.history,
    steps: st.steps,
    keys: st.keys.slice(),
    lastKey: st.lastKey
  }
  return clone
}*/
var cloneState = function(st) {
  var clone = {
    x: st.x,
    y: st.y,
    history: st.history,
    steps: st.steps
  }
  return clone
}


var printGrid = function(grid, minX, maxX, minY, maxY) {
  var str = ''
  for (var y = minY; y <= maxY; y++) {
    for (var x = minX; x <= maxX; x++) {
      str += grid[y][x] === undefined ? '_' : grid[y][x]
    }
    str += '\n'
  }
  // console.log(str)
  return str
}


var printPath = function(grid, st) {
  var gridP = []
  for (var y = 0; y < grid.length; y++) {
    gridP[y] = []
    for (var x = 0; x < grid[y].length; x++) {
      gridP[y][x] = grid[y][x]
    }
  }
  var path = st.history.split(/;|\|/).filter((x)=>{return x.includes(',')})
  $.each(path, (idx, val) => {
    var coord = val.split(',')
    var x = Number(coord[0])
    var y = Number(coord[1])
    if (!isNaN(Number(gridP[y][x]))) {
      gridP[y][x] = '' + (Number(gridP[y][x])+1)
    } else {
      gridP[y][x] = '1'
    }

  })
  return printGrid(gridP, 0, gridP[0].length-1, 0, gridP.length-1)
}

$(function (){
  $('#main').append('<div id="part1"><h2>part 1</h2></div>')
  part1()
  $('#main').append('<br><div id="part2"><h2>part 2</h2></div>')
  part2()
  $('#main').append('<br>')
})
