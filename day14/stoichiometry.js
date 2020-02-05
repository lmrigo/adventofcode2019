var input = [
`10 ORE => 10 A
1 ORE => 1 B
7 A, 1 B => 1 C
7 A, 1 C => 1 D
7 A, 1 D => 1 E
7 A, 1 E => 1 FUEL`, //31
`9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`, //165
`157 ORE => 5 NZVS
165 ORE => 6 DCFZ
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ
179 ORE => 7 PSHF
177 ORE => 5 HKGWZ
7 DCFZ, 7 PSHF => 2 XJWVT
165 ORE => 2 GPVTF
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`, //13312
`2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG
17 NVRVD, 3 JNWZP => 8 VPVL
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM
139 ORE => 4 NVRVD
144 ORE => 7 JNWZP
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV
145 ORE => 6 MNCFX
1 NVRVD => 8 CXFTF
1 VJHF, 6 MNCFX => 4 RFSQX
176 ORE => 6 VJHF`, //180697
`171 ORE => 8 CNZTR
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH
14 VRPVC => 6 BMBT
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW
5 BMBT => 4 WPTQ
189 ORE => 9 KTJDG
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP
12 VRPVC, 27 CNZTR => 2 XDBXC
15 KTJDG, 12 BHXH => 5 XCVML
3 BHXH, 2 VRPVC => 7 MZWV
121 ORE => 7 VRPVC
7 XCVML => 6 RJRHP
5 BHXH, 4 VRPVC => 5 LTCX` //2210736
,puzzleInput
]

var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var reactionsStr = input[i].split(/\n+/)

    var reactions = []
    $.each(reactionsStr, (idx, val) => {
      var inArr = val.split(/\,\s|\s/)
      // 7 A, 1 B => 1 C
      //["7", "A", "1", "B", "=>", "1", "C"]
      //  0    1    2    3    4     5    6
      var react = {id:idx, in:[], out:undefined}
      for (var a = 0; a < inArr.length; a++) {
        if (inArr[a] === '=>') {
          react.out = {num:Number(inArr[++a]), chem:inArr[++a]}
        } else {
          var num = Number(inArr[a++])
          var chem = inArr[a]
          react.in.push({num:num, chem:chem})
        }
      }
      reactions.push(react)
    })
    // console.log(reactions)

    var fuelReact = reactions.find((el) => {
      return el.out.chem === 'FUEL'
    })

    var stock = {}

    // root
    var reactTree = {
      name: fuelReact.out.chem,
      out: fuelReact.out,
      in: fuelReact.in,
      parent: null,
      children: []
    }

    // node queue to add to tree
    var nodesToAdd = [reactTree]
    // while there are nodes to read
    while (nodesToAdd.length > 0) {
      var currNode = nodesToAdd.shift()
      stock[currNode.name] = 0
      // read nodes and remove from input list
      var childrenToAdd = reactions.filter((react) => {
        return currNode.in.findIndex((el) => {
          return el.chem === react.out.chem
        }) > -1
      })
      // add all children to parent and to node queue
      while (childrenToAdd && childrenToAdd.length > 0) {
        var react = childrenToAdd.shift()
        var child = {
          name: react.out.chem,
          out: react.out,
          in: react.in,
          parent: react.out.chem,
          children: []
        }
        currNode.children.push(child)
        nodesToAdd.push(child)
      }
    }
    // console.log(reactTree)
    // console.log(stock)

    var initOre = 100000000

    stock['ORE'] = initOre
    var reactQ = []
    reactQ.push(fuelReact)
    while (stock['FUEL'] === 0) {
      var cur = reactQ.shift()
      // check if has stock for all inputs
      var missing = []
      $.each(cur.in, (idx, inchem) => {
        if (stock[inchem.chem] >= inchem.num) { // has in stock
          return true // continue
        } else {
          missing.push(inchem)
        }
      })
      if (missing.length <= 0) { // has all inputs
        // consume all inputs
        $.each(cur.in, (idx, inchem) => {
          stock[inchem.chem] -= inchem.num
        })
        // produce output
        stock[cur.out.chem] += cur.out.num
      } else { // produce the missing
        $.each(missing, (idx, miss) => {
          var missReact = reactions.find((el) => {
            return el.out.chem === miss.chem
          })
          if (missReact === undefined) {
            console.log('error!',miss)
          }
          var missIdx = reactQ.findIndex((el) => {
            return missReact.id === el.id
          })
          if (missIdx < 0) { // only add if it's not already on queue
            reactQ.push(missReact)
          }
        })
        // add back the current reaction
        reactQ.push(cur)
      }
    }
    console.log(stock)

    var result = initOre - stock['ORE']

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

/*
var calcOre = function (node) {
  if (node.children.length === 0) { // default
    if (node.in.length > 1) {
      console.log ('isso nao ta certo', node.in)
    } else {
      // should be ORE
      return node.in[0].num
    }
  } else { // children
    var sum = 0
    $.each(node.children, (idx, child) => {
      sum += calcOre(child)
    })
    return sum
  }
}
*/

var part2 = function () {

  for (var i = 0; i < input.length; i++) {
    var moonStr = input[i].split(/\n+/)

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
