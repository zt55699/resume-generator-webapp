import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DynamicForm from '../DynamicForm';
import { defaultFieldConfigs } from '../../../data/fieldConfigs';

describe('DynamicForm Input Field Fix Tests', () => {
  const mockOnSubmit = jest.fn();
  const mockOnFieldChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CRITICAL: Fixed Input Field Issues', () => {
    test('should not freeze inputs when data prop changes rapidly', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(f => f.section === 'personalInfo');
      
      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Type in first name
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(firstNameInput).toHaveValue('John');

      // Simulate rapid data prop changes (like section switching)
      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={{ firstName: 'John' }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Input should still be responsive
      await waitFor(() => {
        const updatedInput = screen.getByLabelText(/first name/i);
        expect(updatedInput).toHaveValue('John');
      });

      const finalInput = screen.getByLabelText(/first name/i);
      fireEvent.change(finalInput, { target: { value: 'John Doe' } });
      expect(finalInput).toHaveValue('John Doe');
    });

    test('should handle multiple rapid field changes without conflicts', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(f => f.section === 'personalInfo');
      
      render(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);

      // Rapidly change multiple fields
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

      expect(firstNameInput).toHaveValue('Jane');
      expect(lastNameInput).toHaveValue('Doe');

      // Should be able to continue editing
      fireEvent.change(firstNameInput, { target: { value: 'Jane Smith' } });
      expect(firstNameInput).toHaveValue('Jane Smith');
    });

    test('should not reset form while user is actively typing', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(f => f.section === 'personalInfo');
      
      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      
      // Start typing
      fireEvent.change(firstNameInput, { target: { value: 'J' } });
      fireEvent.change(firstNameInput, { target: { value: 'Jo' } });
      
      // Simulate data prop change while typing
      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={{ firstName: 'Different Value' }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Continue typing immediately - should not be interrupted
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(firstNameInput).toHaveValue('John');
    });

    test('should handle section switching without losing input responsiveness', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(f => f.section === 'personalInfo');
      const experienceFields = defaultFieldConfigs.filter(f => f.section === 'experience');
      
      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Fill personal info
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John' } });

      // Switch to experience section
      rerender(
        <DynamicForm
          fields={experienceFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Experience fields should work
      await waitFor(() => {
        expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      });

      const companyInput = screen.getByLabelText(/company name/i);
      fireEvent.change(companyInput, { target: { value: 'Test Company' } });
      expect(companyInput).toHaveValue('Test Company');

      // Switch back to personal info
      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={{ firstName: 'John' }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Should be responsive again
      await waitFor(() => {
        const backToFirstName = screen.getByLabelText(/first name/i);
        expect(backToFirstName).toHaveValue('John');
      });

      const finalFirstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(finalFirstNameInput, { target: { value: 'John Updated' } });
      expect(finalFirstNameInput).toHaveValue('John Updated');
    });
  });

  describe('VERIFICATION: onFieldChange optimization', () => {
    test('should not call onFieldChange unnecessarily', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(f => f.section === 'personalInfo');
      
      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={{ firstName: 'John' }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Clear previous calls
      mockOnFieldChange.mockClear();

      // Re-render with same data should not trigger onFieldChange
      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={{ firstName: 'John' }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // onFieldChange should not be called for unchanged data
      await waitFor(() => {
        expect(mockOnFieldChange).not.toHaveBeenCalled();
      });

      // But actual user input should still trigger it
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      
      await waitFor(() => {
        expect(mockOnFieldChange).toHaveBeenCalledWith('firstName', 'Jane');
      });
    });
  });
});