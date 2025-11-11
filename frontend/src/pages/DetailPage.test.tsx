// /frontend/src/pages/DetailPage.test.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

// Jest-DOM Matchers Import (for toHaveTextContent, toBeInTheDocument, etc.)
import '@testing-library/jest-dom/extend-expect'; 

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DetailPage from './DetailPage';
import api from '../api/axios'; // Import the real API client object

// --- MOCK DATA ---
const mockPokemonDetail = {
    // ... (Mock data remains the same)
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    abilities: [{ ability: { name: 'static', url: 'mock/url' } }],
    moves: [{ move: { name: 'thunder-shock', url: 'mock/url' } }, { move: { name: 'quick-attack', url: 'mock/url' } }],
    forms: [{ name: 'pikachu', url: 'mock/url' }],
    sprites: {
        front_default: 'mock-url',
        back_default: 'mock-url',
        other: {
            'official-artwork': {
                front_default: 'mock-artwork-url',
            },
        },
    },
};

// ... (Dependency Mocking remains the same) ...
const mockNavigate = vi.fn();
let mockUseParams = { id: '25' }; 

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useParams: () => mockUseParams,
        useNavigate: () => mockNavigate,
        Link: (actual as any).Link,
    };
});

describe('DetailPage', () => {
    let apiGetSpy: ReturnType<typeof vi.spyOn>; 

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseParams = { id: '25' };
        apiGetSpy = vi.spyOn(api, 'get');
    });
    
    afterEach(() => {
        apiGetSpy.mockRestore(); 
    });

    const renderComponent = () => {
        return render(<DetailPage />);
    };

    it('1. Should show the loading state initially', () => {
        apiGetSpy.mockReturnValue(new Promise(() => {})); 
        renderComponent();
        expect(screen.getByText(/Loading details.../i)).toBeInTheDocument();
    });

    it('2. Should render Pokémon details correctly on successful fetch', async () => {
        apiGetSpy.mockResolvedValue({ data: mockPokemonDetail }); 
        renderComponent();

        await waitFor(() => {
            // FIX: Use getAllByText to find the name (appears in title and form)
            // and assert that the main title element is present.
            expect(screen.getAllByText(/pikachu/i)[0]).toBeInTheDocument(); 
            
            expect(screen.getByText(/#025/)).toBeInTheDocument();
            expect(screen.getByText(/static/i)).toBeInTheDocument(); 
            expect(apiGetSpy).toHaveBeenCalledWith('/pokemons/25');
        });
    });
    
    it('3. Should show an error message when the API fetch fails', async () => {
        apiGetSpy.mockRejectedValue(new Error('API error')); 
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(
                'No se pudo cargar el detalle del Pokémon.'
            );
        });
        expect(screen.getByRole('button', { name: /Back to list/i })).toBeInTheDocument();
    });
    
    it('4. Should navigate back to the main list when the button is clicked', async () => {
        apiGetSpy.mockResolvedValue({ data: mockPokemonDetail }); 
        renderComponent();
        
        await waitFor(() => {
            // FIX: Use getAllByText for the assertion check
            expect(screen.getAllByText(/pikachu/i)[0]).toBeInTheDocument(); 
        });

        const backButton = screen.getByRole('button', { name: /Back to list/i });
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});