/**
 * radar.js - Licensed under the MIT license
 * https://github.com/Linfanty
 * ----------------------------------------------
 */
window.onload = function(){
  let bg = document.getElementsByClassName('vulnerability-type-bg')

  let cos = Math.cos
  let sin = Math.sin

  let fontSize = 16

  let width = bg[0].clientWidth
  let height = bg[0].clientHeight

  // 中心点坐标
  let x = width / 2
  let y = height / 2

  // 颜色个数
  let colorLength = 5

  // 数据条数
  let dataLen = 5

  // 开始角度
  let startAngle = -Math.PI / 2

  // 半径
  let r = height / 5 * 2

  let cData = []
  let tData = []

  let tween = null
  let animationFrameId = null


  // 数据之间夹角
  let perAngle = Math.PI * 2 / dataLen

  let bgSvg = d3.select('.vulnerability-type-bg')
  let axisSvg = d3.select('.vulnerability-type-axis')
  let areaSvg = d3.select('.vulnerability-type-area')
  let labelSvg = d3.select('.vulnerability-type-label')
  var Axis = new Array()
  var getData = function () {
    // document.write(123456)
    let i = 1
    new Promise (function (resolve, reject) {
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      
      var rd = Math.random().toFixed(1)
      Axis[i++] = rd
      //document.write( Axis[i-1])

      //let Axis = '0.0/0.2/0.5/0.5/0.5'.split('/')

        return {
          name,
          //value: rd
          value: Axis[i-1]
        }
      })

      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
///////////////////////////
  var BAxis = new Array()
  var getData1 = function () {

    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      //document.write(Axis[i])
      

      if(Number(i) == Number(1))
        Axis[i] = Number(Axis[i]) + Number(0.1);
      if(Number(Axis[i]) > Number(1.0)) Axis[i] = Number(1.0)
    /*
      document.write(Axis[i])
      document.write("    ")
      document.write(BAxis[i])
      document.write('<br>')
   */
        return {
          name,
          //value: Axis[i++] + 0.5
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
///////////////////////////
var getData2 = function () {

    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {

      if(Number(i) == Number(1))
        Axis[i] = Number(Axis[i]) - Number(0.1);
      if(Number(Axis[i]) < Number(0)) Axis[i] = Number(0.0)

        return {
          name,
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
///////////////////////////

  var drawBg = function () {
    bgSvg.selectAll('g').remove()

    // 画背景
    bgSvg.append('g')
        .selectAll('path')
        .data([...Array(colorLength).keys()])
        .enter()
        .append('path')
        .attr('d', function (i) {
          let d = ''
          let currentRadius = r * (colorLength - i) / colorLength
          for (let i = 0; i < dataLen; i++) {
            let currentAngle = startAngle + perAngle * i
            d += `${i === 0 ? 'M' : 'L'}${x + currentRadius * cos(currentAngle)},${y + currentRadius * sin(currentAngle)}`
          }
          return d + 'Z'
        })
        .attr('fill', i => i === 0 ? 'rgba(48, 99, 228, 0.35)' : 'rgba(0, 0, 0, 0.2)')
        .attr('stroke', i => i === 0 ? 'rgba(48, 99, 228, 0.7)' : 'none')
        .attr('stroke-width', 1)

    // 画分割线
    bgSvg.append('g')
         .selectAll('path')
         .data([...Array(dataLen).keys()])
         .enter()
         .append('path')
         .attr('d', function (i) {
          let currentAngle = startAngle + perAngle * i
          return `M${x},${y}L${x + r * cos(currentAngle)},${y + r * sin(currentAngle)}`
         })
         .attr('stroke', 'rgba(0, 0, 0, 0.4)')
         .attr('stroke-width', 1)
  }
  
  var drawAxis = function () {
    axisSvg.selectAll('g').remove()

    // let g = axisSvg.append('g')
    let g = axisSvg.selectAll('g')
              .data(['0.00', '0.25', '0.50', '0.75', '1.00'])
              .enter()
              .append('g')
    console.log(g)
    g.append('text')
      .attr('text-anchor', 'end')
      .attr('x', function () {
        return x - 15
      })
      .attr('y', function (d, i) {
        return y - r * (i + 1) / colorLength + fontSize / 2
      })
      .style('font-size', '16px')
      .style('fill', '#56d4f2')
      .text(d => d)   
  }

  var drawData = function () {
    let start = {}
    let end = {}
    for (let i = 0; i < dataLen; i++) {
      if (tData[i]) {
        start[i] = tData[i].value
      } else {
        start[i] = 0
      }
      end[i] = cData[i].value || 0
    }

    tween = new TWEEN.Tween(start)
        .to(end, 1000)
        .onUpdate(function () {
          update(this)
        })
        .start()
        .onComplete(() => {
          tween = null
        })
    tData = cData
  } 

  var update = function (obj) {
    let arr = []
    for (let i = 0; i < dataLen; i++) {
      arr.push(obj[i])
    }
    areaSvg.selectAll('g').remove()
    areaSvg.append('g')
         .append('path')
         .attr('d', function () {
           let d = ''
           for (let i = 0; i < arr.length; i++) {
            let currentAngle = startAngle + perAngle * i
            let ra = (r / 5) +  (r * 4 / 5 * arr[i])
            d += `${i === 0 ? 'M' : 'L'}${x + ra * cos(currentAngle)},${y + ra * sin(currentAngle)}`
           }
           return d + 'Z'
         })
         .attr('fill', 'rgba(106, 227, 235, 0.2)')
         .attr('stroke', 'rgb(106, 227, 235)')
         .attr('stroke-width', 1)
    drawCircle()
  }

  var drawLabel = function () {
    let names = cData.map(function (val) {
      return val.name
    })
    labelSvg.selectAll('g').remove()
    labelSvg.selectAll('text')
            .data(names, d => d)
            .enter()
            .append('text')
            .attr('x', function (d, i) {
              let currentAngle = startAngle + perAngle * i
              return x + (r + fontSize) * cos(currentAngle)
            })
            .attr('y', function (d, i) {
              let currentAngle = startAngle + perAngle * i
              if (i !==0) {
                return y + fontSize / 2 +(r + fontSize) *sin(currentAngle) + perAngle
              }
              else {
                return y + (r + fontSize) *sin(currentAngle) + perAngle
              }
            })
            .attr('text-anchor', function (d, i) {
              if (i === 0) {
                return 'middle'
              } else if (Math.floor(dataLen / 2) > i > 0) {
                return 'start'
              } else if (i >= Math.ceil(dataLen / 2)) {
                return 'end'
              }
            })
            .text(d => d)
            .style('fill', '#56d4f2')
  }

  var drawCircle = function () {
    let arr = cData.map(function (val) {
      return val.value
    })
    let g = areaSvg.select('g').selectAll('g')
                   .data(arr)
                   .enter()
                   .append('g')
                   .attr('opacity', 0)
                   .on('mouseover', function () {
                    d3.select(this).attr('opacity', 1)
                   })
                   .on('mouseout', function () {
                    d3.select(this).attr('opacity', 0)
                   })
           
    g.append('circle')
     .attr('cx', function (d, i) {
        let currentAngle = startAngle + perAngle * i
        let ra = (r / 5) +  (r * 4 / 5 * cData[i].value)
        return x + ra * cos(currentAngle)
     })
     .attr('cy', function (d, i) {
        let currentAngle = startAngle + perAngle * i
        let ra = (r / 5) +  (r * 4 / 5 * cData[i].value)
        return y + ra * sin(currentAngle)
     })
     .attr('r', 4)
     .attr('fill', 'rgb(106, 227, 235)')

     g.append('text')
      .attr('x', function (d, i) {
        let currentAngle = startAngle + perAngle * i
        let ra = (r / 5) +  (r * 4 / 5 * cData[i].value)
        return x + ra * cos(currentAngle) + 10
     })
      .attr('y', function (d, i) {
        let currentAngle = startAngle + perAngle * i
        let ra = (r / 5) +  (r * 4 / 5 * cData[i].value)
        return y + ra * sin(currentAngle) + 4
      })
      .attr('fill', 'rgb(106, 227, 235)')
      .text(function (d, i) {
        return d
      })

  }
  var btn = document.getElementById('button')
  btn.onclick = function(){
    // document.write(3333)
    getData()
  }
  var btn1 = document.getElementById('button1')
  btn1.onclick = function(){
    // document.write(2222)
    getData1()
  }
  var btn2 = document.getElementById('button2')
  btn2.onclick = function(){
    getData2()
  }
  var btn3 = document.getElementById('button3')
  btn3.onclick = function(){
    getData3()
  }
  var btn4 = document.getElementById('button4')
  btn4.onclick = function(){
    getData4()
  }
  var btn5 = document.getElementById('button5')
  btn5.onclick = function(){
    getData5()
  }
    var btn6 = document.getElementById('button6')
  btn6.onclick = function(){
    getData6()
  }
    var btn7 = document.getElementById('button7')
  btn7.onclick = function(){
    getData7()
  }
    var btn8 = document.getElementById('button8')
  btn8.onclick = function(){
    getData8()
  }
    var btn9 = document.getElementById('button9')
  btn9.onclick = function(){
    getData9()
  }
    var btn10 = document.getElementById('button10')
  btn10.onclick = function(){
    getData10()
  }
  var startAnimate = function () {
    animationFrameId = window.requestAnimationFrame(startAnimate)
    TWEEN.update()
  }
  startAnimate()
  getData()
  drawBg()
  drawAxis()
  drawCircle()
    var getData3 = function () {
    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      if(Number(i) == Number(2))
        Axis[i] = Number(Axis[i]) + Number(0.1);
      if(Number(Axis[i]) > Number(1.0)) Axis[i] = Number(1.0)
        return {
          name,
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
  var getData4 = function () {
    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      if(Number(i) == Number(2))
        Axis[i] = Number(Axis[i]) - Number(0.1);
      if(Number(Axis[i]) < Number(0)) Axis[i] = Number(0.0)
        return {
          name,
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
    var getData5 = function () {
    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      if(Number(i) == Number(3))
        Axis[i] = Number(Axis[i]) + Number(0.1);
      if(Number(Axis[i]) > Number(1.0)) Axis[i] = Number(1.0)
        return {
          name,
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
  var getData6 = function () {
    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      if(Number(i) == Number(3))
        Axis[i] = Number(Axis[i]) - Number(0.1);
      if(Number(Axis[i]) < Number(0)) Axis[i] = Number(0.0)
        return {
          name,
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
    var getData7 = function () {
    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      if(Number(i) == Number(4))
        Axis[i] = Number(Axis[i]) + Number(0.1);
      if(Number(Axis[i]) > Number(1.0)) Axis[i] = Number(1.0)
        return {
          name,
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
  var getData8 = function () {
    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      if(Number(i) == Number(4))
        Axis[i] = Number(Axis[i]) - Number(0.1);
      if(Number(Axis[i]) < Number(0)) Axis[i] = Number(0.0)
        return {
          name,
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
    var getData9 = function () {
    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      if(Number(i) == Number(5))
        Axis[i] = Number(Axis[i]) + Number(0.1);
      if(Number(Axis[i]) > Number(1.0)) Axis[i] = Number(1.0)
        return {
          name,
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
  var getData10 = function () {
    let i = 1
    new Promise (function (resolve, reject) {  
      let names = '零维/一维/二维/三维/四维'.split('/')
      let results = names.map(name => {
      if(Number(i) == Number(5))
        Axis[i] = Number(Axis[i]) - Number(0.1);
      if(Number(Axis[i]) < Number(0)) Axis[i] = Number(0.0)
        return {
          name,
          value: Axis[i++]
        }
      })
      resolve({
        data: results
      })
    }).then(function (res) {
      let data = res.data
      cData = data
      drawData()
      drawLabel()
    })
  }
}