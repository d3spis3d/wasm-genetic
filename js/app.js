import { Simulation } from "../crate/pkg/wasm_genetic"

const s = new Simulation(
  100,
  "1.0,3.0;1.0,2.0;1.0,1.0;4.0,3.0;2.0,1.0;3.0,3.0;3.0,2.0;3.0,1.0;4.0,4.0",
  100,
  0.5,
  0.01,
  0.2
)

const data = s.run()

console.log(data)
