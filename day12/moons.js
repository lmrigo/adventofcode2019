var input = [
`<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`,
`<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>`
,puzzleInput
]



var part1 = function() {

  for (var i = 0; i < input.length; i++) {
    var moonStr = input[i].split(/\n+/)

    var moons = []
    $.each(moonStr, (idx, val) => {
      var inArr = val.split(/\<|\>|\,\s|\=/)
      // 0    1    2     3    4    5    6
      //["", "x", "-1", "y", "0", "z", "2", ""]
      moons.push({
        x: Number(inArr[2]),
        y: Number(inArr[4]),
        z: Number(inArr[6]),
        vel: {
          x:0,
          y:0,
          z:0
        }
      })
    })

    var time = 0
    var maxTime = i === 0 ? 10 : (i=== 1 ? 100 : 1000)

    while (time++ < maxTime) {

      // apply gravity
      $.each(moons, (idxa, ma) => {
        $.each(moons, (idxb, mb) => {
          if (ma.x < mb.x) {
            ma.vel.x += 1
          } else if (ma.x > mb.x) {
            ma.vel.x -= 1
          } // if it's the same then it doesn't change

          if (ma.y < mb.y) {
            ma.vel.y += 1
          } else if (ma.y > mb.y) {
            ma.vel.y -= 1
          } // if it's the same then it doesn't change

          if (ma.z < mb.z) {
            ma.vel.z += 1
          } else if (ma.z > mb.z) {
            ma.vel.z -= 1
          } // if it's the same then it doesn't change
        })
      })
      // apply velocity
      $.each(moons, (idx, m) => {
        m.x += m.vel.x
        m.y += m.vel.y
        m.z += m.vel.z
      })

    }
    // console.log(moons)

    $.each(moons, (idx, m) => {
      m.pot = Math.abs(m.x) + Math.abs(m.y) + Math.abs(m.z)
      m.kin = Math.abs(m.vel.x) + Math.abs(m.vel.y) + Math.abs(m.vel.z)
    })
    var result = 0
    $.each(moons, (idx, m) => {
      result += m.pot* m.kin
    })

    $('#part1').append(escapeHTML(input[i]))
      .append('<br>&emsp;')
      .append(result)
      .append('<br>')
  }
}

function escapeHTML(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
