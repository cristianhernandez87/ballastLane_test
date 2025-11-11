// /frontend/src/types/index.ts
export interface AuthContextType {
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

// Interface para un solo Pokémon en la lista
export interface PokemonListItem {
    name: string;
    url: string; 
    // Añadiremos el ID y la imagen después de procesar la URL
    id: number;
    image: string;
}

// Interface para la respuesta paginada de nuestra API
export interface PaginatedPokemonResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: { name: string; url: string }[]; // La data cruda de la API
}

export interface PokemonAbility {
    ability: {
        name: string;
        url: string;
    };
}

export interface PokemonMove {
    move: {
        name: string;
        url: string;
    };
}

export interface PokemonForm {
    name: string;
    url: string;
}

export interface PokemonSprites {
    front_default: string;
    back_default: string;
    other: {
        'official-artwork': {
            front_default: string;
        };
    };
}

// Interface para el Pokémon detallado (Respuesta de /api/pokemons/:id)
export interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    abilities: PokemonAbility[];
    moves: PokemonMove[];
    forms: PokemonForm[];
    sprites: PokemonSprites;
}