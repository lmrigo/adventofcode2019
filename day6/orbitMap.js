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

  for (var i = 0; i < input.length; i++) {
    var numbers = input[i].split(/\,+/)
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
