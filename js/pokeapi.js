// QUERY OF ALL THE ELEMENTS ARE GOING TO BE USED
const pokemonSubContainer = document.querySelector('.sub-container-pokeItems');
const textSearchPokemon = document.querySelector('#textSearchPokemon');

// QUERY OF ALL THE BUTTONS ARE GOING TO BE USED
// const btnLoad = document.querySelector('#btnLoad');
const btnSearchPokemon = document.querySelector('#btnSearchPokemon');
const btnfilterType = document.querySelectorAll('.typeClass');

// fetchPokemonInfo() VARIABLES
var cantPokemonRequiered  = 151;
var startingPokemon = 1;
var cantPokemon = 1;

// createPokemon Item() & CardInfo()  VARIABLES
var pokemonList;
var pokeItems;
var pokeContainers;
var pokemonInnerHTML = '';
var btnMoves;
var evolutionsID = new Map();

const btnReference = document.querySelector("#btnReference");
const menu = document.querySelector('.references.collapsed');

var regex = /(\d+)/g;

// DEFINING COLORS OF ALL TYPES
const colorsTypes = {

    NORMAL: '#A8A77A',
    FIRE: '#EE8130',
    GRASS: '#7AC74C',
    ELECTRIC: '#F7D02C',
    WATER: '#6390F0',
    BUG: '#A6B91A',
    DRAGON: '#6F35FC',
    FIGHTING: '#C22E28',
    FLYING: '#A98FF3',
    GHOST: '#735797',
    GROUND: '#E2BF65',
    ICE: '#96D9D6',
    POISON: '#A33EA1',
    PSYCHIC: '#F95587',
    ROCK: '#B6A136',
    FAIRY: '#D685AD',
    STEEL: '#B7B7CE',
}

// FUNCTION THAT FETCHS INFORMATION FROM THE POKE-API AND REDIRECTS TO THE OBTAINING OF POKEMON INFO
const fetchPokemonInfo = async (startingPokemon, cantPokemonRequiered) => {

    if (cantPokemonRequiered > 151){

        cantPokemonRequiered = 151;
    }

    for (i = startingPokemon ; i <= cantPokemonRequiered ; i++) {

        // General fetch
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        const res = await fetch(url);
        const data = await res.json();

        // General fetch
        const url2 = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
        const res2 = await fetch(url2);
        const data2 = await res2.json();

        // Evolution chain fetch
        const url3 = `https://pokeapi.co/api/v2/evolution-chain/${i}`;
        const res3 = await fetch(url3);
        const data3 = await res3.json();

        getPokemonInfo(data, data2, data3, i);
        startingPokemon ++;
        cantPokemon++;
    }
}

