import { render, screen } from './test-utils';
import Index from '../pages/index';

// Mock the useSession hook
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: () => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        image: 'https://example.com/avatar.jpg',
      },
    },
    status: 'authenticated',
  }),
}));

describe('Index Page', () => {
  it('renders the game title', () => {
    render(<Index />);
    // Use getAllByText to get all instances and check that at least one exists
    const titleElements = screen.getAllByText(/Prime Factor Trees/i);
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it('renders game controls', () => {
    render(<Index />);
    // Check for buttons or interactive elements instead of specific text
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check that the page renders without crashing by verifying buttons exist
    expect(buttons.length).toBeGreaterThan(0);
  });
}); 