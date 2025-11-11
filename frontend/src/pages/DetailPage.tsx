// /frontend/src/pages/DetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import type { PokemonDetail } from '../types';
import api from '../api/axios';

const DetailPage: React.FC = () => {
    // Obtenemos el 'id' de la URL (ej. /pokemon/25)
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPokemonDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // Llama a nuestro backend GET /api/pokemons/:id
                const response = await api.get<PokemonDetail>(`/pokemons/${id}`);
                setPokemon(response.data);
            } catch (err) {
                console.error("Error al cargar el detalle del Pokémon:", err);
                setError('No se pudo cargar el detalle del Pokémon.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPokemonDetail();
        }
    }, [id]); // Se ejecuta cada vez que el 'id' de la URL cambia

    // --- Renderizado ---

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" /> <span>Cargando detalle...</span>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
                <Button variant="secondary" onClick={() => navigate('/')}>Volver al Listado</Button>
            </Container>
        );
    }

    if (!pokemon) return null; // No renderiza nada si no hay Pokémon

    return (
        <Container className="py-4">
            <Button variant="outline-secondary" onClick={() => navigate('/')} className="mb-3">
                &laquo; Volver al Listado
            </Button>

            <Row>
                {/* Columna de Imagen y Datos Básicos */}
                <Col md={4}>
                    <Card className="text-center shadow-sm">
                        <Card.Img 
                            variant="top" 
                            src={pokemon.sprites.other['official-artwork'].front_default}
                            alt={pokemon.name}
                            style={{ padding: '20px' }}
                        />
                        <Card.Body>
                            <Card.Title className="text-capitalize fs-2">
                                {pokemon.name}
                            </Card.Title>
                            <Card.Text className="text-muted fs-4">
                                #{String(pokemon.id).padStart(3, '0')}
                            </Card.Text>
                            <p>Peso: {pokemon.weight / 10} kg | Altura: {pokemon.height / 10} m</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Columna de Habilidades, Movimientos y Formas */}
                <Col md={8}>
                    [cite_start]{/* Habilidades [cite: 24] */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header as="h5">Habilidades</Card.Header>
                        <ListGroup variant="flush">
                            {pokemon.abilities.map((a, index) => (
                                <ListGroup.Item key={index} className="text-capitalize">
                                    {a.ability.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>

                    [cite_start]{/* Formas [cite: 24] */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header as="h5">Formas</Card.Header>
                        <ListGroup variant="flush">
                            {pokemon.forms.map((f, index) => (
                                <ListGroup.Item key={index} className="text-capitalize">
                                    {f.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>

                    [cite_start]{/* Movimientos (limitado para no saturar) [cite: 24] */}
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Movimientos (Primeros 10)</Card.Header>
                        <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {pokemon.moves.slice(0, 10).map((m, index) => (
                                <Badge pill bg="secondary" key={index} className="m-1 p-2 text-capitalize">
                                    {m.move.name}
                                </Badge>
                            ))}
                            {pokemon.moves.length > 10 && (
                                <p className="text-muted mt-2">...y {pokemon.moves.length - 10} más.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DetailPage;