import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeContext, type ThemeContextType } from '@/context';
import ThemeToggle from '../ThemeToggle';

// Mock theme context provider for testing
const MockThemeProvider = ({ 
  children, 
  value 
}: { 
  children: React.ReactNode; 
  value: ThemeContextType; 
}) => (
  <ThemeContext.Provider value={value}>
    {children}
  </ThemeContext.Provider>
);

describe('ThemeToggle', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with light theme', () => {
    const contextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const container = screen.getByLabelText('Theme toggle');
    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    
    expect(container).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('should render with dark theme', () => {
    const contextValue: ThemeContextType = {
      theme: 'dark',
      toggleTheme: mockToggleTheme
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const container = screen.getByLabelText('Theme toggle');
    const button = screen.getByRole('button', { name: 'Switch to light mode' });
    
    expect(container).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('should display moon icon for light theme', () => {
    const contextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    const moonPath = button.querySelector('path[d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"]');
    
    expect(svg).toBeInTheDocument();
    expect(moonPath).toBeInTheDocument();
    expect(button.querySelector('circle')).not.toBeInTheDocument(); // Sun icon should not be present
  });

  it('should display sun icon for dark theme', () => {
    const contextValue: ThemeContextType = {
      theme: 'dark',
      toggleTheme: mockToggleTheme
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    const sunCircle = button.querySelector('circle[cx="12"][cy="12"][r="5"]');
    const sunLines = button.querySelectorAll('line');
    
    expect(svg).toBeInTheDocument();
    expect(sunCircle).toBeInTheDocument();
    expect(sunLines).toHaveLength(8); // Sun has 8 lines
    expect(button.querySelector('path')).not.toBeInTheDocument(); // Moon icon should not be present
  });

  it('should call toggleTheme when button is clicked', async () => {
    const user = userEvent.setup();
    const contextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should call toggleTheme multiple times on multiple clicks', async () => {
    const user = userEvent.setup();
    const contextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const button = screen.getByRole('button');
    
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(3);
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    const contextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const button = screen.getByRole('button');
    
    // Focus the button
    await user.tab();
    expect(button).toHaveFocus();
    
    // Press Enter to activate
    await user.keyboard('{Enter}');
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    
    // Press Space to activate
    await user.keyboard(' ');
    expect(mockToggleTheme).toHaveBeenCalledTimes(2);
  });

  it('should have correct SVG attributes for accessibility', () => {
    const contextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const svg = screen.getByRole('button').querySelector('svg');
    
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('strokeWidth', '2');
    expect(svg).toHaveAttribute('strokeLinecap', 'round');
    expect(svg).toHaveAttribute('strokeLinejoin', 'round');
  });

  it('should update aria-label when theme changes', () => {
    const contextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    const { rerender } = render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Update context to dark theme
    const updatedContextValue: ThemeContextType = {
      theme: 'dark',
      toggleTheme: mockToggleTheme
    };

    rerender(
      <MockThemeProvider value={updatedContextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('should handle rapid clicks without issues', async () => {
    const user = userEvent.setup();
    const contextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const button = screen.getByRole('button');
    
    // Perform rapid clicks
    await act(async () => {
      await user.click(button);
      await user.click(button);
      await user.click(button);
      await user.click(button);
      await user.click(button);
    });

    expect(mockToggleTheme).toHaveBeenCalledTimes(5);
  });

  it('should maintain button structure with different themes', () => {
    const lightContextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    const { rerender } = render(
      <MockThemeProvider value={lightContextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const container = screen.getByLabelText('Theme toggle');
    const button = screen.getByRole('button');
    
    expect(container).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();

    // Switch to dark theme
    const darkContextValue: ThemeContextType = {
      theme: 'dark',
      toggleTheme: mockToggleTheme
    };

    rerender(
      <MockThemeProvider value={darkContextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    // Structure should remain the same
    expect(container).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should handle context with undefined toggleTheme gracefully', async () => {
    const user = userEvent.setup();
    const contextValue: ThemeContextType = {
      theme: 'light',
      toggleTheme: undefined as any // Simulate undefined function
    };

    render(
      <MockThemeProvider value={contextValue}>
        <ThemeToggle />
      </MockThemeProvider>
    );

    const button = screen.getByRole('button');
    
    // Should not throw when clicking with undefined toggleTheme
    expect(() => {
      act(() => {
        button.click();
      });
    }).not.toThrow();
  });
});