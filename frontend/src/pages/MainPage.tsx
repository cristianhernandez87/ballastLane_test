// /frontend/src/pages/MainPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import type { PokemonListItem, PaginatedPokemonResponse } from '../types';
import api from '../api/axios'; // Nuestro cliente de API
import PokemonCard from '../components/PokemonCard';

// --- Funciones Helper (Ayudantes) ---
const POKEMON_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';

// Extrae el ID de la URL (ej. "https://pokeapi.co/api/v2/pokemon/1/")
const extractPokemonId = (url: string): number => {
    const parts = url.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
};

// Transforma la data cruda de la API a nuestro tipo PokemonListItem
const transformPokemonData = (data: { name: string; url: string }[]): PokemonListItem[] => {
    return data.map(p => {
        const id = extractPokemonId(p.url);
        return {
            ...p,
            id: id,
            image: `${POKEMON_IMAGE_URL}${id}.png`
        };
    });
};

// --- Componente Principal ---
const MainPage: React.FC = () => {
    const { logout } = useAuth();
    
    // Estados de la data
    const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados de paginación
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);

    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'name' | 'id'>('id');

    // Función para cargar Pokémon
    // Usamos 'offset' y 'limit' para el fetch inicial
    const fetchPokemons = async (url: string = '/pokemons?limit=20&offset=0') => {
        setLoading(true);
        setError(null);
        try {
            // Llama a nuestro backend GET /api/pokemons
            const response = await api.get<PaginatedPokemonResponse>(url);
            
            // Guardamos la data transformada
            setAllPokemons(transformPokemonData(response.data.results));
            
            // Guardamos las URLs de paginación (relativas a nuestra API)
            setNextUrl(response.data.next ? response.data.next.replace('https://pokeapi.co/api/v2', '') : null);
            setPrevUrl(response.data.previous ? response.data.previous.replace('https://pokeapi.co/api/v2', '') : null);

        } catch (err) {
            console.error("Error al cargar los Pokémon:", err);
            setError('Error al cargar los Pokémon. Intenta recargar la página.');
        } finally {
            setLoading(false);
        };
    }

    // Carga inicial al montar el componente
    useEffect(() => {
        fetchPokemons();
    }, []);

    // Lógica de Paginación
    const handleNext = () => nextUrl && fetchPokemons(nextUrl);
    const handlePrevious = () => prevUrl && fetchPokemons(prevUrl);

    // Lógica de Filtro y Ordenamiento (con useMemo para optimizar)
    const filteredAndSortedPokemons = useMemo(() => {
        return allPokemons
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sortOrder === 'name') {
                    return a.name.localeCompare(b.name);
                }
                return a.id - b.id; // Orden por ID (número)
            });
    }, [allPokemons, searchTerm, sortOrder]);


    return (
        <Container className="py-4">
            {/* --- Header y Logout --- */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1>Pokédex</h1>
                </Col>
                <Col md="auto">
                    <Button onClick={logout} variant="outline-secondary">
                        Cerrar Sesión
                    </Button>
                </Col>
            </Row>

            {/* --- Controles de Búsqueda y Ordenamiento --- */}
            <Row className="mb-4 g-3">
                <Col md={8}>
                    <InputGroup>
                        <InputGroup.Text>Buscar:</InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text>Ordenar por:</InputGroup.Text>
                        <Form.Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'name' | 'id')}
                        >
                            <option value="id">Número (ID)</option>
                            <option value="name">Nombre (A-Z)</option>
                        </Form.Select>
                    </InputGroup>
                </Col>
            </Row>
            
            {/* --- Contenido: Loading, Error o Lista --- */}
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" /> <span>Cargando...</span>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    {/* --- Grilla de Pokémon --- */}
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {filteredAndSortedPokemons.map(pokemon => (
                            <Col key={pokemon.id}>
                                <PokemonCard pokemon={pokemon} />
                            </Col>
                        ))}
                    </Row>

                    {/* --- Controles de Paginación --- */}
                    <Row className="mt-4">
                        <Col className="d-flex justify-content-between">
                            <Button onClick={handlePrevious} disabled={!prevUrl}>
                                &laquo; Anterior
                            </Button>
                            <Button onClick={handleNext} disabled={!nextUrl}>
                                Siguiente &raquo;
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default MainPage;