document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "http://localhost:3000"
    const TRAINERS_URL = `${BASE_URL}/trainers`
    const POKEMONS_URL = `${BASE_URL}/pokemons/`
    const main = document.querySelector('main')
    

    const getTrainers = (TRAINERS_URL) => {
        fetch(TRAINERS_URL)
        .then(response => response.json())
        .then(data => renderTrainers(data))
    }

    const renderTrainers = (trainers) => {
        for(const trainer of trainers) {
            renderTrainer(trainer)
        }
    }

    const renderTrainer = (trainerObj) => {
        const card = document.createElement('div')
        card.className = 'card'
        card.dataset.id = trainerObj.id
        card.innerHTML = `
        <p>${trainerObj.name}</p>
        <button data-trainer-id=${trainerObj.id}>Add Pokemon</button>
        `
        
        const pokemonUl = document.createElement('ul')

        for(const pokemon of trainerObj["pokemons"]){
            const pokemonLi = document.createElement('li')
            pokemonLi.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button>`
            pokemonUl.append(pokemonLi)
        }

        card.append(pokemonUl)
        main.append(card)
    }

    const addPokemon = (id) => {
        fetch(POKEMONS_URL, { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                // id,
                // nickname,
                // species,
                trainer_id: id
            })
        })
        .then(response => response.json())
        // .then(data => renderPokemon(data))
        .then(renderPokemon)
    }

    const renderPokemon = (pokemon) => {
        const pokemonTrainerId = pokemon.trainer_id
        
        // const pokemonUl = document.createElement('ul')
        const pokemonLi = document.createElement('li')
        pokemonLi.innerHTML = `${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button>`

        const trainerCard = document.querySelector(`[data-id='${pokemonTrainerId}']`)
        const pokemonUl = trainerCard.lastChild

        pokemonUl.append(pokemonLi)
    }

    const removePokemon = (url, id) => {
        fetch(url + id, {
            method: 'DELETE'
        })
    }

    function clickHandler () {
        document.addEventListener("click", function (e) {
            if(e.target.innerText === "Add Pokemon") {
                addPokemon(e.target.dataset.trainerId)
                // console.log(renderPokemon(e.target.dataset.trainerId))
            }
            if(e.target.innerText === "Release") {
                removePokemon(POKEMONS_URL, e.target.dataset.pokemonId)
                e.target.parentElement.remove()
            }
        })
    }

    getTrainers(TRAINERS_URL)
    clickHandler()
})