// FUNCTION THAT CREATES POKEMON OBJECTS WITH THE INFO FROM PREVIOUS FETCH AND REDIRECTS TO THE CREATION OF POKEMON ITEMS
const getPokemonInfo = (data, data2, data3, i) => {

    // PROCESS - CREATING POKEMON OBJECT
    var pokemon = new Object();

    // ATTRIBUTE - Name all mayusq
    pokemon.nameAllMinus = data.name;
    // PROCESS - Removing nidoran and mr-mime hyphens
    if(pokemon.nameAllMinus.includes('nidoran') || pokemon.nameAllMinus.includes('mime')){
        pokemon.nameAllMinus = data.name.replace("-","");
    }
    // ATTRIBUTE - Name all mayusq
    pokemon.nameAllMayus = data.name.toUpperCase();
    // ATTRIBUTE - Name capital letter
    pokemon.nameCapitalLetter = data.name[0].toUpperCase() + data.name.slice(1);
    // ATTRIBUTE - Pokemon RAW ID
    pokemon.pokemonRawID = data.id;
    // ATTRIBUTE - Pokemon ID
    pokemon.pokemonVisualID = data.id.toString().padStart(3, '0');
    // ATTRIBUTE - Pokemon types
    pokemon.types = data.types.map(type => type.type.name);
    // ATTRIBUTE - Pokemon 1st Type
    pokemon.type1 =  pokemon.types[0].toUpperCase();
    if(pokemon.types[1] != null){
        // ATTRIBUTE - Pokemon 2nd Type
        pokemon.type2 =  pokemon.types[1].toUpperCase();
    }
    // ATTRIBUTE - Pokemon color 1st Type
    pokemon.color =  colorsTypes[pokemon.type1];
    // ATTRIBUTE - Pokemon color 2nd Type
    pokemon.color2 = colorsTypes[pokemon.type2];
    // ATTRIBUTE - Pokemon height in M
    pokemon.height = (data.height)/10;
    // ATTRIBUTE - Pokemon weight in Kg
    pokemon.weight = (data.weight)/10;
    // ATTRIBUTE - Pokemon base experience
    pokemon.baseExp = data.base_experience;
    // ATTRIBUTE - Pokemon abilities
    pokemon.abilities = data.abilities.map(ability => ability.ability.name);
    // ATTRIBUTE - Pokemon 1st ability
    pokemon.ability1 =  pokemon.abilities[0];
    // ATTRIBUTE - Pokemon 2nd ability
    pokemon.ability2 =  pokemon.abilities[1];

    // PROCESS - Filtering pokemon genus
    const genusFiltered = data2.genera.filter(
        (element) => element.language.name === "en"
      );
    const genusTextEntry = genusFiltered.length > 0 ? genusFiltered[0] : {}; 
    data.genera = [genusTextEntry];

    // ATTRIBUTE - Pokemon genus
    pokemon.genusText = genusTextEntry.genus;

    // PROCESS - Filtering pokemon flavor text
    const fileterdFlavorTextEntries = data2.flavor_text_entries.filter(
        (element) => element.language.name === "en"
      );
    const flavorTextEntry = fileterdFlavorTextEntries.length > 0 ? fileterdFlavorTextEntries[0] : {}; 
    data.flavor_text_entries = [flavorTextEntry];

    // ATTRIBUTE - Pokemon flavor text
    pokemon.flavorText = (flavorTextEntry.flavor_text).replace("","");


    var evolutionChain = [];

    const evoChain1Evo =  parseInt((data3.chain.species.url.match(regex))[1]);
    evolutionChain.push(evoChain1Evo);

    if(data3.chain.evolves_to.length !== 0){

        const evoChain2Evo = parseInt((data3.chain.evolves_to[0].species.url.match(regex))[1]);
        evolutionChain.push(evoChain2Evo);

        if(data3.chain.evolves_to[0].evolves_to.length !== 0){

            const evoChain3Evo =  parseInt((data3.chain.evolves_to[0].evolves_to[0].species.url.match(regex))[1]);
            evolutionChain.push(evoChain3Evo);
        }
    }

    if(pokemon.nameAllMinus == 'eevee'){
        console.log(data3);
    }

    evolutionsID.set(i, evolutionChain);
    
    createPokemonItem(pokemon, i, evolutionsID);
}

