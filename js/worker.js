import("../crate/pkg").then(({ Simulation }) => {

  onmessage = function(msg) {
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

    self.postMessage({
      path: result[0],
      fitness: result[1]
    })
  }
})
