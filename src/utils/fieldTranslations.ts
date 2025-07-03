import { FieldConfig } from '../types';

export const translateFieldConfig = (
  field: FieldConfig,
  t: (key: string) => string
): FieldConfig => {
  const translatedField = { ...field };

  // Translate label
  if (field.name === 'firstName') {
    translatedField.label = t('field.firstName');
    translatedField.placeholder = t('placeholder.firstName');
  } else if (field.name === 'lastName') {
    translatedField.label = t('field.lastName');
    translatedField.placeholder = t('placeholder.lastName');
  } else if (field.name === 'email') {
    translatedField.label = t('field.email');
    translatedField.placeholder = t('placeholder.email');
  } else if (field.name === 'phone') {
    translatedField.label = t('field.phone');
    translatedField.placeholder = t('placeholder.phone');
  } else if (field.name === 'address') {
    translatedField.label = t('field.address');
    translatedField.placeholder = t('placeholder.address');
  } else if (field.name === 'city') {
    translatedField.label = t('field.city');
    translatedField.placeholder = t('placeholder.city');
  } else if (field.name === 'state') {
    translatedField.label = t('field.state');
    translatedField.placeholder = t('placeholder.state');
  } else if (field.name === 'zipCode') {
    translatedField.label = t('field.zipCode');
    translatedField.placeholder = t('placeholder.zipCode');
  } else if (field.name === 'country') {
    translatedField.label = t('field.country');
    translatedField.placeholder = t('placeholder.country');
  } else if (field.name === 'website') {
    translatedField.label = t('field.website');
    translatedField.placeholder = t('placeholder.website');
  } else if (field.name === 'linkedin') {
    translatedField.label = t('field.linkedin');
    translatedField.placeholder = t('placeholder.linkedin');
  } else if (field.name === 'github') {
    translatedField.label = t('field.github');
    translatedField.placeholder = t('placeholder.github');
  } else if (field.name === 'summary') {
    translatedField.label = t('field.summary');
    translatedField.placeholder = t('placeholder.summary');
  } else if (field.name === 'company') {
    translatedField.label = t('field.company');
    translatedField.placeholder = t('placeholder.company');
  } else if (field.name === 'position') {
    translatedField.label = t('field.position');
    translatedField.placeholder = t('placeholder.position');
  } else if (field.name === 'startDate') {
    translatedField.label = t('field.startDate');
  } else if (field.name === 'endDate') {
    translatedField.label = t('field.endDate');
  } else if (field.name === 'location') {
    translatedField.label = t('field.location');
    translatedField.placeholder = t('placeholder.location');
  } else if (field.name === 'description') {
    translatedField.label = t('field.description');
    translatedField.placeholder = t('placeholder.description');
  } else if (field.name === 'isCurrentPosition') {
    translatedField.label = t('field.isCurrentPosition');
  } else if (field.name === 'institution') {
    translatedField.label = t('field.institution');
    translatedField.placeholder = t('placeholder.institution');
  } else if (field.name === 'degree') {
    translatedField.label = t('field.degree');
    translatedField.placeholder = t('placeholder.degree');
  } else if (field.name === 'fieldOfStudy') {
    translatedField.label = t('field.fieldOfStudy');
    translatedField.placeholder = t('placeholder.fieldOfStudy');
  } else if (field.name === 'gpa') {
    translatedField.label = t('field.gpa');
    translatedField.placeholder = t('placeholder.gpa');
  }

  return translatedField;
};

export const translateFieldConfigs = (
  fields: FieldConfig[],
  t: (key: string) => string
): FieldConfig[] => {
  return fields.map(field => translateFieldConfig(field, t));
};