// FUNCTION THAT CREATES POKE-ITEMS AND AUTOMATICALLY REDIRECTS TO THE CREATION OF POKE CARDS INFO
const createPokemonItem = (pokemon, i, evolutionsID) => {

    // Creating DIV container
    pokemonList = document.createElement('div');
    // Asigning class to DIV
    pokemonList.setAttribute('class','pokemon-fullItem');

    var pokemonInnerHTMLItem = 
    
                `
                    <div id="${pokemon.pokemonRawID}" class="pokemon-item">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonRawID}.png" alt="${pokemon.nameCapitalLetter}">
                        <p>Nº ${pokemon.pokemonVisualID}</p>
                        <h5>${pokemon.nameAllMayus}</h5>
                        <div class="types">
                            <p id="type" style="background-color:${pokemon.color}">${pokemon.type1}</p>
       
                    `

            if(pokemon.type2 != null){
    
                var pokemonInnerHTMLCardInfo =
    
                    `           <p id="type" style="background-color:${pokemon.color2}">${pokemon.type2}</p>
                            </div>
                        </div>
                    `

               pokemonInnerHTMLCardInfo = createPokemonCardInfo(pokemon, i, pokemonInnerHTMLCardInfo, evolutionsID);
            }
            else{
    
                var pokemonInnerHTMLCardInfo =

                    `       </div>
                        </div>
                    `

                pokemonInnerHTMLCardInfo = createPokemonCardInfo(pokemon, i, pokemonInnerHTMLCardInfo, evolutionsID);

            }
            

    // Combining temporal InnerHTML into a complete one
    pokemonInnerHTML = pokemonInnerHTML + (pokemonInnerHTMLItem + pokemonInnerHTMLCardInfo);
    // Asigning innerHTML to DIV
    pokemonList.innerHTML = pokemonInnerHTML;
    // Adding DIV to pokemon Container
    pokemonSubContainer.appendChild(pokemonList);
    // Reseting innerHTML
    pokemonInnerHTML = '';

    // Asigning elements to variables created dynamically
    pokeItems = document.querySelectorAll('.pokemon-item');
    pokeContainers = document.querySelectorAll('.sub-container-pokeInfo');
    btnMoves = document.querySelectorAll('.movePokemons');

    // PROCESS - ONCLICK ITEM FUNCTION, IF YOU PRESS A POKE-ITEM IT APPEARS IT'S POKEMON CARD INFO

    for (let j = 0; j < pokeItems.length; j++) {
    
        pokeItems[j].onclick = () => {

            let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

            const idPokeItem = (pokeItems[j].getAttribute('id') + '-container') ;
            const idPokeContainer = pokeContainers[j].getAttribute('id');
            if(idPokeContainer == idPokeItem){

                for (let c = 0; c < pokeContainers.length; c++) {

                    pokeContainers[c].setAttribute('class',`sub-container-pokeInfo movil`)
                }

                if (vw > 1000){

                    pokeContainers[j].classList.toggle('highlighted');
                }
                if (vw < 1000){

                    pokeContainers[j].classList.toggle('movil');
                    pokeContainers[j].classList.toggle('highlighted');
                }
            }

        }
    }

    // PROCESS - POKEMON CARDS BUTTONS LEFT AND RIGHT FUNCTIONALITY

    for (let i = 0; i < btnMoves.length; i++) {

        btnMoves[i].onclick = () => {

            const moveID =  btnMoves[i].getAttribute('id');

            if(moveID.includes('left')){

                const containerToMove = btnMoves[i-1];
                const indexToMove = parseInt(containerToMove.getAttribute('id').match(regex));

                pokeContainers.forEach(element => {
 
                    const elementID = element.getAttribute('id');
                    const numSubCotaninerId = parseInt(elementID.match(regex));

                    element.setAttribute('class','sub-container-pokeInfo movil');

                    if (numSubCotaninerId == indexToMove) {
                        
                        element.setAttribute('class','sub-container-pokeInfo highlighted');
                    }
                });
            }

            if(moveID.includes('right')){

                const containerToMove = btnMoves[i+1];
                const indexToMove = parseInt(containerToMove.getAttribute('id').match(regex));

                pokeContainers.forEach(element => {
 
                    const elementID = element.getAttribute('id');
                    const numSubCotaninerId = parseInt(elementID.match(regex));

                    element.setAttribute('class','sub-container-pokeInfo movil');

                    if (numSubCotaninerId == indexToMove) {
                        
                        element.setAttribute('class','sub-container-pokeInfo highlighted');
                    }
                });
            }
        }
    };

}

