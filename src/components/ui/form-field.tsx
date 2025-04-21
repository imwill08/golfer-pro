import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';
import { FormFieldError } from './form-field-error';
import { forwardRef } from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input ref={ref} {...props} />
        {error && <FormFieldError error={error} />}
      </div>
    );
  }
);

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, required, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Textarea ref={ref} {...props} />
        {error && <FormFieldError error={error} />}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
TextAreaField.displayName = 'TextAreaField'; 