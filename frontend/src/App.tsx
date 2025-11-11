// /frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './router/ProtectedRoute';
import { PublicRoute } from './router/PublicRoute';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage'; 

import DetailPage from './pages/DetailPage'; 

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<MainPage />} /> 
                        <Route path="/pokemon/:id" element={<DetailPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;