// FUNCTION THAT CREATES POKEMON CARDS INFO
const createPokemonCardInfo = (pokemon, i, pokemonInnerHTMLCardInfo, evolutionsID) => {
    
    if(pokemon.type2 != null){

        if(cantPokemon == 1){


            pokemonInnerHTMLCardInfo += 

                `
                    <div id="${pokemon.pokemonRawID}-container" class="sub-container-pokeInfo highlighted movil">
                `
        }
        else{

            pokemonInnerHTMLCardInfo +=

                `
                    <div id="${pokemon.pokemonRawID}-container" class="sub-container-pokeInfo movil">
                `
        }


        pokemonInnerHTMLCardInfo +=

                `
                    <div id="${pokemon.nameAllMinus}-data" class="content">
                        <div class="general">
                            <div class="buttonsMovePokemons">
                                <button id="leftMove-${pokemon.pokemonRawID}" class="movePokemons"><i class="fa-solid fa-angle-left"></i></button>
                                <button id="rightMove-${pokemon.pokemonRawID}" class="movePokemons"><i class="fa-solid fa-angle-right"></i></button>
                            </div>
                            <img id="data-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonRawID}.png" alt="${pokemon.nameCapitalLetter}">
                            <p id="num">#${pokemon.pokemonVisualID}</p>
                            <h5>${pokemon.nameCapitalLetter}</h5>
                            <p id="descPoke">${pokemon.genusText}</p>
                            <div class="types">
                                <p style="background-color:${pokemon.color}">${pokemon.type1}</p>
                                <p style="background-color:${pokemon.color2}">${pokemon.type2}</p>
                            </div>
                            
                        </div>

                        <div class="pokedex-entry">
                            <h6>POKÉDEX ENTRY</h6>
                            <p>${pokemon.flavorText}</p>
                        </div>

                        <div class="abilities">
                            <h6>ABILITIES</h6>
                            <div class="items">

                    `

                    if(pokemon.ability2 != null){

                        pokemonInnerHTMLCardInfo +=

                        `
                            <p>${pokemon.ability1}</p>
                            <p>${pokemon.ability2}</p>
                        `
                    }
                    else{

                        pokemonInnerHTMLCardInfo +=

                        `
                            <p>${pokemon.ability1}</p>
                        `
                    }
                                
                        pokemonInnerHTMLCardInfo +=

                        `
                                                </div>
                                            </div>

                                            <div class="h-weight">
                                                <div class="height">
                                                    <h6>HEIGHT</h6>
                                                    <p>${pokemon.height}m</p>
                                                </div>
                                                <div class="weight">
                                                    <h6>WEIGHT</h6>
                                                    <p>${pokemon.weight}Kg</p>
                                                </div>
                                            </div>
                        `

                        for (var [key, value] of evolutionsID) {

                            for (let i = 0; i < value.length; i++) {
                                
                                if(value[i] == pokemon.pokemonRawID){

                                    if(value.length == 1){

                                        pokemonInnerHTMLCardInfo +=

                                        `
                                            <div class="evolutions">
                                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[0]}.png" alt="">
                                            </div>
                                        `
                                    }
                                    else if(value.length == 2){

                                        pokemonInnerHTMLCardInfo +=

                                        `
                                            <div class="evolutions">
                                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[0]}.png" alt="">
                                                <p><i class="fa-solid fa-chevron-right"></i></p>
                                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[1]}.png" alt="">
                                            </div>
                                        `
                                    }
                                    else if(value.length == 3){

                                        pokemonInnerHTMLCardInfo +=

                                        `
                                            <div class="evolutions">
                                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[0]}.png" alt="">
                                                <p><i class="fa-solid fa-chevron-right"></i></p>
                                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[1]}.png" alt="">
                                                <p><i class="fa-solid fa-chevron-right"></i></p>
                                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[2]}.png" alt="">
                                            </div>
                                        `
                                    }
                                }
                            }
                        }

                        pokemonInnerHTMLCardInfo +=

                        `

                                        </div>
                                    </div> 

                        </div>
                    </div>
                    `
    }
    else{

    
        if(cantPokemon == 1){

            pokemonInnerHTMLCardInfo += 

            `
            <div id="${pokemon.pokemonRawID}-container" class="sub-container-pokeInfo highlighted movil">
            `
        }
        else{

            pokemonInnerHTMLCardInfo +=

            `
            <div id="${pokemon.pokemonRawID}-container" class="sub-container-pokeInfo movil">
            `
        }

        pokemonInnerHTMLCardInfo +=

            `
                <div id="${pokemon.nameAllMinus}-data" class="content">
                    <div class="general">
                        <div class="buttonsMovePokemons">
                            <button id="leftMove-${pokemon.pokemonRawID}" class="movePokemons"><i class="fa-solid fa-angle-left"></i></button>
                            <button id="rightMove-${pokemon.pokemonRawID}" class="movePokemons"><i class="fa-solid fa-angle-right"></i></button>
                        </div>
                        <img id="data-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonRawID}.png" alt="${pokemon.nameCapitalLetter}">
                        <p id="num">#${pokemon.pokemonVisualID}</p>
                        <h5>${pokemon.nameCapitalLetter}</h5>
                        <p id="descPoke">${pokemon.genusText}</p>
                        <div class="types">
                            <p style="background-color:${pokemon.color}">${pokemon.type1}</p>
                        </div>
                        
                    </div>

                

                    <div class="pokedex-entry">
                        <h6>POKÉDEX ENTRY</h6>
                        <p>${pokemon.flavorText}</p>
                    </div>

                    <div class="abilities">
                        <h6>ABILITIES</h6>
                        <div class="items">

                `

                if(pokemon.ability2 != null){

                    pokemonInnerHTMLCardInfo +=

                        `
                            <p>${pokemon.ability1}</p>
                            <p>${pokemon.ability2}</p>
                        `
                }
                else{

                    pokemonInnerHTMLCardInfo +=

                        `
                            <p>${pokemon.ability1}</p>
                        `
                }
                    
                pokemonInnerHTMLCardInfo +=

                    `
                                        
                        </div>
                    </div>

                    <div class="h-weight">
                        <div class="height">
                            <h6>HEIGHT</h6>
                            <p>${pokemon.height}m</p>
                        </div>
                        <div class="weight">
                            <h6>WEIGHT</h6>
                            <p>${pokemon.weight}Kg</p>
                        </div>
                    </div>
                    `
                    for (var [key, value] of evolutionsID) {

                        for (let i = 0; i < value.length; i++) {
                            
                            if(value[i] == pokemon.pokemonRawID){

                                if(value.length == 1){

                                    pokemonInnerHTMLCardInfo +=

                                    `
                                        <div class="evolutions">
                                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[0]}.png" alt="">
                                        </div>
                                    `
                                }
                                else if(value.length == 2){

                                    pokemonInnerHTMLCardInfo +=

                                    `
                                        <div class="evolutions">
                                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[0]}.png" alt="">
                                            <p><i class="fa-solid fa-chevron-right"></i></p>
                                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[1]}.png" alt="">
                                        </div>
                                    `
                                }
                                else if(value.length == 3){

                                    pokemonInnerHTMLCardInfo +=

                                    `
                                        <div class="evolutions">
                                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[0]}.png" alt="">
                                            <p><i class="fa-solid fa-chevron-right"></i></p>
                                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[1]}.png" alt="">
                                            <p><i class="fa-solid fa-chevron-right"></i></p>
                                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${value[2]}.png" alt="">
                                        </div>
                                    `
                                }
                            }
                        }
                    }

                    pokemonInnerHTMLCardInfo +=
                    `
                </div>
            </div> 
            `
    }

    

    return pokemonInnerHTMLCardInfo;
    
}

