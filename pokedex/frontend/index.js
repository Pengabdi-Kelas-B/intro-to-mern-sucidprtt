let pokemonData = [];

// Fetch data from mock server
async function fetchPokemon() {
  try {
    const response = await fetch("http://localhost:3000/pokemon");
    if (!response.ok) {
      throw new Error("http call failed");
    }
    const data = await response.json();
    pokemonData = data;
    renderApp();
  } catch (error) {
    console.error("Failed to fetch Pokemon data:", error);
    renderApp();
  }
}

// Function to determine the type button style
function getTypeStyles(type) {
  const typeColors = {
    fire: "bg-red-500 text-white",
    water: "bg-blue-500 text-white",
    grass: "bg-green-500 text-white",
    electric: "bg-yellow-500 text-black",
    ice: "bg-sky-200 text-black",
    fighting: "bg-purple-600 text-white",
    poison: "bg-purple-700 text-white",
    ground: "bg-brown-600 text-white",
    flying: "bg-indigo-300 text-white",
    psychic: "bg-pink-500 text-white",
    bug: "bg-green-600 text-white",
    rock: "bg-gray-600 text-white",
    ground: "bg-green-900 text-white",
    ghost: "bg-purple-900 text-white",
    dragon: "bg-red-600 text-white",
    fairy: "bg-pink-300 text-white",
    normal: "bg-gray-300 text-black",
    steel: "bg-gray-400 text-black",
    dark: "bg-gray-800 text-white",
  };
  return typeColors[type] || "bg-gray-200 text-black"; // Default color
}

// Card component with Tailwind styling and additional evolution chain display
function PokemonCard(props) {
  return React.createElement(
    "div",
    {
      className:
        "max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl m-4 flex flex-col items-center h-90 w-60", // Set a fixed height
    },
    React.createElement("img", {
      src: props.image,
      alt: props.name,
      className: "w-full h-32 object-contain", // Set image height
    }),
    React.createElement(
      "div",
      { className: "p-4 flex flex-col items-center flex-grow" }, // Allow the content to grow
      React.createElement(
        "h2",
        { className: "text-xl font-bold text-gray-800 capitalize text-center" },
        props.name
      ),
      React.createElement(
        "p",
        { className: "text-gray-600 mt-2 text-center" },
        `Evolution Chain: ${props.evolutionChains.join(" → ")}`
      ),
      React.createElement(
        "div",
        { className: "flex flex-wrap justify-center mt-2" },
        props.types.map((type) =>
          React.createElement(
            "span",
            {
              className: `inline-block py-1 px-2 m-1 rounded-full text-xs font-semibold ${getTypeStyles(
                type
              )}`,
            },
            type
          )
        )
      )
    )
  );
}

// List component
function PokemonList() {
  if (pokemonData.length === 0) {
    return React.createElement(
      "p",
      { className: "text-center text-gray-500" },
      "Loading Pokemon data..."
    );
  }

  return React.createElement(
    "div",
    { className: "flex flex-wrap justify-center" },
    pokemonData.map((pokemon) =>
      React.createElement(PokemonCard, {
        key: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
        evolutionChains: pokemon.evolutionChains,
      })
    )
  );
}

// App component wrap header and list
function App() {
  return React.createElement(
    "div",
    { className: "min-h-screen bg-gray-100" },
    React.createElement(
      "header",
      { className: "bg-teal-500 p-4 shadow-lg" },
      React.createElement(
        "h1",
        { className: "text-4xl text-center font-bold text-white" },
        "Pokedex"
      )
    ),
    React.createElement(PokemonList, null)
  );
}

// Function to render the app
function renderApp() {
  ReactDOM.render(React.createElement(App), document.getElementById("root"));
}

// Initial render
renderApp();

// Fetch and display the Pokemon data
fetchPokemon();
