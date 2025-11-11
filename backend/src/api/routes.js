// /backend/src/api/routes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * 1. Endpoint de Login
 */
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

/**
 * 2. Endpoint de Listado de Pokémon (Paginado)
 */
router.get('/pokemons', async (req, res) => {
    try {
        const { limit, offset } = req.query;
        
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon`, {
            params: { limit, offset }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error al obtener el listado de pokémon:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al contactar PokeAPI.'
        });
    }
});

/**
 * 3. Endpoint de Detalle de Pokémon (Corregido)
 */
router.get('/pokemons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}`);
        
        // Campos que el Frontend necesita:
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
        
        // Devolvemos solo esos campos
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
        console.error(`Error al obtener detalle de pokémon ${req.params.id}:`, error.message);
        
        // Lógica de error corregida:
        if (error.response && error.response.status === 404) {
            res.status(404).json({
                success: false,
                message: 'Pokémon no encontrado.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error en el servidor al contactar PokeAPI.'
            });
        }
    }
});

// Asegúrate de que esto esté al final del archivo
module.exports = router;