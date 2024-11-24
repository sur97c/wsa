// components/dynamic-form/forms.ts

export type FieldValue = string | number | boolean | Date | null;

export type FieldType = 'text' | 'email' | 'select' | 'checkbox' | 'number' | 'date';

export type ValidationRule = {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: string | number;
  message: string
  validator?: (value: FieldValue) => boolean
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface GridConfig {
  column: number;
  row?: number;
  colSpan?: number;
  rowSpan?: number;
}

export interface FormFieldConfig {
  name: string
  label: string
  type: FieldType
  defaultValue?: FieldValue
  validations?: ValidationRule[]
  options?: SelectOption[]
  disabled?: boolean
  placeholder?: string
  grid?: GridConfig
  rightElement?: React.ReactNode
}

export interface FormConfig {
  fields: FormFieldConfig[]
  grid: {
    columns: number
    gap: string
  }
}

export interface DynamicFormProps<T extends Record<string, FieldValue>> {
  config: FormConfig;
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  onClose: () => void;
  title: string;
  cancelButton: string;
  saveButton: string;
  successMessage: string;
  errorMessage: string;
}
