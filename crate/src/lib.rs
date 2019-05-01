use std::fmt;

use wasm_bindgen::prelude::*;
use js_sys::Array;

use rand::Rng;
use rand::rngs::OsRng;
use rand::seq::SliceRandom;
use rand::distributions::{Distribution, Uniform};


// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub struct City {
    x: f64,
    y: f64,
}

impl City {
    pub fn new(x: f64, y: f64) -> City {
        City { x, y }
    }
}

#[derive(Clone)]
pub struct Path {
    fitness: f64,
    order: Vec<usize>
}

impl Path {
    pub fn breed(&self, other: &Path, city_list: &Vec<City>) -> Path {
        let order = Path::crossover(&self.order, &other.order);
        let fitness = Path::calculate_fitness(&order, city_list);

        Path { fitness, order }
    }

    fn crossover(mother: &Vec<usize>, father: &Vec<usize>) -> Vec<usize> {
        let mut rng = OsRng::new().unwrap();
        let crossover_point = rng.sample(Uniform::new(0, mother.len()));

        let mother_dna = &mother[0..crossover_point];
        let mut father_dna: Vec<usize> = father.iter().filter_map(|d| {
            if !mother_dna.contains(d) {
                return Some(*d)
            }
            None
        }).collect();

        let mut child = Vec::new();
        child.extend_from_slice(mother_dna);
        child.append(&mut father_dna);

        child
    }

    pub fn mutate(&mut self, city_list: &Vec<City>) {
        let mut rng = OsRng::new().unwrap();
        let point_one = rng.sample(Uniform::new(0, self.order.len()));
        let point_two = rng.sample(Uniform::new(0, self.order.len()));

        self.order.swap(point_one, point_two);
        self.fitness = Path::calculate_fitness(&self.order, &city_list);
    }

    pub fn calculate_fitness(path: &Vec<usize>, city_list: &Vec<City>) -> f64 {
        let path_length = city_list.len();
        let mut cost = 0.0;
        for i in 0..path_length - 1 {
            let a = &city_list[path[i]];
            let b = &city_list[path[i + 1]];
            cost = cost + ((a.x - b.x).powf(2.0) + (a.y - b.y).powf(2.0)).sqrt();
        }

        1.0 / cost
    }
}

impl fmt::Display for Path {
    fn fmt(& self, f: &mut fmt::Formatter) -> fmt::Result {
        let string_order: Vec<String> = self.order.iter().map(|i| i.to_string()).collect();
        write!(f, "Fitness: {}, Path: {}", self.fitness, string_order.join("->"))
    }
}

#[wasm_bindgen]
pub struct Simulation {
    population: Vec<Path>,
    city_list: Vec<City>,
    max_iterations: usize,
    crossover_rate: f64,
    mutation_rate: f64,
    survival_rate: f64,
}

#[wasm_bindgen]
impl Simulation {
    #[wasm_bindgen(constructor)]
    pub fn new(
        population_size: usize,
        city_list: String,
        max_iterations: usize,
        crossover_rate: f64,
        mutation_rate: f64,
        survival_rate: f64,
    ) -> Simulation {
        let parsed_city_list = Simulation::parse_city_list(city_list);
        Simulation {
            population: Simulation::initial_population(&parsed_city_list, population_size),
            city_list: parsed_city_list,
            max_iterations,
            crossover_rate,
            mutation_rate,
            survival_rate,
        }
    }

    pub fn run(&mut self) -> Array {
        let mut fittest = self.find_fittest();
        println!("starting iterations");
        // print_generation(&self.population);

        for _ in 0..self.max_iterations {
            self.generate_next_generation();

            let challenger = self.find_fittest();
            if challenger.fitness > fittest.fitness {
                fittest = challenger;
            }
        }

        let array = js_sys::Array::new();
        let order = js_sys::Array::new();
        for o in fittest.order {
            order.push(&JsValue::from(o as u32));
        }

        array.push(&order);
        array.push(&JsValue::from(fittest.fitness));

        array
    }

    fn find_fittest(&self) -> Path {
        let mut fittest = &self.population[0];

        for i in 1..self.population.len() {
            let p = &self.population[i];
            if p.fitness > fittest.fitness {
                fittest = p;
            }
        }

        return fittest.clone();
    }

    fn generate_next_generation(&mut self) {
        self.population.sort_by(|a, b| b.fitness.partial_cmp(&a.fitness).unwrap());

        let breeding_count = (self.population.len() as f64 * self.crossover_rate) as usize;
        let surviving_parent_count = (breeding_count as f64 * self.survival_rate) as usize;
        let surviving_weak_count = 2;

        let mut breeding_population = Vec::new();
        breeding_population.extend_from_slice(&self.population[0..breeding_count]);

        let mut offspring = Vec::new();
        let mut rng = OsRng::new().unwrap();

        for i in 0..(self.population.len() - surviving_parent_count - surviving_weak_count) {
            let pcnt_range = Uniform::new(0, breeding_population.len());
            let rs = rng.sample(pcnt_range);
            offspring.push(
                breeding_population[i % breeding_population.len()].breed(
                    &breeding_population[rs],
                    &self.city_list
                )
            );
        }

        let mut next_generation = Vec::new();
        next_generation.extend_from_slice(&self.population[0..surviving_parent_count]);
        next_generation.append(&mut offspring);
        // Add a few weak units to keep the genetic diversity
        next_generation.extend_from_slice(
            &self.population[(self.population.len() - surviving_weak_count)..self.population.len()]
        );

        let mut rng = OsRng::new().unwrap();

        for p in 0..next_generation.len() {
            if rng.gen_bool(self.mutation_rate) {
                next_generation[p].mutate(&self.city_list);
            }
        }

        self.population = next_generation;
    }

    fn initial_population(city_list: &Vec<City>, population_count: usize) -> Vec<Path> {
        let base_list: Vec<usize> = (0..city_list.len()).collect();
        let mut population = Vec::new();

        for _ in 0..population_count {
            let mut p = base_list.clone();
            let mut rng = OsRng::new().unwrap();
            p.shuffle(&mut rng);
            let fitness = Path::calculate_fitness(&p, city_list);

            population.push(Path { fitness, order: p });
        }

        population
    }

    fn parse_city_list(city_list: String) -> Vec<City> {
        let cities: Vec<City> = city_list.split(";").map(|c| {
            let coords: Vec<&str> = c.split(",").collect();
            City {
                x: coords[0].parse::<f64>().unwrap(),
                y: coords[1].parse::<f64>().unwrap(),
            }
        }).collect();

        cities
    }
}
