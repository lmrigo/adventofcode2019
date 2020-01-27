var input = [
`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`
  ,puzzleInput
]

var input2 = [
`COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`
  ,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var orbitsInput = input[i].split(/\s+/)
    var orbitList = {}
    $.each(orbitsInput, (idx, val) => {
      var pair = val.split(')')
      if (orbitList[pair[0]] === undefined) {
        orbitList[pair[0]] = []
      }
      orbitList[pair[0]].push(pair[1])
    })
    // console.log(orbitList)

    var totalOrbits = 0

    // root
    var orbitTree = {
      name : "COM",
      parent : null,
      children : [],
      val : 0
    }
    // node queue to add to tree
    var nodesToAdd = [orbitTree]
    // while there are nodes to read
    while (nodesToAdd.length > 0) {
      var currNode = nodesToAdd.shift()
      // read nodes and remove from input list
      var childrenToAdd = orbitList[currNode.name]
      delete orbitList[currNode.name]
      // add all children to parent and to node queue
      while (childrenToAdd && childrenToAdd.length > 0) {
        var childName = childrenToAdd.shift()
        var child = {
          name: childName,
          parent: currNode.name,
          children: [],
          val: currNode.val + 1
        }
        totalOrbits += child.val
        currNode.children.push(child)
        nodesToAdd.push(child)
      }
    }
    // console.log(orbitTree)


    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(totalOrbits)
      .append('<br>')
  }
}


var part2 = function () {


  for (var i = 0; i < input2.length; i++) {
    var orbitsInput = input2[i].split(/\s+/)
    var orbitList = {}
    $.each(orbitsInput, (idx, val) => {
      var pair = val.split(')')
      if (orbitList[pair[0]] === undefined) {
        orbitList[pair[0]] = []
      }
      orbitList[pair[0]].push(pair[1])
    })
    // console.log(orbitList)

    var you = undefined
    var san = undefined

    // root
    var orbitGraph = {
      name : "COM",
      neighbours : []
    }
    // node queue to add to graph
    var nodesToAdd = [orbitGraph]
    // while there are nodes to read
    while (nodesToAdd.length > 0) {
      var currNode = nodesToAdd.shift()
      // read nodes and remove from input list
      var neihgboursToAdd = orbitList[currNode.name]
      delete orbitList[currNode.name]
      // add all children to parent and to node queue
      while (neihgboursToAdd && neihgboursToAdd.length > 0) {
        var neighbourName = neihgboursToAdd.shift()
        var neighbour = {
          name: neighbourName,
          neighbours: [currNode]
        }
        if (neighbourName === "YOU") {
          you = neighbour
        }
        if (neighbourName === "SAN") {
          san = neighbour
        }
        currNode.neighbours.push(neighbour)
        nodesToAdd.push(neighbour)
      }
    }
    // console.log(orbitGraph)
    var shortestPath = 999999

    var nextStates = [{node: you, path: ''}]
    while (nextStates.length > 0) {
      var st = nextStates.shift()
      if (st.node.name === 'SAN') {
        var len = st.path.split(',').length
        if (shortestPath > len) {
          shortestPath = len
          // console.log(st.path)
        }
      } else { // gen next states
        $.each(st.node.neighbours, (idx, val) => {
          if (!st.path.includes(val.name)) {
            var newState = {
              node: val,
              path: st.path + ',' + val.name
            }
            nextStates.push(newState)
          }
        })
      }
    }
    shortestPath -= 3
    // minus 1 from the first step
    // minus 1 from the last step
    // minus 1 from the leading comma
    // ex: ,K,J,E,D,I,SAN should be J,E,D,I

    $('#part2').append(input2[i])
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
