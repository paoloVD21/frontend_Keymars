import { AppRouter } from './routes/AppRouter';
import { AuthProvider } from './contexts/auth-provider';
import './App.css';

// Este es el componente principal de la aplicación
// Aquí se maneja el enrutamiento principal usando AppRouter
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
