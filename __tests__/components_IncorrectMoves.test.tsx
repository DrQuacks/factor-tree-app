import { render, screen } from '@testing-library/react';
import IncorrectMoves from '../components/IncorrectMoves';

describe('IncorrectMoves', () => {
  it('renders the incorrect moves count', () => {
    render(<IncorrectMoves count={5} />);
    expect(screen.getByText(/Incorrect: 5/)).toBeInTheDocument();
  });
}); 