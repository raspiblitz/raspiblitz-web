import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

test('should redirect to /login', () => {
  render(<App />);
  expect(window.location.pathname).toEqual('/login');
});
