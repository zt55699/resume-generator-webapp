import {
  validateChineseName,
  validateEnglishName,
  getNameValidationSchema,
} from '../utils/validationUtils';

describe('Name Validation Functions', () => {
  describe('validateChineseName', () => {
    test('should accept 1-4 Chinese characters', () => {
      expect(validateChineseName('王')).toBe(true);
      expect(validateChineseName('王小')).toBe(true);
      expect(validateChineseName('王小明')).toBe(true);
      expect(validateChineseName('王小明李')).toBe(true);
    });

    test('should reject more than 4 Chinese characters', () => {
      expect(validateChineseName('王小明李四')).toBe(false);
    });

    test('should reject English characters', () => {
      expect(validateChineseName('John')).toBe(false);
      expect(validateChineseName('A')).toBe(false);
      expect(validateChineseName('王John')).toBe(false);
    });

    test('should reject numbers and special characters', () => {
      expect(validateChineseName('123')).toBe(false);
      expect(validateChineseName('王123')).toBe(false);
      expect(validateChineseName('王@')).toBe(false);
    });

    test('should reject empty string', () => {
      expect(validateChineseName('')).toBe(false);
    });
  });

  describe('validateEnglishName', () => {
    test('should accept 2+ English characters', () => {
      expect(validateEnglishName('John')).toBe(true);
      expect(validateEnglishName('Jo')).toBe(true);
      expect(validateEnglishName('Mary-Jane')).toBe(true);
      expect(validateEnglishName('Van Der Berg')).toBe(true);
    });

    test('should reject single character', () => {
      expect(validateEnglishName('A')).toBe(false);
      expect(validateEnglishName('J')).toBe(false);
    });

    test('should reject Chinese characters', () => {
      expect(validateEnglishName('王')).toBe(false);
      expect(validateEnglishName('王小明')).toBe(false);
      expect(validateEnglishName('John王')).toBe(false);
    });

    test('should reject numbers and special characters', () => {
      expect(validateEnglishName('John123')).toBe(false);
      expect(validateEnglishName('John@')).toBe(false);
      expect(validateEnglishName('123John')).toBe(false);
    });

    test('should accept names with spaces and hyphens', () => {
      expect(validateEnglishName('Mary Jane')).toBe(true);
      expect(validateEnglishName('Mary-Jane')).toBe(true);
      expect(validateEnglishName('Van Der Berg')).toBe(true);
      expect(validateEnglishName('Anne-Marie Claire')).toBe(true);
    });

    test('should reject empty string', () => {
      expect(validateEnglishName('')).toBe(false);
    });

    test('should reject names that are too long', () => {
      expect(validateEnglishName('A'.repeat(51))).toBe(false);
    });
  });

  describe('getNameValidationSchema', () => {
    test('should return Chinese validation schema for zh language', async () => {
      const schema = getNameValidationSchema('zh', 'firstName');

      // Valid Chinese name
      await expect(schema.validate('王')).resolves.toBe('王');
      await expect(schema.validate('王小明')).resolves.toBe('王小明');

      // Invalid - English characters
      await expect(schema.validate('John')).rejects.toThrow(
        '名字必须是1-4个中文字符'
      );

      // Invalid - too many characters
      await expect(schema.validate('王小明李四')).rejects.toThrow(
        '名字必须是1-4个中文字符'
      );

      // Invalid - empty
      await expect(schema.validate('')).rejects.toThrow('名字是必填的');
    });

    test('should return English validation schema for en language', async () => {
      const schema = getNameValidationSchema('en', 'firstName');

      // Valid English name
      await expect(schema.validate('John')).resolves.toBe('John');
      await expect(schema.validate('Mary-Jane')).resolves.toBe('Mary-Jane');

      // Invalid - single character
      await expect(schema.validate('J')).rejects.toThrow(
        'First name must be 2-50 letters, spaces, or hyphens'
      );

      // Invalid - Chinese characters
      await expect(schema.validate('王')).rejects.toThrow(
        'First name must be 2-50 letters, spaces, or hyphens'
      );

      // Invalid - empty
      await expect(schema.validate('')).rejects.toThrow(
        'First name is required'
      );
    });

    test('should handle lastName field correctly', async () => {
      const chineseSchema = getNameValidationSchema('zh', 'lastName');
      const englishSchema = getNameValidationSchema('en', 'lastName');

      // Chinese lastName validation
      await expect(chineseSchema.validate('')).rejects.toThrow('姓氏是必填的');
      await expect(chineseSchema.validate('John')).rejects.toThrow(
        '姓氏必须是1-4个中文字符'
      );

      // English lastName validation
      await expect(englishSchema.validate('')).rejects.toThrow(
        'Last name is required'
      );
      await expect(englishSchema.validate('J')).rejects.toThrow(
        'Last name must be 2-50 letters, spaces, or hyphens'
      );
    });
  });
});
