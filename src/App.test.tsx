import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders boilerplate', () => {
  render(<App />)
  const linkElement = screen.getByText(/A boilerplate for React application/i)
  expect(linkElement).toBeInTheDocument()
})