// MAIN FUNCTION THAT HAS THE STRUCTURED INSTRUCTIONS TO EXECUTE THE WEB PAGE SCRIPT
function main(){

    fetchPokemonInfo(startingPokemon, cantPokemonRequiered);
    btnfilterType.forEach(element => {

        element.setAttribute('style',`background-color: ${colorsTypes[element.innerHTML]}`);
    });
}

// // ONCLICK FUNCTION TO LOAD MORE POKEMONS 
// btnLoad.onclick = () => {

//     if(cantPokemonRequiered  != 0 && cantPokemonRequiered  < 150){

//         fetchPokemonInfo((cantPokemonRequiered+1), (cantPokemonRequiered+20));
//         cantPokemonRequiered  += 20;
//     }
// }

// ONCLICK FUNCTION TO SEARCH FOR A SPECIFIC POKEMON
btnSearchPokemon.onclick = async() =>{

    const pokeAllMinus = (textSearchPokemon.value).toLowerCase();

    const urlSearch = `https://pokeapi.co/api/v2/pokemon/${pokeAllMinus}`;
    const resSearch = await fetch(urlSearch);
    const dataSearch = await resSearch.json();

    const urlSearch2 = `https://pokeapi.co/api/v2/pokemon-species/${pokeAllMinus}`;
    const resSearch2 = await fetch(urlSearch2);
    const dataSearch2 = await resSearch2.json();

    const idPokemonToFetch = dataSearch.id;

    const urlSearch3 = `https://pokeapi.co/api/v2/evolution-chain/${idPokemonToFetch}`;
    const resSearch3 = await fetch(urlSearch3);
    const dataSearch3 = await resSearch3.json();

    pokeContainers.forEach(element => {
        
        cantPokemon = 1;
        element.setAttribute('class','sub-container-pokeInfo');
    });
    
    while(pokemonSubContainer.children.length > 1){
        
        pokemonSubContainer.removeChild(pokemonSubContainer.lastChild);
    }

    getPokemonInfo(dataSearch, dataSearch2, dataSearch3, 1);
    // btnLoad.setAttribute('disabled', '');
    
}

