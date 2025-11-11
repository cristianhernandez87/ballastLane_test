/* eslint-disable @typescript-eslint/no-explicit-any */
// /frontend/src/pages/LoginPage.test.tsx

import '@testing-library/jest-dom/extend-expect'; 

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

const mockLogin = vi.fn();

vi.mock('../context/AuthContext', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useAuth: () => ({
            isLoggedIn: false, // Assume not logged in at the start of the test
            login: mockLogin,
            logout: vi.fn(),
        }),
    };
});

// 2. Mocking navigation (to prevent errors in useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useNavigate: () => mockNavigate,
        // BrowserRouter and Link must be exposed for the component to render
        BrowserRouter: (actual as any).BrowserRouter,
        Link: (actual as any).Link, 
    };
});


describe('LoginPage', () => {
    
    beforeEach(() => {
        // Clear mocks before each test to prevent interference
        mockLogin.mockClear();
        mockNavigate.mockClear();
    });
    
    // Helper function to render the component (without AuthProvider)
    const renderComponent = () => {
        // Only BrowserRouter is needed (for the router)
        return render(
            <BrowserRouter> 
                <LoginPage />
            </BrowserRouter>
        );
    };

    it('1. Should show an error message when login with wrong credentials fails', async () => {
        // ARRANGE: Set up mock for failed login
        mockLogin.mockResolvedValue(false); // 'login' function returns 'false' (failure)

        renderComponent();
        
        // CORRECTION: Use getByLabelText with English labels from the component ('User', 'Password')
        const usernameInput = screen.getByLabelText('User'); 
        const passwordInput = screen.getByLabelText('Password');
        // CORRECTION: Use the actual button name: "Login"
        const submitButton = screen.getByRole('button', { name: /Login/i });

        fireEvent.change(usernameInput, { target: { value: 'wrong-user' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong-pass' } });

        // Simulate form submission
        fireEvent.click(submitButton);

        // ASSERT: Wait until the error message appears
        await waitFor(() => {
            // The error message must be visible
            expect(screen.getByRole('alert')).toHaveTextContent(
                'Credenciales incorrectas. (Pista: admin/admin)'
            );
        });

        expect(mockLogin).toHaveBeenCalledWith('wrong-user', 'wrong-pass');
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('2. Should navigate to the main route (/) if login is successful', async () => {
        // ARRANGE: Set up mock for successful login
        mockLogin.mockResolvedValue(true); // 'login' function returns 'true' (success)

        renderComponent();
        
        // CORRECTION: Use getByLabelText with English labels
        const usernameInput = screen.getByLabelText('User'); 
        const passwordInput = screen.getByLabelText('Password');
        // CORRECTION: Use the actual button name: "Login"
        const submitButton = screen.getByRole('button', { name: /Login/i }); 

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });

        fireEvent.click(submitButton);

        // ASSERT: Wait for navigation to execute
        await waitFor(() => {
            // Check that the navigate function was called to the main route
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
        
        expect(mockLogin).toHaveBeenCalledWith('admin', 'admin');
    });
    
    it('3. Should display an error message if fields are empty (UI Validation)', async () => {
        // ARRANGE: mockLogin should never be called in this case
        renderComponent();
        
        // CORRECTION: Use getByLabelText with English labels
        const usernameInput = screen.getByLabelText('User'); 
        const passwordInput = screen.getByLabelText('Password');
        // CORRECTION: Use the actual button name: "Login"
        const submitButton = screen.getByRole('button', { name: /Login/i }); 

        // ACT: Enter no data (leave fields empty)
        fireEvent.change(usernameInput, { target: { value: '' } });
        fireEvent.change(passwordInput, { target: { value: '' } });

        fireEvent.click(submitButton);

        // ASSERT: Wait until the validation error message appears
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(
                'Usuario y contraseña son requeridos.'
            );
        });
        
        // Check that the login function was NEVER called (validation stopped it)
        expect(mockLogin).not.toHaveBeenCalled();
    });
});