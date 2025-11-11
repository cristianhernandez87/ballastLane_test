// /frontend/src/components/PokemonCard.tsx
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { PokemonListItem } from '../types';

interface PokemonCardProps {
    pokemon: PokemonListItem;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
    return (
        <Link to={`/pokemon/${pokemon.id}`} style={{ textDecoration: 'none' }}>
            <Card className="text-center shadow-sm h-100">
                <Card.Img 
                    variant="top" 
                    src={pokemon.image} 
                    alt={pokemon.name} 
                    style={{ width: '120px', margin: '10px auto 0' }}
                />
                <Card.Body>
                    <Card.Title className="text-capitalize">
                        {pokemon.name}
                    </Card.Title>
                    <Card.Text className="text-muted">
                        #{String(pokemon.id).padStart(3, '0')}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default PokemonCard;