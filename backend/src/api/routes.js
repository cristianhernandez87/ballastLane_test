// /backend/src/api/routes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
        res.json({
            success: true,
            message: 'Login exitoso.'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Credenciales incorrectas.'
        });
    }
});

router.get('/pokemons', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon`, {
            params: { limit, offset }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error loading Pokémon. Please try reloading the page:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error server loading PokeAPI.'
        });
    }
});

router.get('/pokemons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}`);
        
        const { 
            abilities, 
            moves, 
            forms, 
            id: pokemonId, 
            name, 
            sprites,
            height,
            weight 
        } = response.data;
        
        res.json({ 
            abilities, 
            moves, 
            forms, 
            id: pokemonId, 
            name, 
            sprites,
            height,
            weight 
        });

    } catch (error) {
        console.error(`Error loading Pokémon: ${req.params.id}:`, error.message);
        if (error.response && error.response.status === 404) {
            res.status(404).json({
                success: false,
                message: 'Pokémon no found.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error server PokeAPI.'
            });
        }
    }
});

module.exports = router;