import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders navigation links', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Admin/i)).toBeInTheDocument();
  expect(screen.getByText(/Driver/i)).toBeInTheDocument();
});