// ONCLICK FUNCTION OF ALL FILTERS BUTTONS, IF A CERTAIN BUTTON IS PRESSED, IT BRINGS ALL THE POKEMONS FROM THAT TYPE
btnfilterType.forEach(element => element.addEventListener("click", async () =>{
    
    const typeTag = element.innerHTML.toLowerCase();
    cantPokemon = 1;
    while(pokemonSubContainer.children.length > 1){
        
        pokemonSubContainer.removeChild(pokemonSubContainer.lastChild);
    }

    for (let i = 1; i < 152; i++) {


        const dataTypes1 = `https://pokeapi.co/api/v2/pokemon/${i}`;

        const urlTypes2 = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
        const resTypes2 = await fetch(urlTypes2);
        const dataTypes2 = await resTypes2.json();

        const urlTypes3 = `https://pokeapi.co/api/v2/evolution-chain/${i}`;
        const resTypes3 = await fetch(urlTypes3);
        const dataTypes3 = await resTypes3.json();

        fetch(dataTypes1)
            .then((responseTypes) => responseTypes.json())
            .then(dataTypes1 => {

                if(typeTag == "all"){

                    getPokemonInfo(dataTypes1, dataTypes2, dataTypes3, i);
                    // btnLoad.removeAttribute('disabled');
                    startingPokemon  = 16;
                    cantPokemon ++;
                }
                else{

                    const types = dataTypes1.types.map(type => type.type.name);
                    if(types.some(type => type.includes(typeTag))){

                        // btnLoad.setAttribute('disabled', '');
                        getPokemonInfo(dataTypes1, dataTypes2, dataTypes3, i);
                        startingPokemon++;
                        cantPokemon++;
                    }
                }
            })
    }
    
}));

btnReference.onclick = () =>{
    
    menu.classList.toggle('collapsed');
}

// CALLING THE MAIN FUNCTION TO START THE SCRIPT
main();
