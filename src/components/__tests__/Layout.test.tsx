import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';

// Mock the sensor data hook
jest.mock('../../hooks/useSensorData', () => ({
  useSensorReading: () => ({
    data: { value: 25, unit: '°C', timestamp: '2024-01-01T00:00:00Z' },
    isLoading: false,
    error: null,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Layout />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('contains navigation elements', () => {
    renderWithRouter(<Layout />);
    // Check that Plants text exists (there are multiple instances, so use getAllByText)
    expect(screen.getAllByText(/Plants/i)).toHaveLength(3); // Header + 2 nav items
    expect(screen.getAllByText(/Sensors/i)).toHaveLength(2); // 2 nav items
  });
}); 