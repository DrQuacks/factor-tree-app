import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer', () => {
  it('renders the Hint and New Game buttons', () => {
    render(
      <Footer
        handleHint={() => {}}
        handleFullyFactored={() => {}}
        incorrectMoves={2}
        handleNewGame={() => {}}
      />
    );
    expect(screen.getByText(/Hint/i)).toBeInTheDocument();
    expect(screen.getByText(/New Game/i)).toBeInTheDocument();
  });
}); 