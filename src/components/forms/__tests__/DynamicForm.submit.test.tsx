import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicForm from '../DynamicForm';
import { defaultFieldConfigs } from '../../../data/fieldConfigs';

describe('DynamicForm - Manual Save Functionality', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call onSubmit when Save Section button is clicked', () => {
    const personalInfoFields = defaultFieldConfigs.filter(
      f => f.section === 'personalInfo'
    );

    render(
      <DynamicForm
        fields={personalInfoFields}
        data={{}}
        onSubmit={mockOnSubmit}
        submitButtonText='Save Section'
      />
    );

    // Fill some data
    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    // Find and click the save button
    const saveButton = screen.getByRole('button', { name: /save section/i });
    fireEvent.click(saveButton);

    // Should call onSubmit
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  test('should pass form data to onSubmit when saved', () => {
    const personalInfoFields = defaultFieldConfigs.filter(
      f => f.section === 'personalInfo'
    );

    render(
      <DynamicForm
        fields={personalInfoFields}
        data={{}}
        onSubmit={mockOnSubmit}
        submitButtonText='Save Section'
      />
    );

    // Fill multiple fields
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    // Click save button
    const saveButton = screen.getByRole('button', { name: /save section/i });
    fireEvent.click(saveButton);

    // Should call onSubmit with the form data
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      })
    );
  });

  test('should work with different submit button text', () => {
    const personalInfoFields = defaultFieldConfigs.filter(
      f => f.section === 'personalInfo'
    );

    render(
      <DynamicForm
        fields={personalInfoFields}
        data={{}}
        onSubmit={mockOnSubmit}
        submitButtonText='Save My Info'
      />
    );

    const saveButton = screen.getByRole('button', { name: /save my info/i });
    fireEvent.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('should work with experience section data', () => {
    const experienceFields = defaultFieldConfigs.filter(
      f => f.section === 'experience'
    );

    render(
      <DynamicForm
        fields={experienceFields}
        data={{}}
        onSubmit={mockOnSubmit}
        submitButtonText='Save Experience'
      />
    );

    // Fill experience data
    const companyInput = screen.getByLabelText(/company name/i);
    const positionInput = screen.getByLabelText(/job title/i);

    fireEvent.change(companyInput, { target: { value: 'Tech Corp' } });
    fireEvent.change(positionInput, { target: { value: 'Developer' } });

    // Save the section
    const saveButton = screen.getByRole('button', { name: /save experience/i });
    fireEvent.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        company: 'Tech Corp',
        position: 'Developer',
      })
    );
  });
});
