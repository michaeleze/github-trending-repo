import { render, screen } from '@testing-library/react';
import LanguageChip from './LanguageChip';

describe('LanguageChip', () => {
  it('renders the language name', () => {
    render(<LanguageChip language="TypeScript" />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('⌨️')).toBeInTheDocument();
  });

  it('does not render when language is null', () => {
    const { container } = render(<LanguageChip language={''} />);

    expect(container.firstChild).toBeNull();
  });
});
