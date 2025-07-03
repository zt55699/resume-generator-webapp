import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicForm from '../DynamicForm';
import { defaultFieldConfigs } from '../../../data/fieldConfigs';

describe('DynamicForm - Simplified Functionality Tests', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render text inputs without infinite loops', () => {
    const personalInfoFields = defaultFieldConfigs.filter(
      f => f.section === 'personalInfo'
    );

    render(
      <DynamicForm
        fields={personalInfoFields}
        data={{}}
        onSubmit={mockOnSubmit}
      />
    );

    // Should render all personal info fields
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  test('should handle basic typing without errors', () => {
    const personalInfoFields = defaultFieldConfigs.filter(
      f => f.section === 'personalInfo'
    );

    render(
      <DynamicForm
        fields={personalInfoFields}
        data={{}}
        onSubmit={mockOnSubmit}
      />
    );

    const firstNameInput = screen.getByLabelText(/first name/i);

    // Should be able to type without errors
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput).toHaveValue('John');

    // Should be able to continue typing
    fireEvent.change(firstNameInput, { target: { value: 'John Doe' } });
    expect(firstNameInput).toHaveValue('John Doe');
  });

  test('should handle multiple field typing', () => {
    const personalInfoFields = defaultFieldConfigs.filter(
      f => f.section === 'personalInfo'
    );

    render(
      <DynamicForm
        fields={personalInfoFields}
        data={{}}
        onSubmit={mockOnSubmit}
      />
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);

    // Type in multiple fields
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    // All fields should maintain their values
    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john@example.com');
  });

  test('should handle form submission', () => {
    const personalInfoFields = defaultFieldConfigs.filter(
      f => f.section === 'personalInfo'
    );

    render(
      <DynamicForm
        fields={personalInfoFields}
        data={{}}
        onSubmit={mockOnSubmit}
      />
    );

    const firstNameInput = screen.getByLabelText(/first name/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Fill a field and submit
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    // Should call onSubmit
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('should work with pre-filled data', () => {
    const personalInfoFields = defaultFieldConfigs.filter(
      f => f.section === 'personalInfo'
    );
    const initialData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    };

    render(
      <DynamicForm
        fields={personalInfoFields}
        data={initialData}
        onSubmit={mockOnSubmit}
      />
    );

    // Should display pre-filled data
    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();

    // Should still be editable
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'Janet' } });
    expect(firstNameInput).toHaveValue('Janet');
  });
});
