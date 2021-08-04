import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

jest.mock('axios', () => {
  return {
    create: () => {
      return {
        get: () => {
          return { data: { progress: 100 } };
        },
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() }
        }
      };
    }
  };
});

test('should redirect to /login if progress is 100', async () => {
  render(<App />);

  expect(await screen.findByText('Login')).toBeDefined();
});
