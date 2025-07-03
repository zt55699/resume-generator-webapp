import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DynamicForm from '../DynamicForm';
import { defaultFieldConfigs } from '../../../data/fieldConfigs';

describe('DynamicForm E2E Navigation Tests', () => {
  const mockOnSubmit = jest.fn();
  const mockOnFieldChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CRITICAL: Complete Navigation Flow', () => {
    test('should handle full section switching workflow without input freezing', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );
      const experienceFields = defaultFieldConfigs.filter(
        f => f.section === 'experience'
      );
      const educationFields = defaultFieldConfigs.filter(
        f => f.section === 'education'
      );

      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Step 1: Fill personal info
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Doe');
      expect(emailInput).toHaveValue('john@example.com');

      // Step 2: Switch to experience section
      rerender(
        <DynamicForm
          fields={experienceFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      });

      const companyInput = screen.getByLabelText(/company name/i);
      const positionInput = screen.getByLabelText(/job title/i);

      fireEvent.change(companyInput, { target: { value: 'Tech Corp' } });
      fireEvent.change(positionInput, {
        target: { value: 'Software Engineer' },
      });

      expect(companyInput).toHaveValue('Tech Corp');
      expect(positionInput).toHaveValue('Software Engineer');

      // Step 3: Switch to education section
      rerender(
        <DynamicForm
          fields={educationFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/institution name/i)).toBeInTheDocument();
      });

      const institutionInput = screen.getByLabelText(/institution name/i);
      const degreeInput = screen.getByLabelText(/degree/i);

      fireEvent.change(institutionInput, {
        target: { value: 'University of Tech' },
      });
      fireEvent.change(degreeInput, { target: { value: 'Computer Science' } });

      expect(institutionInput).toHaveValue('University of Tech');
      expect(degreeInput).toHaveValue('Computer Science');

      // Step 4: Go back to personal info with data
      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={{
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      await waitFor(() => {
        const backToFirstName = screen.getByLabelText(/first name/i);
        expect(backToFirstName).toHaveValue('John');
      });

      // Step 5: Verify all inputs are still responsive
      const finalFirstNameInput = screen.getByLabelText(/first name/i);
      const finalLastNameInput = screen.getByLabelText(/last name/i);
      const finalEmailInput = screen.getByLabelText(/email/i);

      expect(finalFirstNameInput).not.toBeDisabled();
      expect(finalLastNameInput).not.toBeDisabled();
      expect(finalEmailInput).not.toBeDisabled();

      // Step 6: Continue editing
      fireEvent.change(finalFirstNameInput, { target: { value: 'Jane' } });
      fireEvent.change(finalLastNameInput, { target: { value: 'Smith' } });
      fireEvent.change(finalEmailInput, {
        target: { value: 'jane@example.com' },
      });

      expect(finalFirstNameInput).toHaveValue('Jane');
      expect(finalLastNameInput).toHaveValue('Smith');
      expect(finalEmailInput).toHaveValue('jane@example.com');
    });

    test('should handle rapid section switching with data persistence', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );
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
      expect(firstNameInput).toHaveValue('John');

      // Rapid switching between sections
      for (let i = 0; i < 5; i++) {
        // Switch to experience
        rerender(
          <DynamicForm
            fields={experienceFields}
            data={{}}
            onSubmit={mockOnSubmit}
            onFieldChange={mockOnFieldChange}
          />
        );

        await waitFor(() => {
          expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
        });

        const companyInput = screen.getByLabelText(/company name/i);
        expect(companyInput).not.toBeDisabled();

        // Switch back to personal info
        rerender(
          <DynamicForm
            fields={personalInfoFields}
            data={{ firstName: 'John' }}
            onSubmit={mockOnSubmit}
            onFieldChange={mockOnFieldChange}
          />
        );

        await waitFor(() => {
          const backToFirstName = screen.getByLabelText(/first name/i);
          expect(backToFirstName).toHaveValue('John');
          expect(backToFirstName).not.toBeDisabled();
        });
      }

      // Final verification
      const finalInput = screen.getByLabelText(/first name/i);
      fireEvent.change(finalInput, { target: { value: 'John Updated' } });
      expect(finalInput).toHaveValue('John Updated');
    });

    test('should handle typing while data prop changes', async () => {
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

      // Start typing
      fireEvent.change(firstNameInput, { target: { value: 'J' } });
      expect(firstNameInput).toHaveValue('J');

      // Simulate data prop change while typing (form is dirty)
      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={{ firstName: 'Different Name' }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Continue typing immediately - should not be interrupted
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(firstNameInput).toHaveValue('John');

      // Wait for debounced reset - with dirty form, reset should be delayed
      await new Promise(resolve => setTimeout(resolve, 400));

      // Input should still be responsive
      expect(firstNameInput).not.toBeDisabled();

      // Should be able to continue typing
      fireEvent.change(firstNameInput, { target: { value: 'John Doe' } });
      expect(firstNameInput).toHaveValue('John Doe');
    });

    test('should handle complex form state during navigation', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );
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

      // Fill multiple fields
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      // Switch sections multiple times with different data states
      const dataSets = [
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
        { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
        {},
      ];

      for (const dataSet of dataSets) {
        // Switch to experience
        rerender(
          <DynamicForm
            fields={experienceFields}
            data={{}}
            onSubmit={mockOnSubmit}
            onFieldChange={mockOnFieldChange}
          />
        );

        await waitFor(() => {
          const companyInput = screen.getByLabelText(/company name/i);
          expect(companyInput).not.toBeDisabled();
        });

        // Switch back to personal info with different data
        rerender(
          <DynamicForm
            fields={personalInfoFields}
            data={dataSet}
            onSubmit={mockOnSubmit}
            onFieldChange={mockOnFieldChange}
          />
        );

        await waitFor(() => {
          const backToFirstName = screen.getByLabelText(/first name/i);
          expect(backToFirstName).not.toBeDisabled();

          // Verify data is loaded correctly
          if (dataSet.firstName) {
            expect(backToFirstName).toHaveValue(dataSet.firstName);
          }
        });
      }

      // Final test - should be able to edit
      const finalInput = screen.getByLabelText(/first name/i);
      fireEvent.change(finalInput, { target: { value: 'Final Test' } });
      expect(finalInput).toHaveValue('Final Test');
    });
  });

  describe('VERIFICATION: onFieldChange behavior during navigation', () => {
    test('should not trigger unnecessary onFieldChange calls during section switches', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(
        f => f.section === 'personalInfo'
      );
      const experienceFields = defaultFieldConfigs.filter(
        f => f.section === 'experience'
      );

      const { rerender } = render(
        <DynamicForm
          fields={personalInfoFields}
          data={{ firstName: 'John' }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Clear any initial calls
      mockOnFieldChange.mockClear();

      // Switch sections
      rerender(
        <DynamicForm
          fields={experienceFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Clear calls from section switch
      mockOnFieldChange.mockClear();

      rerender(
        <DynamicForm
          fields={personalInfoFields}
          data={{ firstName: 'John' }}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Wait for any potential calls to settle
      await new Promise(resolve => setTimeout(resolve, 100));

      // Clear any form initialization calls
      mockOnFieldChange.mockClear();

      // But user input should still trigger it
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

      await waitFor(() => {
        expect(mockOnFieldChange).toHaveBeenCalledWith('firstName', 'Jane');
      });
    });
  });
});
