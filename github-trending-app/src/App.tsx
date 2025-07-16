import { RepositoriesProvider } from './context/RepositoriesContext';
import RepositoriesPage from './pages/RepositoriesPage';
import './global.css';

function App() {
  return (
    <RepositoriesProvider>
      <RepositoriesPage />
    </RepositoriesProvider>
  );
}

export default App
