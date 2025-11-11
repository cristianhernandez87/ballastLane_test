// /frontend/src/pages/MainPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Button, Spinner, Alert, Form, InputGroup, Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import type { PokemonListItem, PaginatedPokemonResponse } from '../types';
import api from '../api/axios'; 
import PokemonCard from '../components/PokemonCard';

const POKEMON_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
const POKEMONS_PER_PAGE = 20; 

const extractPokemonId = (url: string): number => {
    const parts = url.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
};

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

const MainPage: React.FC = () => {
    const { logout } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlPage = Number(searchParams.get('page')) || 1;
    const [currentPage, setCurrentPage] = useState(urlPage);
    const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'name' | 'id'>('id');
    const totalPages = Math.ceil(totalCount / POKEMONS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        searchParams.set('page', page.toString());
        setSearchParams(searchParams, { replace: true });
        setCurrentPage(page); 
    };

    const fetchPokemons = async (page: number) => {
        if (page < 1) page = 1;
        const offset = (page - 1) * POKEMONS_PER_PAGE;
        const url = `/pokemons?limit=${POKEMONS_PER_PAGE}&offset=${offset}`;

        setLoading(true);
        setError(null);
        try {
            const response = await api.get<PaginatedPokemonResponse>(url);
            setAllPokemons(transformPokemonData(response.data.results));
            setTotalCount(response.data.count);

        } catch (err) {
            setError('Error loading Pokémon. Please try reloading the page.');
            console.error("Error loading Pokémon:", err);
        } finally {
            setLoading(false);
        };
    }

    useEffect(() => {
        const pageFromUrl = Number(searchParams.get('page')) || 1;
        setCurrentPage(pageFromUrl);
        
        fetchPokemons(pageFromUrl);
    }, [searchParams]);

    const filteredAndSortedPokemons = useMemo(() => {
        return allPokemons
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sortOrder === 'name') {
                    return a.name.localeCompare(b.name);
                }
                return a.id - b.id;
            });
    }, [allPokemons, searchTerm, sortOrder]);

    const renderPaginationItems = () => {
        if (totalPages <= 1) return null;

        const items = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        items.push(
            <Pagination.First key="first" onClick={() => handlePageChange(1)} disabled={currentPage === 1} />,
            <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        );

        if (startPage > 1) {
            items.push(<Pagination.Ellipsis key="startEllipsis" disabled />);
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item 
                    key={number} 
                    active={number === currentPage} 
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>,
            );
        }

        if (endPage < totalPages) {
            items.push(<Pagination.Ellipsis key="endEllipsis" disabled />);
        }

        items.push(
            <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />,
            <Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        );


        return (
            <Pagination className="justify-content-center flex-wrap">
                {items}
            </Pagination>
        );
    };

    return (
        <Container className="py-4">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1>Pokédex</h1>
                </Col>
                <Col md="auto">
                    <Button onClick={logout} variant="outline-secondary">
                        Close Session
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4 g-3">
                <Col md={8}>
                    <InputGroup>
                        <InputGroup.Text>Find:</InputGroup.Text>
                        <Form.Control
                            placeholder="Find by Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text>Filter by:</InputGroup.Text>
                        <Form.Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'name' | 'id')}
                        >
                            <option value="id">Number (ID)</option>
                            <option value="name">Name (A-Z)</option>
                        </Form.Select>
                    </InputGroup>
                </Col>
            </Row>
            
            {totalCount > 0 && !loading && !error && (
                <Row className="mb-4 d-none">
                    <Col className="text-center">
                        <p className="fs-5">Page **{currentPage}** of **{totalPages}**</p>
                    </Col>
                </Row>
            )}

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" /> <span>Loading...</span>
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

                    <Row className="mt-4">
                        <Col>
                            {renderPaginationItems()}
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default MainPage;