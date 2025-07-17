import { RepositoriesProvider } from './context/app/Repositories.provider';
import { ThemeProvider } from './context/theme/Theme.provider';
import ThemeToggle from './components/ui/ThemeToggle';
import RepositoriesPage from './app/Repositories.page';
import './global.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <header className="app-header">
          <ThemeToggle />
        </header>
        <RepositoriesProvider>
          <RepositoriesPage />
        </RepositoriesProvider>
      </div>
    </ThemeProvider>
  );
}

export default App
