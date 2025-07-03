import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FieldConfig, FormValidation } from '../../types';
import { getFieldValidationSchema } from '../../utils/validationUtils';
import TextInput from './fields/TextInput';
import TextareaInput from './fields/TextareaInput';
import EmailInput from './fields/EmailInput';
import PhoneInput from './fields/PhoneInput';
import DateInput from './fields/DateInput';
import SelectInput from './fields/SelectInput';
import MultiSelectInput from './fields/MultiSelectInput';
import FileInput from './fields/FileInput';
import ImageInput from './fields/ImageInput';
import VideoInput from './fields/VideoInput';
import RichTextInput from './fields/RichTextInput';
import NumberInput from './fields/NumberInput';
import UrlInput from './fields/UrlInput';
import CheckboxInput from './fields/CheckboxInput';
import RadioInput from './fields/RadioInput';
import './DynamicForm.css';

interface DynamicFormProps {
  fields: FieldConfig[];
  data?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onFieldChange?: (fieldName: string, value: any) => void;
  onValidation?: (validation: FormValidation) => void;
  submitButtonText?: string;
  className?: string;
  disabled?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  data = {},
  onSubmit,
  onFieldChange,
  onValidation,
  submitButtonText = 'Submit',
  className = '',
  disabled = false,
}) => {
  const [validationSchema, setValidationSchema] = useState<yup.ObjectSchema<any>>();

  useEffect(() => {
    const schemaFields: Record<string, yup.AnySchema> = {};
    
    fields.forEach(field => {
      if (!field.visible) return;
      
      let fieldSchema = getFieldValidationSchema(field.type);
      
      if (field.required) {
        fieldSchema = fieldSchema.required(`${field.label} is required`);
      }
      
      if (field.validation) {
        if (field.validation.minLength && ['text', 'textarea', 'email', 'url', 'richtext'].includes(field.type)) {
          fieldSchema = (fieldSchema as yup.StringSchema).min(field.validation.minLength, `${field.label} must be at least ${field.validation.minLength} characters`);
        }
        if (field.validation.maxLength && ['text', 'textarea', 'email', 'url', 'richtext'].includes(field.type)) {
          fieldSchema = (fieldSchema as yup.StringSchema).max(field.validation.maxLength, `${field.label} must be less than ${field.validation.maxLength} characters`);
        }
        if (field.validation.pattern && ['text', 'textarea', 'email', 'url', 'richtext'].includes(field.type)) {
          fieldSchema = (fieldSchema as yup.StringSchema).matches(new RegExp(field.validation.pattern), `${field.label} format is invalid`);
        }
        if (field.validation.min && field.type === 'number') {
          fieldSchema = (fieldSchema as yup.NumberSchema).min(field.validation.min, `${field.label} must be at least ${field.validation.min}`);
        }
        if (field.validation.max && field.type === 'number') {
          fieldSchema = (fieldSchema as yup.NumberSchema).max(field.validation.max, `${field.label} must be at most ${field.validation.max}`);
        }
      }
      
      schemaFields[field.name] = fieldSchema;
    });
    
    setValidationSchema(yup.object(schemaFields));
  }, [fields]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues: data,
    mode: 'onChange',
  });

  const watchedValues = watch();

  useEffect(() => {
    if (onValidation) {
      const errorMessages: Record<string, string> = {};
      Object.keys(errors).forEach(key => {
        const error = errors[key];
        if (error && typeof error === 'object' && 'message' in error) {
          errorMessages[key] = error.message as string;
        }
      });
      onValidation({ isValid, errors: errorMessages });
    }
  }, [errors, isValid, onValidation]);

  useEffect(() => {
    if (onFieldChange) {
      Object.keys(watchedValues).forEach(key => {
        const value = watchedValues[key];
        if (value !== undefined) {
          onFieldChange(key, value);
        }
      });
    }
  }, [watchedValues, onFieldChange]);

  const renderField = (field: FieldConfig) => {
    if (!field.visible) return null;

    const fieldError = errors[field.name];
    const errorMessage = fieldError && typeof fieldError === 'object' && 'message' in fieldError 
      ? fieldError.message as string 
      : undefined;
    
    const commonProps = {
      name: field.name,
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      disabled: disabled,
      error: errorMessage,
    };

    switch (field.type) {
      case 'text':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <TextInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <TextareaInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
                rows={field.validation?.minLength ? Math.max(3, Math.ceil(field.validation.minLength / 50)) : 3}
              />
            )}
          />
        );

      case 'email':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <EmailInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
              />
            )}
          />
        );

      case 'phone':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <PhoneInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
              />
            )}
          />
        );

      case 'date':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <DateInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <SelectInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
                options={field.options || []}
              />
            )}
          />
        );

      case 'multiselect':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <MultiSelectInput
                {...commonProps}
                value={formField.value || []}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
                options={field.options || []}
              />
            )}
          />
        );

      case 'file':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <FileInput
                {...commonProps}
                value={formField.value}
                onChange={formField.onChange}
                acceptedTypes={field.fileConfig?.acceptedTypes || []}
                maxSize={field.fileConfig?.maxSize || 10 * 1024 * 1024}
                maxFiles={field.fileConfig?.maxFiles || 1}
              />
            )}
          />
        );

      case 'image':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <ImageInput
                {...commonProps}
                value={formField.value}
                onChange={formField.onChange}
                maxSize={field.fileConfig?.maxSize || 10 * 1024 * 1024}
                allowCrop={true}
              />
            )}
          />
        );

      case 'video':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <VideoInput
                {...commonProps}
                value={formField.value}
                onChange={formField.onChange}
                maxSize={field.fileConfig?.maxSize || 50 * 1024 * 1024}
              />
            )}
          />
        );

      case 'richtext':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <RichTextInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <NumberInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
                min={field.validation?.min}
                max={field.validation?.max}
              />
            )}
          />
        );

      case 'url':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <UrlInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
              />
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <CheckboxInput
                {...commonProps}
                checked={formField.value || false}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
              />
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            key={field.id}
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <RadioInput
                {...commonProps}
                value={formField.value || ''}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
                options={field.options || []}
              />
            )}
          />
        );

      default:
        return null;
    }
  };

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <form 
      className={`dynamic-form ${className}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="form-fields">
        {sortedFields.map(renderField)}
      </div>
      
      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={disabled || !isValid}
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;