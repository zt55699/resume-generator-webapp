import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DynamicForm from '../../forms/DynamicForm';
import { defaultFieldConfigs } from '../../../data/fieldConfigs';

describe('DynamicForm - TDD Tests for Form Input Issues', () => {
  const mockOnSubmit = jest.fn();
  const mockOnFieldChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CRITICAL TEST 1: Personal Information Section Fields', () => {
    test('should render ALL personal info input fields', () => {
      const personalInfoFields = defaultFieldConfigs.filter(f => f.section === 'personalInfo');
      const mockPersonalData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        summary: ''
      };

      render(
        <DynamicForm
          fields={personalInfoFields}
          data={mockPersonalData}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // SHOULD FIND: First Name input
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      
      // SHOULD FIND: Last Name input
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      
      // SHOULD FIND: Email input
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      
      // SHOULD FIND: Phone input
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      
      // SHOULD FIND: Professional Summary textarea
      expect(screen.getByLabelText(/professional summary/i)).toBeInTheDocument();
    });

    test('should respond to typing in input fields', async () => {
      const personalInfoFields = defaultFieldConfigs.filter(f => f.section === 'personalInfo');
      const mockPersonalData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        summary: ''
      };

      render(
        <DynamicForm
          fields={personalInfoFields}
          data={mockPersonalData}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // Type in first name
      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      
      // SHOULD: Display typed text
      expect(firstNameInput).toHaveValue('John');
      
      // SHOULD: Call onFieldChange
      expect(mockOnFieldChange).toHaveBeenCalledWith('firstName', 'John');
    });
  });

  describe('CRITICAL TEST 2: Education Section Fields', () => {
    test('should render education input fields', () => {
      const educationFields = defaultFieldConfigs.filter(f => f.section === 'education');
      
      render(
        <DynamicForm
          fields={educationFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // SHOULD FIND: Institution input
      expect(screen.getByLabelText(/institution/i)).toBeInTheDocument();
      
      // SHOULD FIND: Degree input
      expect(screen.getByLabelText(/degree/i)).toBeInTheDocument();
      
      // SHOULD FIND: Field of Study input
      expect(screen.getByLabelText(/field of study/i)).toBeInTheDocument();
    });
  });

  describe('CRITICAL TEST 3: Education Section Fields', () => {
    test('should render education input fields', () => {
      const educationFields = defaultFieldConfigs.filter(f => f.section === 'education');
      
      render(
        <DynamicForm
          fields={educationFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      // SHOULD FIND: Institution Name input
      expect(screen.getByLabelText(/institution name/i)).toBeInTheDocument();
      
      // SHOULD FIND: Degree input
      expect(screen.getByLabelText(/degree/i)).toBeInTheDocument();
      
      // SHOULD FIND: Field of Study input
      expect(screen.getByLabelText(/field of study/i)).toBeInTheDocument();
    });
  });

  describe('CRITICAL TEST 4: Field Configuration Coverage', () => {
    test('should have field configurations for all expected sections', () => {
      const sections = ['personalInfo', 'education', 'skills', 'experience', 'projects', 'certifications', 'languages', 'references', 'customSections'];
      
      sections.forEach(section => {
        const sectionFields = defaultFieldConfigs.filter(f => f.section === section);
        expect(sectionFields.length).toBeGreaterThan(0);
      });
    });

    test('personal info section should have minimum required fields', () => {
      const personalInfoFields = defaultFieldConfigs.filter(f => f.section === 'personalInfo');
      const fieldNames = personalInfoFields.map(f => f.name);
      
      expect(fieldNames).toContain('firstName');
      expect(fieldNames).toContain('lastName');
      expect(fieldNames).toContain('email');
      expect(fieldNames).toContain('phone');
      expect(fieldNames).toContain('summary');
    });
  });

  describe('CRITICAL TEST 5: Form Rendering Logic', () => {
    test('should render fields when visible=true', () => {
      const testFields = [
        {
          id: 'test-field',
          name: 'testField',
          type: 'text' as const,
          label: 'Test Field',
          required: false,
          section: 'personalInfo' as const,
          order: 1,
          visible: true
        }
      ];

      render(
        <DynamicForm
          fields={testFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      expect(screen.getByLabelText(/test field/i)).toBeInTheDocument();
    });

    test('should NOT render fields when visible=false', () => {
      const testFields = [
        {
          id: 'hidden-field',
          name: 'hiddenField',
          type: 'text' as const,
          label: 'Hidden Field',
          required: false,
          section: 'personalInfo' as const,
          order: 1,
          visible: false
        }
      ];

      render(
        <DynamicForm
          fields={testFields}
          data={{}}
          onSubmit={mockOnSubmit}
          onFieldChange={mockOnFieldChange}
        />
      );

      expect(screen.queryByLabelText(/hidden field/i)).not.toBeInTheDocument();
    });
  });
});