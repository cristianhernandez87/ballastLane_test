// /frontend/src/pages/DetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import type { PokemonDetail } from '../types';
import api from '../api/axios';

const DetailPage: React.FC = () => {
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
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" /> <span>Loading details...</span>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
                <Button variant="secondary" onClick={() => navigate('/')}>Back to list</Button>
            </Container>
        );
    }

    if (!pokemon) return null; 

    return (
        <Container className="py-4">
            <Button variant="outline-secondary" onClick={() => navigate('/')} className="mb-3">
                &laquo; Back to list
            </Button>

            <Row>
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
                            <p>Size: {pokemon.weight / 10} kg | Heigh: {pokemon.height / 10} m</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="mb-3 shadow-sm">
                        <Card.Header as="h5">Skills</Card.Header>
                        <ListGroup variant="flush">
                            {pokemon.abilities.map((a, index) => (
                                <ListGroup.Item key={index} className="text-capitalize">
                                    {a.ability.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>

                    <Card className="mb-3 shadow-sm">
                        <Card.Header as="h5">Form</Card.Header>
                        <ListGroup variant="flush">
                            {pokemon.forms.map((f, index) => (
                                <ListGroup.Item key={index} className="text-capitalize">
                                    {f.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Header as="h5">Movements (First 10 steps)</Card.Header>
                        <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {pokemon.moves.slice(0, 10).map((m, index) => (
                                <Badge pill bg="secondary" key={index} className="m-1 p-2 text-capitalize">
                                    {m.move.name}
                                </Badge>
                            ))}
                            {pokemon.moves.length > 10 && (
                                <p className="text-muted mt-2">...y {pokemon.moves.length - 10} more.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DetailPage;