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

  it('applies correct styling', () => {
    render(<LanguageChip language="JavaScript" />);

    const chip = screen.getByText('JavaScript').closest('div');
    expect(chip).toHaveClass('languageChip');

    const icon = screen.getByText('⌨️');
    expect(icon).toHaveClass('codeIcon');

    const label = screen.getByText('JavaScript');
    expect(label).toHaveClass('label');
  });
});
