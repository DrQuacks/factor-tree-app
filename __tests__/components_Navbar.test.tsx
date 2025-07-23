import { render, screen } from './test-utils';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  it('renders the title', () => {
    render(
      <Navbar
        onNewNumber={() => {}}
        onHint={() => {}}
        onFullyFactored={() => {}}
        onDifficultyChange={() => {}}
        currentDifficulty="MEDIUM"
        incorrectMoves={0}
      />
    );
    // Use getAllByText to get all instances and check that at least one exists
    const titleElements = screen.getAllByText(/Prime Factor Trees/i);
    expect(titleElements.length).toBeGreaterThan(0);
  });
}); 