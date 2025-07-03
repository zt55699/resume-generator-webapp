import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ResumeProvider } from '../contexts/ResumeContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('Global Language Support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should default to Chinese language', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Check if Chinese text is displayed by default
    expect(screen.getByText(/简历信息/)).toBeInTheDocument();
  });

  test('should maintain language across all pages', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Start on home page in Chinese
    expect(screen.getByText(/简历信息/)).toBeInTheDocument();

    // Navigate to builder/form page
    const builderLink = screen.getByRole('link', { name: /Builder|构建器/ });
    fireEvent.click(builderLink);

    // Should still show Chinese on form page
    await waitFor(() => {
      expect(screen.getByText(/简历信息/)).toBeInTheDocument();
      expect(screen.getByText(/个人信息/)).toBeInTheDocument();
    });

    // Navigate to preview page
    const previewButton = screen.getByText(/预览和模板/);
    fireEvent.click(previewButton);

    // Should still show Chinese on preview page
    await waitFor(() => {
      expect(screen.getByText(/简历预览/)).toBeInTheDocument();
    });
  });

  test('should switch language globally when toggle is clicked', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Find language switcher and click to switch to English
    const languageSwitcher = screen.getByRole('button', { name: /中文|EN/ });
    fireEvent.click(languageSwitcher);

    // Should now show English text
    await waitFor(() => {
      expect(screen.getByText(/Resume Information/)).toBeInTheDocument();
    });

    // Navigate to another page - should still be English
    const templatesLink = screen.getByRole('link', { name: /Templates/ });
    fireEvent.click(templatesLink);

    await waitFor(() => {
      expect(screen.getByText(/Choose a Template/)).toBeInTheDocument();
    });

    // Switch back to Chinese
    fireEvent.click(languageSwitcher);

    await waitFor(() => {
      expect(screen.getByText(/选择模板/)).toBeInTheDocument();
    });
  });

  test('should persist language selection after page reload', () => {
    const { unmount } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Switch to English
    const languageSwitcher = screen.getByRole('button', { name: /中文|EN/ });
    fireEvent.click(languageSwitcher);

    // Verify localStorage was called
    expect(localStorage.setItem).toHaveBeenCalledWith('resume-language', 'en');

    // Unmount and remount to simulate page reload
    unmount();

    // Mock localStorage to return English
    localStorageMock.getItem.mockReturnValue('en');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Should load in English
    expect(screen.getByText(/Resume Information/)).toBeInTheDocument();
  });
});

describe('Name Validation with Language Support', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('Chinese name validation - should accept 1-4 Chinese characters', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to form
    const builderLink = screen.getByRole('link', { name: /Builder|构建器/ });
    fireEvent.click(builderLink);

    // Find first name input
    const firstNameInput = await screen.findByLabelText(/名|First Name/);

    // Test 1 Chinese character - should be valid
    fireEvent.change(firstNameInput, { target: { value: '王' } });
    await waitFor(() => {
      expect(screen.queryByText(/必须是1-4个中文字符/)).not.toBeInTheDocument();
    });

    // Test 3 Chinese characters - should be valid
    fireEvent.change(firstNameInput, { target: { value: '王小明' } });
    await waitFor(() => {
      expect(screen.queryByText(/必须是1-4个中文字符/)).not.toBeInTheDocument();
    });

    // Test English characters in Chinese mode - should show error
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    await waitFor(() => {
      expect(screen.getByText(/名字必须是1-4个中文字符/)).toBeInTheDocument();
    });

    // Test more than 4 Chinese characters - should show error
    fireEvent.change(firstNameInput, { target: { value: '王小明李四' } });
    await waitFor(() => {
      expect(screen.getByText(/名字必须是1-4个中文字符/)).toBeInTheDocument();
    });
  });

  test('English name validation - should accept 2+ English characters', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Switch to English
    const languageSwitcher = screen.getByRole('button', { name: /中文|EN/ });
    fireEvent.click(languageSwitcher);

    // Navigate to form
    const builderLink = screen.getByRole('link', { name: /Builder/ });
    fireEvent.click(builderLink);

    // Find first name input
    const firstNameInput = await screen.findByLabelText(/First Name/);

    // Test 1 character - should show error
    fireEvent.change(firstNameInput, { target: { value: 'J' } });
    await waitFor(() => {
      expect(
        screen.getByText(/First name must be 2-50 letters, spaces, or hyphens/)
      ).toBeInTheDocument();
    });

    // Test 2+ characters - should be valid
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    await waitFor(() => {
      expect(
        screen.queryByText(/First name must be 2-50 letters/)
      ).not.toBeInTheDocument();
    });

    // Test with spaces and hyphens - should be valid
    fireEvent.change(firstNameInput, { target: { value: 'Mary-Jane Smith' } });
    await waitFor(() => {
      expect(
        screen.queryByText(/First name must be 2-50 letters/)
      ).not.toBeInTheDocument();
    });

    // Test Chinese characters in English mode - should show error
    fireEvent.change(firstNameInput, { target: { value: '王' } });
    await waitFor(() => {
      expect(
        screen.getByText(/First name must be 2-50 letters, spaces, or hyphens/)
      ).toBeInTheDocument();
    });
  });

  test('validation messages should be in current language', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to form (Chinese mode)
    const builderLink = screen.getByRole('link', { name: /Builder|构建器/ });
    fireEvent.click(builderLink);

    const firstNameInput = await screen.findByLabelText(/名/);

    // Type English in Chinese mode - error should be in Chinese
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    await waitFor(() => {
      expect(screen.getByText(/名字必须是1-4个中文字符/)).toBeInTheDocument();
    });

    // Switch to English
    const languageSwitcher = screen.getByRole('button', { name: /中文|EN/ });
    fireEvent.click(languageSwitcher);

    // Type single character - error should be in English
    fireEvent.change(firstNameInput, { target: { value: 'J' } });
    await waitFor(() => {
      expect(
        screen.getByText(/First name must be 2-50 letters, spaces, or hyphens/)
      ).toBeInTheDocument();
    });
  });

  test('should handle language switching mid-form', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to form in Chinese
    const builderLink = screen.getByRole('link', { name: /Builder|构建器/ });
    fireEvent.click(builderLink);

    const firstNameInput = await screen.findByLabelText(/名/);

    // Enter valid Chinese name
    fireEvent.change(firstNameInput, { target: { value: '王' } });

    // Switch to English
    const languageSwitcher = screen.getByRole('button', { name: /中文|EN/ });
    fireEvent.click(languageSwitcher);

    // The Chinese name should now show validation error in English mode
    await waitFor(() => {
      expect(
        screen.getByText(/First name must be 2-50 letters, spaces, or hyphens/)
      ).toBeInTheDocument();
    });

    // Enter valid English name
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    // Switch back to Chinese
    fireEvent.click(languageSwitcher);

    // The English name should now show validation error in Chinese mode
    await waitFor(() => {
      expect(screen.getByText(/名字必须是1-4个中文字符/)).toBeInTheDocument();
    });
  });
});
