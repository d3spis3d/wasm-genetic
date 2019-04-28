import "./app.css"

const draw = document.getElementById('draw')
const form = document.getElementById('simulation')

draw.onclick = function(event) {
  const dot = document.createElement('div')
  dot.className = 'dot'
  dot.style = `top: ${event.offsetY}px; left: ${event.offsetX}px;`
  dot.setAttribute('data-x', event.offsetX)
  dot.setAttribute('data-y', event.offsetY)
  draw.appendChild(dot)
}

form.onsubmit = function(event) {
  event.preventDefault()
  const [iterations, population_size, crossover, mutation, survival] = event.target
  const draw = document.getElementById('draw')

  const cities = []
  const count = draw.children.length
  for (let c = 0; c < count; c++) {
    cities.push([draw.children[c].getAttribute('data-x'), draw.children[c].getAttribute('data-y')])
  }

  const citiesString = cities.map(c => c.join(',')).join(';')

  event.target.className = 'hidden'

  const canvas = document.querySelector('canvas')
  canvas.className = 'solution'

  const ctx = canvas.getContext('2d')

  cities.map(c => {
    ctx.beginPath()
    ctx.arc(c[0], c[1], 2, 0, 2 * Math.PI, false)
    ctx.fillStyle = 'black'
    ctx.fill()
  })

  console.log('creating worker')
  const worker = new Worker('./worker.js')
  let simStarted = false

  function startSimulation() {
    worker.postMessage({
      iterations: parseInt(iterations.value, 10),
      citiesString,
      population_size: parseInt(population_size.value, 10),
      crossover: parseFloat(crossover.value),
      mutation: parseFloat(mutation.value),
      survival: parseFloat(survival.value),
      type: 'simulation'
    })
  }

  worker.onmessage = function(msg) {
    if (!simStarted) {
      console.log('starting simulation')
      startSimulation()
      simStarted = true
      return
    }

    if (simStarted) {
      console.log('got sim results')
      console.log(msg.data)

      const { path, fitness } = msg.data

      for (let p = 0; p < path.length - 1; p++) {
        const start = cities[path[p]]
        const end = cities[path[p+1]]

        ctx.beginPath()
        ctx.moveTo(start[0], start[1])
        ctx.lineTo(end[0], end[1])
        ctx.stroke()
      }
    }
  }




}
