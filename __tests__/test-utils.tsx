import React from 'react';
import { render, RenderOptions, act } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

// Mock session data for testing
const mockSession = {
  data: {
    user: {
      name: 'Test User',
      email: 'test@example.com',
      image: 'https://example.com/avatar.jpg',
    },
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
  status: 'authenticated' as const,
};

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider session={mockSession.data}>
      {children}
    </SessionProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 