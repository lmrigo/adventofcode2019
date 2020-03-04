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
    // console.log(stock)

    var result = initOre - stock['ORE']

    $('#part1').append(input[i])
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

var part2 = function () {

  for (var i = 5; i < input.length; i++) {
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
    var outProxy = {}
    outProxy[fuelReact.out.chem] = fuelReact

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

        outProxy[react.out.chem] = react
      }
    }
    // console.log(reactTree)
    // console.log(stock)
    // console.log(outProxy)

    var trillionOre = 1000000000000
    var billionOre = 1000000000
    var millionOre = 1000000
    var initOre = trillionOre
    stock['ORE'] = initOre

// copy from chrome console
// paste and replace ^(\w+):\s(\d+) for stock['\1'] = \2


    /* stock after 560 bill limit */
stock['FUEL'] = 5650230
stock['ZWZQ'] = 2
stock['ZPBLH'] = 10
stock['PQZJP'] = 15
stock['MFVG'] = 26
stock['FPRFS'] = 6
stock['CQJT'] = 3
stock['LDKTQ'] = 22
stock['WLWZQ'] = 45
stock['SGDVW'] = 3
stock['CTJGD'] = 4
stock['VJSR'] = 8
stock['VWXB'] = 5
stock['MDWCG'] = 6
stock['PRCSN'] = 1
stock['BQXZ'] = 34
stock['KTXJR'] = 16
stock['NVBN'] = 0
stock['KZFZG'] = 18
stock['XDSHP'] = 0
stock['KLHS'] = 1
stock['NCRZ'] = 3
stock['WJTS'] = 0
stock['DVFD'] = 6
stock['GWXCF'] = 1
stock['QXCV'] = 0
stock['RDMDL'] = 15
stock['QPHT'] = 0
stock['VDQL'] = 6
stock['KVPK'] = 1
stock['BDGC'] = 0
stock['BQLJ'] = 3
stock['DHTNG'] = 1
stock['QMKT'] = 0
stock['VNKPF'] = 2
stock['TNXGD'] = 5
stock['CWNV'] = 12
stock['HSXW'] = 0
stock['MZQZS'] = 19
stock['TMQLD'] = 2
stock['KQFPJ'] = 5
stock['RSKH'] = 0
stock['LVZF'] = 6
stock['FLRB'] = 4
stock['FNXMV'] = 6
stock['FPKM'] = 0
stock['FWFR'] = 12
stock['SZFV'] = 4
stock['FNCN'] = 1
stock['TBVRN'] = 0
stock['TLFQZ'] = 0
stock['XBCLW'] = 0
stock['VQXCJ'] = 3
stock['QHMTL'] = 0
stock['ORE'] = 129

    var reactQ = []
    var hasOre = true
    var limit = 1*1000*1000*1000
    var zeroedAt = -1
    while (hasOre && --limit>0) {
      var cur = reactQ.shift()
      if (cur === undefined) { // produce more fuel if there's nothing else to produce
        if (Object.keys(stock).reduce((acc,val)=> {
          if (val === 'FUEL' || val === 'ORE') {
            return acc
          } else {
            return acc + stock[val]
          }
        },0) === 0) {
          if (stock['ORE'] !== initOre) {
            zeroedAt = stock['ORE']
            // console.log('zeroed',stock['ORE'], Object.keys(stock).reduce((acc,val)=> {
            //   return acc + val + ':' + stock[val] + ','
            // },''))
            break;
          }
        }
        cur = fuelReact
      }
      // check if has stock for all inputs
      var missing = []
      $.each(cur.in, (idx, inchem) => {
        if (stock[inchem.chem] >= inchem.num) { // has in stock
          return true // continue
        } else if (inchem.chem === 'ORE') { // finish when ORE runs out
          hasOre = false
          return false // break
        } else {
          missing.push(inchem)
        }
      })
      if (!hasOre) {
        break;
      }
      if (missing.length <= 0) { // has all inputs
        // consume all inputs
        $.each(cur.in, (idx, inchem) => {
          stock[inchem.chem] -= inchem.num
        })
        // produce output
        stock[cur.out.chem] += cur.out.num
      } else { // produce the missing
        $.each(missing, (idx, miss) => {
          var missReact = outProxy[miss.chem]
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
    if (limit <= 0) {
      console.log('limit reached')
    }
    var partialFuel = 0
    var oreLeft = 0
    if (zeroedAt > 0) {
      // I need this many ore to close a cycle
      var oreToZero = initOre - zeroedAt
      // with oreToZero ORE I can produce this many fuel
      var fuelToZero = stock['FUEL']
      // I can produce this many batches of fuelToZero fuel with 1 trillion ore
      var batches = Math.floor(trillionOre / oreToZero)
      partialFuel = batches * fuelToZero
      // but I still have some ore left, which is the rest of the division:
      oreLeft = trillionOre % oreToZero
      // Then I run the program again with the ore left (oreLeft)
      // and sum partial with whatever is produced with the oreleft

      /* final run with the leftover ore */
      // reset stock
      $.each(Object.keys(stock), (idx, val) => {
        stock[val] = 0
      })
      // set ore stock to ore left
      stock['ORE'] = oreLeft
      reactQ = []
      hasOre = true
      limit = 10000000
      while (hasOre && --limit>0) {
        var cur = reactQ.shift()
        if (cur === undefined) { // produce more fuel if there's nothing else to produce
          cur = fuelReact
        }
        // check if has stock for all inputs
        var missing = []
        $.each(cur.in, (idx, inchem) => {
          if (stock[inchem.chem] >= inchem.num) { // has in stock
            return true // continue
          } else if (inchem.chem === 'ORE') { // finish when ORE runs out
            hasOre = false
            return false // break
          } else {
            missing.push(inchem)
          }
        })
        if (!hasOre) {
          break;
        }
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
      if (limit <= 0) {
        console.log('second limit reached')
      }
      /* done */

    } else {
      console.log('you might need more ore!')
    }
    // console.log(stock)


    console.log(stock)

    var result = partialFuel + stock['FUEL']

    $('#part2').append(input[i])
      .append('<br>&emsp;')
      .append(result)
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
