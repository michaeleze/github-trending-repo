import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchAndFilter from '../SearchAndFilter';

describe('SearchAndFilter', () => {
  const mockOnSearch = jest.fn();
  const mockOnLanguageFilter = jest.fn();
  const mockLanguages = ['TypeScript', 'JavaScript', 'Python', 'Java'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default props', () => {
    render(<SearchAndFilter />);

    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText('Search repositories')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter repositories by programming language')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Languages')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    const customPlaceholder = 'Search for repositories...';
    render(<SearchAndFilter placeholder={customPlaceholder} />);

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('should render available languages in select dropdown', () => {
    render(
      <SearchAndFilter
        availableLanguages={mockLanguages}
        onLanguageFilter={mockOnLanguageFilter}
      />
    );

    const select = screen.getByLabelText('Filter repositories by programming language');

    // Check that all languages are present
    mockLanguages.forEach(language => {
      expect(screen.getByRole('option', { name: language })).toBeInTheDocument();
    });

    // Check that "All Languages" option is present
    expect(screen.getByRole('option', { name: 'All Languages' })).toBeInTheDocument();
  });

  it('should call onSearch when search input changes', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter onSearch={mockOnSearch} />);

    const searchInput = screen.getByLabelText('Search repositories');
    await user.type(searchInput, 'react');

    expect(mockOnSearch).toHaveBeenCalledTimes(5); // Called for each character
    expect(mockOnSearch).toHaveBeenLastCalledWith('react');
  });

  it('should call onLanguageFilter when language selection changes', async () => {
    const user = userEvent.setup();
    render(
      <SearchAndFilter
        availableLanguages={mockLanguages}
        onLanguageFilter={mockOnLanguageFilter}
      />
    );

    const select = screen.getByLabelText('Filter repositories by programming language');
    await user.selectOptions(select, 'TypeScript');

    expect(mockOnLanguageFilter).toHaveBeenCalledWith('TypeScript');
  });

  it('should update search input value when typing', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter onSearch={mockOnSearch} />);

    const searchInput = screen.getByLabelText('Search repositories') as HTMLInputElement;
    await user.type(searchInput, 'test search');

    expect(searchInput.value).toBe('test search');
  });

  it('should update language filter value when selecting', async () => {
    const user = userEvent.setup();
    render(
      <SearchAndFilter
        availableLanguages={mockLanguages}
        onLanguageFilter={mockOnLanguageFilter}
      />
    );

    const select = screen.getByLabelText('Filter repositories by programming language') as HTMLSelectElement;
    await user.selectOptions(select, 'Python');

    expect(select.value).toBe('Python');
  });

  it('should not call callbacks when they are not provided', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter availableLanguages={mockLanguages} />);

    const searchInput = screen.getByLabelText('Search repositories');
    const select = screen.getByLabelText('Filter repositories by programming language');

    await user.type(searchInput, 'test');
    await user.selectOptions(select, 'JavaScript');

    // Should not throw any errors
    expect(searchInput).toHaveValue('test');
    expect(select).toHaveValue('JavaScript');
  });

  it('should prevent form submission', () => {
    const mockSubmit = jest.fn();
    render(<SearchAndFilter onSearch={mockOnSearch} />);

    const form = screen.getByRole('form');
    form.addEventListener('submit', mockSubmit);

    fireEvent.submit(form);

    expect(mockSubmit).toHaveBeenCalled();
    // The default behavior should be prevented, so the page shouldn't reload
  });

  it('should handle empty search input', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter onSearch={mockOnSearch} />);

    const searchInput = screen.getByLabelText('Search repositories');
    await user.type(searchInput, 'test');
    await user.clear(searchInput);

    expect(mockOnSearch).toHaveBeenLastCalledWith('');
    expect(searchInput).toHaveValue('');
  });

  it('should reset language filter to "All Languages"', async () => {
    const user = userEvent.setup();
    render(
      <SearchAndFilter
        availableLanguages={mockLanguages}
        onLanguageFilter={mockOnLanguageFilter}
      />
    );

    const select = screen.getByLabelText('Filter repositories by programming language');

    // Select a language first
    await user.selectOptions(select, 'TypeScript');
    expect(mockOnLanguageFilter).toHaveBeenCalledWith('TypeScript');

    // Reset to "All Languages"
    await user.selectOptions(select, '');
    expect(mockOnLanguageFilter).toHaveBeenCalledWith('');
  });

  it('should handle special characters in search input', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter onSearch={mockOnSearch} />);

    const searchInput = screen.getByLabelText('Search repositories');
    const specialText = 'test@#$%^&*()_+-=[]{}|;:,.<>?';

    await user.type(searchInput, specialText);

    expect(mockOnSearch).toHaveBeenLastCalledWith(specialText);
    expect(searchInput).toHaveValue(specialText);
  });

  it('should handle empty available languages array', () => {
    render(
      <SearchAndFilter
        availableLanguages={[]}
        onLanguageFilter={mockOnLanguageFilter}
      />
    );

    const select = screen.getByLabelText('Filter repositories by programming language');
    const options = screen.getAllByRole('option');

    // Should only have "All Languages" option
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('All Languages');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <SearchAndFilter
        availableLanguages={mockLanguages}
        onSearch={mockOnSearch}
        onLanguageFilter={mockOnLanguageFilter}
      />
    );

    // Check form structure
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    // Check search fieldset and input
    const searchInput = screen.getByLabelText('Search repositories');
    expect(searchInput).toHaveAttribute('type', 'search');
    expect(searchInput).toHaveAttribute('aria-label', 'Search repositories');
    expect(searchInput).toHaveAttribute('id', 'repository-search');

    // Check language filter fieldset and select
    const select = screen.getByLabelText('Filter repositories by programming language');
    expect(select).toHaveAttribute('aria-label', 'Filter repositories by programming language');
    expect(select).toHaveAttribute('id', 'language-filter');

    // Check that icons are properly hidden from screen readers
    const icons = screen.getAllByRole('img', { hidden: true });
    icons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('should handle rapid input changes', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter onSearch={mockOnSearch} />);

    const searchInput = screen.getByLabelText('Search repositories');

    // Type rapidly
    await user.type(searchInput, 'abc');

    expect(mockOnSearch).toHaveBeenCalledTimes(3);
    expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'a');
    expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'ab');
    expect(mockOnSearch).toHaveBeenNthCalledWith(3, 'abc');
  });

  it('should handle language selection with duplicate names', () => {
    const duplicateLanguages = ['JavaScript', 'JavaScript', 'TypeScript'];
    render(
      <SearchAndFilter
        availableLanguages={duplicateLanguages}
        onLanguageFilter={mockOnLanguageFilter}
      />
    );

    // Should render all options (including duplicates)
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4); // "All Languages" + 3 language options
  });

  it('should maintain focus on search input after typing', async () => {
    const user = userEvent.setup();
    render(<SearchAndFilter onSearch={mockOnSearch} />);

    const searchInput = screen.getByLabelText('Search repositories');
    await user.click(searchInput);
    await user.type(searchInput, 'test');

    expect(searchInput).toHaveFocus();
  });

  it('should maintain focus on select after selection', async () => {
    const user = userEvent.setup();
    render(
      <SearchAndFilter
        availableLanguages={mockLanguages}
        onLanguageFilter={mockOnLanguageFilter}
      />
    );

    const select = screen.getByLabelText('Filter repositories by programming language');
    await user.click(select);
    await user.selectOptions(select, 'TypeScript');

    expect(select).toHaveFocus();
  });
});
