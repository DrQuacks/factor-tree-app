require('@testing-library/jest-dom');
require('./__tests__/mocks');

// Make React available globally for JSX
global.React = require('react');

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));