import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DynamicForm from '../../forms/DynamicForm';
import { defaultFieldConfigs } from '../../../data/fieldConfigs';

describe('DynamicForm Input Field Issues Tests', () => {
  const mockOnSubmit = jest.fn();
  const mockOnFieldChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CRITICAL: Form Reset and Data Prop Issues', () => {
    test('should handle rapid data prop changes without input freezing', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );

      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Initial input should work
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(firstNameInput).toHaveValue('John');

      // Simulate section switch - data prop changes
      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={{
            firstName: 'John',
            lastName: '',
            email: '',
            phone: '',
            summary: '',
          }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // After rerender, input should still work
      await waitFor(() => {
        const updatedFirstNameInput = screen.getByLabelText(/first name/i);
        expect(updatedFirstNameInput).toHaveValue('John');
      });

      const updatedFirstNameInput = screen.getByLabelText(/first name/i);
      expect(updatedFirstNameInput).not.toBeDisabled();

      // Should be able to continue typing
      fireEvent.change(updatedFirstNameInput, {
        target: { value: 'John Doe' },
      });
      expect(updatedFirstNameInput).toHaveValue('John Doe');
    });

    test('should not freeze inputs when reset() is called multiple times', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );

      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      const firstNameInput = screen.getByLabelText(/first name/i);

      // Simulate multiple rapid data changes (like section switching)
      const dataSets = [
        { firstName: 'John' },
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' },
        {},
      ];

      for (let i = 0; i < dataSets.length; i++) {
        rerender(
          <DynamicForm
            fields={personalInfoFields}
            data={dataSets[i]}
            onSubmit={mockOnSubmit}
            onFieldChange={mockOnFieldChange}
          />
        );

        await waitFor(() => {
          const currentInput = screen.getByLabelText(/first name/i);
          expect(currentInput).not.toBeDisabled();
        });
      }

      // Final test - should still be able to type
      const finalInput = screen.getByLabelText(/first name/i);
      fireEvent.change(finalInput, { target: { value: '' } });
      fireEvent.change(finalInput, { target: { value: 'Test' } });
      expect(finalInput).toHaveValue('Test');
    });

    test('should handle useForm dependency changes correctly', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );

      // Test with different field configurations to simulate section changes
      const experienceFields = defaultFieldConfigs.filter(
        f => f.section === 'experience'
      );

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

      // Switch to experience fields (simulating section change)
      rerender(
        <DynamicForm
          fields={experienceFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Should have experience fields now
      await waitFor(() => {
        expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      });

      const companyInput = screen.getByLabelText(/company name/i);
      expect(companyInput).not.toBeDisabled();

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

      // Should work correctly
      await waitFor(() => {
        const backToFirstName = screen.getByLabelText(/first name/i);
        expect(backToFirstName).toHaveValue('John');
        expect(backToFirstName).not.toBeDisabled();
      });
    });
  });

  describe('CRITICAL: useEffect Dependencies Issue', () => {
    test('should not cause infinite reset loops', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );
      const initialData = { firstName: 'John' };

      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={initialData}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).toHaveValue('John');

      // Simulate the same data being passed again (should not cause reset)
      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={initialData}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Should still be editable
      fireEvent.change(firstNameInput, { target: { value: 'John Doe' } });
      expect(firstNameInput).toHaveValue('John Doe');
    });

    test('should handle watch/setValue conflicts', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );

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

      // Type in multiple fields rapidly to test watch conflicts
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Doe');

      // Both should remain editable
      expect(firstNameInput).not.toBeDisabled();
      expect(lastNameInput).not.toBeDisabled();

      // Continue editing
      fireEvent.change(firstNameInput, { target: { value: 'John Jr.' } });
      expect(firstNameInput).toHaveValue('John Jr.');
    });
  });

  describe('CRITICAL: Form Validation State Issues', () => {
    test('should not disable inputs due to validation state changes', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );

      render(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      const emailInput = screen.getByLabelText(/email/i);

      // Enter invalid email
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      // Input should still be editable even with validation error
      expect(emailInput).not.toBeDisabled();

      // Should be able to correct the email
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });

      expect(emailInput).toHaveValue('valid@email.com');
      expect(emailInput).not.toBeDisabled();
    });

    test('should handle form mode changes correctly', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );

      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John' } });

      // Force re-render with same props to test stability
      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Should maintain functionality
      await waitFor(() => {
        const maintainedInput = screen.getByLabelText(/first name/i);
        expect(maintainedInput).not.toBeDisabled();
      });
    });
  });
});
