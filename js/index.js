import "./app.css"

console.log('creating worker')
const worker = new Worker('./worker.js')

const draw = document.getElementById('draw')
const preset = document.getElementById('preset')
const form = document.getElementById('simulation')
const reset = document.getElementById('reset')
const canvas = document.querySelector('canvas')

draw.onclick = function(event) {
  const dot = document.createElement('div')
  dot.className = 'dot'
  dot.style = `top: ${event.offsetY}px; left: ${event.offsetX}px;`
  dot.setAttribute('data-x', event.offsetX)
  dot.setAttribute('data-y', event.offsetY)
  draw.appendChild(dot)
}

preset.onclick = function(event) {
  event.preventDefault()

  const cities = [
    [269, 101],
    [458, 297],
    [161, 173],
    [43, 25],
    [453, 101],
    [244, 398],
    [45, 166],
    [269, 179],
    [374, 97],
    [129, 301],
    [456, 187],
    [459, 398],
    [353, 399],
    [43, 88],
    [129, 402]
  ]

  cities.forEach(c => {
    const city = document.createElement('div')
    city.className = 'dot'
    city.style = `top: ${c[1]}px; left: ${c[0]}px;`
    city.setAttribute('data-x', c[0])
    city.setAttribute('data-y', c[1])
    draw.appendChild(city)
  })

  event.target.remove()
}

form.onsubmit = function(event) {
  console.log('submit')
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
  canvas.className = 'solution'

  const ctx = canvas.getContext('2d')
  ctx.save()

  cities.map(c => {
    ctx.beginPath()
    ctx.arc(c[0], c[1], 2, 0, 2 * Math.PI, false)
    ctx.fillStyle = 'black'
    ctx.fill()
  })

  worker.postMessage({
    iterations: parseInt(iterations.value, 10),
    citiesString,
    population_size: parseInt(population_size.value, 10),
    crossover: parseFloat(crossover.value),
    mutation: parseFloat(mutation.value),
    survival: parseFloat(survival.value),
    type: 'simulation'
  })

  worker.onmessage = function(msg) {
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

    reset.className = 'reset'
  }
}

reset.onclick = function() {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.className = 'hidden'
  reset.className = 'hidden'
  form.className = ''
}
