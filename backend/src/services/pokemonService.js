// /backend/src/services/pokemonServices.js
const axios = require('axios');

const BASE_URL = 'https://pokeapi.co/api/v2';

async function fetchPokemons(offset = 0, limit = 20) {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon`, {
            params: { limit, offset }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching pokemons:", error.message);
        throw new Error('Could not fetch paginated Pokémon list.');
    }
}

async function fetchPokemonDetails(idOrName) {
    try {
        const response = await axios.get(`${BASE_URL}/pokemon/${idOrName}`);
        const data = response.data;

        return {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
            abilities: data.abilities.map(a => a.ability.name),
            moves: data.moves.map(m => m.move.name).slice(0, 10), 
            forms: data.forms.map(f => f.name)
        };
    } catch (error) {
        console.error(`Error fetching details for ${idOrName}:`, error.message);
        throw new Error('Could not fetch Pokémon details.');
    }
}

module.exports = {
    fetchPokemons,
    fetchPokemonDetails,
};