import("../crate/pkg").then(({ Simulation }) => {
  console.log('worker created')

  onmessage = function(msg) {
    console.log('received worker sim message')
    const { iterations, citiesString, population_size, crossover, mutation, survival } = msg.data

    const s = new Simulation(
      iterations,
      citiesString,
      population_size,
      crossover,
      mutation,
      survival
    )

    const result = s.run()

    console.log(result)

    self.postMessage({
      type: 'simResults',
      path: result[0],
      fitness: result[1]
    })
  }
})
