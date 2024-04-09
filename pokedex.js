const main$$ = document.querySelector(".main");
const mapArray = [];

const letterFirstPoke = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const getPokeCharacters = async () => {
  try {
    for (let poke = 1; poke <= 150; poke++) {
      //hacemos un bicle para que recorra los 150
      const responseApi = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${poke}`
      ); //hace la petcion de cada pokemon
      const resultPoke = await responseApi.json(); //lo convierte a json
      /*  console.log(responseApi) */ //lo muestre consola

      const mapPokeCharacters = {
        id: resultPoke.id,
        nombre: letterFirstPoke(resultPoke.name),
        tipoPrincipal: resultPoke.types[0].type.name, // propiedad de este objeto que contiene un array de objetos que representan los tipos de Pokémon, el cero accede al primer caracter
        tipo: resultPoke.types
          .map((type) => letterFirstPoke(type.type.name))
          .join(
            ", "
          ) /* .charArt(0).toUppercase() + resultPoke.types.slice(1) */,
        habilidades: resultPoke.abilities.map((ability) =>
          letterFirstPoke(ability.ability.name)
        ),
        imagen: resultPoke.sprites.other["official-artwork"].front_default,
      };
      mapPokeCharacters.habilidades =
        mapPokeCharacters.habilidades.join("<br>");
      mapArray.push(mapPokeCharacters); // llamo a mapArray para hacer el push del objeto mapPokeChacterscoge y pusealo dentro mapArray
    }
  } catch (fail) {
    console.log(fail);
  }
};
const drawCharactersPoke = (pokemon) => {
  main$$.innerHTML = "";

  for (const poke of pokemon) {
    let charactersDiv$$ = document.createElement("div");
    charactersDiv$$.className = "main_div " + poke.tipoPrincipal;
    charactersDiv$$.innerHTML = `
      <p>${poke.id}</p> 
      <h2>${poke.nombre}</h2>
      <h3>${poke.tipo}</h3>
      <p>${poke.habilidades}</p>
      <img src="${poke.imagen}" alt="${poke.nombre}">
    `;
    main$$.appendChild(charactersDiv$$);
  }
};

// Obtener todos los botones
const buttons = document.querySelectorAll("#seleccion button");

// Agregar un evento click a cada botón
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const selectedType = this.value; // Obtener el valor del botón
    filterPokemon(selectedType); // Filtrar los Pokémon y actualizar la visualización
  });
});

// Función para filtrar los Pokémon y actualizar la visualización
function filterPokemon(type) {
  let filteredPokemon;
  if (type.toLowerCase() === "todos") {
    filteredPokemon = mapArray; // Mostrar todos los Pokémon sin filtrar
  } else {
    filteredPokemon = mapArray.filter((pokemon) =>
      pokemon.tipo.toLowerCase().includes(type.toLowerCase())
    );
  }
  drawCharactersPoke(filteredPokemon);
}
// Desplegable de Luchadores
function pokeVsPoke() {
  const divContainerBatalla = document.createElement('div');
  const containerBatalla = document.querySelector('.container');
  const selectPoke1 = document.getElementById("dropdown1"); //dropdown menú desplegable
  const selectPoke2 = document.getElementById("dropdown2");
  /*  containerBatalla.innerHTML = "Batallas <br>" + containerBatalla.innerHTML; */ //le ponemos el texto y le añadimos lo que ya tenia 
  divContainerBatalla.innerText = "Batallas";
  containerBatalla.insertAdjacentElement("afterbegin", divContainerBatalla); //inserta un elemento dentro del container de batalla en el inicio
  /*  containerBatalla.appendChild(divContainerBatalla); */

  for (const poke of mapArray) {
    const option1 = document.createElement("option");
    option1.value = poke.nombre; //recorre el array y lo llena de ipciones con el nombre de los Pokemons, que valide la acción
    option1.textContent = poke.nombre; //indica los nombres en el dropdown

    const option2 = document.createElement("option");
    option2.value = poke.nombre;
    option2.textContent = poke.nombre;

    selectPoke1.appendChild(option1); // a la constante le metemos el hijo
    selectPoke2.appendChild(option2);
  }
}
function pokemonBattle() {
  // Paso 1: Obtén los valores seleccionados de los dos desplegables
  const selectedPoke1 = document.getElementById("dropdown1").value;
  const selectedPoke2 = document.getElementById("dropdown2").value;

  // Paso 2: Busca en mapArray los objetos de los pokémon correspondientes a esos nombres
  const poke1 = mapArray.find((pokemon) => pokemon.nombre === selectedPoke1);
  const poke2 = mapArray.find((pokemon) => pokemon.nombre === selectedPoke2);

  // Paso 3: Genera un resultado aleatorio para determinar cuál pokémon gana
  const randomWinner = Math.random() < 0.5 ? poke1 : poke2; //ambos tienen misma probabilidad de ganar

  // Paso 4: Oculta todas las cartas de los Pokémon participantes
  document.querySelectorAll(".main_div").forEach((card) => {
    card.style.display = "none";
  });

  // Paso 5: Muestra el resultado en algún lugar de tu página después de un retraso
  setTimeout(() => {
    const resultContainer = document.getElementById("battleResult");
    resultContainer.innerHTML = `
    <div class="battle">
      <div class="rival">
        <h3>${poke1.nombre}</h3>
        <img src="${poke1.imagen}" alt="${poke1.nombre}" style="width: 200px;">
      </div>
      <div class="rival">
        <h3>${poke2.nombre}</h3>
        <img src="${poke2.imagen}" alt="${poke2.nombre}" style="width: 200px;">
      </div>
    </div> 
    <p class="result">${randomWinner.nombre} ha ganado la batalla!</p>
    `;
  }, 100); // Retraso de 100 milisegundos (ajusta este valor según sea necesario)

  document.getElementById("dropdown1").selectedIndex = 0; //cuando seleccionamos un elemento, empieza por indice que empieza desde 0 , de este modo selecciona la primera opción
  document.getElementById("dropdown2").selectedIndex = 0;
}

const buttonresult = document.querySelector("#resultBtn");
buttonresult.addEventListener("click", pokemonBattle);

// Función para limpiar el resultado de la batalla
function clearBattleResult() {
  const resultContainer = document.getElementById("battleResult");
  resultContainer.innerHTML = ""; // Elimina todo el contenido del contenedor
}

// Función para filtrar los Pokémon y actualizar la visualización
function filterPokemon(type) {
  let filteredPokemon;
  if (type.toLowerCase() === "todos") {
    filteredPokemon = mapArray; // Mostrar todos los Pokémon sin filtrar
  } else {
    filteredPokemon = mapArray.filter(pokemon => pokemon.tipo.toLowerCase().includes(type.toLowerCase()));
  }
  drawCharactersPoke(filteredPokemon);
  clearBattleResult(); // Limpiar el resultado de la batalla al filtrar los Pokémon
}



const initPoke = async () => {
  document.addEventListener("DOMContentLoaded", async function () {
    const charactersPoke = await getPokeCharacters();
    console.log(mapArray);
    drawCharactersPoke(mapArray);

    // Ocultar la imagen de carga una vez que la página se haya cargado completamente
    const loadingImage = document.querySelector(".loader");
    loadingImage.style.display = "none";
    pokeVsPoke();
  });
};

initPoke();
