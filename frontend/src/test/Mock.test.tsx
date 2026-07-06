import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi, describe } from 'vitest'; 
import ButtonComponent from '../components/ButtonComponent';

describe('ButtonComponent', () => {
  test('calls onButtonClick when button is clicked', () => {
    const mockHandleButtonClick = vi.fn();
    
    render(<ButtonComponent onButtonClick={mockHandleButtonClick} />);

    const button = screen.getByText(/Click me/i);
    
    fireEvent.click(button);

    expect(mockHandleButtonClick).toHaveBeenCalledTimes(1);
  });
});