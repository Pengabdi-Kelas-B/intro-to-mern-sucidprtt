const fs = require("fs");
const axios = require('axios').default

async function generateJsonDB() {
  // TODO: fetch data pokemon api dan buatlah JSON data sesuai dengan requirement.
  // json file bernama db.json. pastikan ketika kalian menjalankan npm run start
  // dan ketika akses url http://localhost:3000/pokemon akan muncul seluruh data
  // pokemon yang telah kalian parsing dari public api pokemon
  const pokemonApiURL = "https://pokeapi.co/api/v2/pokemon/?limit=100";

  // 1. FETCH API
  const response = await axios.get(pokemonApiURL)
  const pokemonList = response.data.results;

  // 2. Prepare to store pokemon details
  const sample = {
    "pokemon": []
  };

  // 3. Fetch detailed data for each pokemon (image, abilities, cries, evolution chains)
  for (let pokemon of pokemonList) {
    const pokemonDetailResponse = await axios.get(pokemon.url);
    const pokemonDetail = pokemonDetailResponse.data;

    // Fetch species data to get evolution chain URL
    const speciesResponse = await axios.get(pokemonDetail.species.url);
    const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

    // Fetch evolution chain details
    const evolutionChainResponse = await axios.get(evolutionChainUrl);
    const evolutionChain = getEvolutionChain(evolutionChainResponse.data.chain);

    // Construct cry URLs (replace '1' with actual id for each pokemon)
    const cryLatest = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonDetail.id}.ogg`;
    const cryLegacy = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${pokemonDetail.id}.ogg`;

    //4.  Add necessary details to the sample object
    sample.pokemon.push({
      name: pokemonDetail.name,
      id: pokemonDetail.id,
      height: pokemonDetail.height,
      weight: pokemonDetail.weight,
      image: pokemonDetail.sprites.front_default, // front image of the pokemon
      types: pokemonDetail.types.map(typeInfo => typeInfo.type.name), // list of types
      abilities: pokemonDetail.abilities.map(abilityInfo => abilityInfo.ability.name), // list of abilities
      cries: {
        latest: cryLatest,
        legacy: cryLegacy
      },
      evolutionChains: evolutionChain // renamed evolution_chain to evolutionChains
    });
  }

  // 5. Write data to db.json
  fs.writeFileSync('db.json', JSON.stringify(sample, null, 4));
}

// Helper function to parse evolution chain recursively
function getEvolutionChain(evolutionChainNode) {
  const chain = [];

  let currentNode = evolutionChainNode;
  while (currentNode) {
    chain.push(currentNode.species.name);

    if (currentNode.evolves_to.length > 0) {
      currentNode = currentNode.evolves_to[0];
    } else {
      currentNode = null;
    }
  }

  return chain;
}


generateJsonDB();
