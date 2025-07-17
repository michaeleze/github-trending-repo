import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import { ThemeProvider } from '../Theme.provider';
import { ThemeContext } from '../index';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test component to access theme context
const TestComponent = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset document body classes
    document.body.className = '';
  });

  it('should initialize with light theme when no stored theme', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
  });

  it('should initialize with stored light theme', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
  });

  it('should initialize with stored dark theme', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.body).toHaveClass('dark-theme');
    expect(document.body).not.toHaveClass('light-theme');
  });

  it('should toggle from light to dark theme', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.body).toHaveClass('light-theme');

    const toggleButton = screen.getByTestId('toggle-theme');
    act(() => {
      toggleButton.click();
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.body).toHaveClass('dark-theme');
    expect(document.body).not.toHaveClass('light-theme');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should toggle from dark to light theme', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.body).toHaveClass('dark-theme');

    const toggleButton = screen.getByTestId('toggle-theme');
    act(() => {
      toggleButton.click();
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should handle multiple theme toggles', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');

    // Toggle to dark
    act(() => {
      toggleButton.click();
    });
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.body).toHaveClass('dark-theme');

    // Toggle back to light
    act(() => {
      toggleButton.click();
    });
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.body).toHaveClass('light-theme');

    // Toggle to dark again
    act(() => {
      toggleButton.click();
    });
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.body).toHaveClass('dark-theme');

    expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(3);
    expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(1, 'theme', 'dark');
    expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(2, 'theme', 'light');
    expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(3, 'theme', 'dark');
  });

  it('should handle invalid stored theme value', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-theme');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should default to light theme for invalid values
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
  });

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Should not throw and default to light theme
    expect(() => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    }).not.toThrow();

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.body).toHaveClass('light-theme');
  });

  it('should handle localStorage setItem errors gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('light');
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage setItem error');
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    
    // Should not throw when localStorage.setItem fails
    expect(() => {
      act(() => {
        toggleButton.click();
      });
    }).not.toThrow();

    // Theme should still toggle in memory
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(document.body).toHaveClass('dark-theme');
  });

  it('should clean up previous theme class when switching', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initially light theme
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');

    const toggleButton = screen.getByTestId('toggle-theme');
    act(() => {
      toggleButton.click();
    });

    // Should remove light-theme and add dark-theme
    expect(document.body).not.toHaveClass('light-theme');
    expect(document.body).toHaveClass('dark-theme');

    act(() => {
      toggleButton.click();
    });

    // Should remove dark-theme and add light-theme
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
  });

  it('should preserve existing body classes when applying theme', () => {
    // Add some existing classes to body
    document.body.className = 'existing-class another-class';
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should add theme class while preserving existing classes
    expect(document.body).toHaveClass('existing-class');
    expect(document.body).toHaveClass('another-class');
    expect(document.body).toHaveClass('dark-theme');
    expect(document.body).not.toHaveClass('light-theme');
  });

  it('should call localStorage.getItem with correct key on initialization', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme');
  });

  it('should provide context to nested components', () => {
    const NestedComponent = () => {
      const { theme } = useContext(ThemeContext);
      return <div data-testid="nested-theme">{theme}</div>;
    };

    const MiddleComponent = () => (
      <div>
        <NestedComponent />
      </div>
    );

    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <MiddleComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('nested-theme')).toHaveTextContent('dark');
  });

  it('should handle rapid theme toggles', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');

    // Perform rapid toggles
    act(() => {
      toggleButton.click(); // light -> dark
      toggleButton.click(); // dark -> light
      toggleButton.click(); // light -> dark
      toggleButton.click(); // dark -> light
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    expect(document.body).toHaveClass('light-theme');
    expect(document.body).not.toHaveClass('dark-theme');
    expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(4);
  });
});