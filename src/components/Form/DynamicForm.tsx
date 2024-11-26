import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import Button from '../common/Button';
import { FormState, FormValues, FormErrors } from '../../types';

interface DynamicFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
}

type FormActionType = 
  | { type: 'SET_FIELD_VALUE'; field: keyof FormValues; value: string }
  | { type: 'SET_FIELD_ERROR'; field: keyof FormValues; error: string | null }
  | { type: 'SET_TOUCHED'; field: keyof FormValues }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM' };

const initialState: FormState = {
  values: {
    name: '',
    email: '',
    password: '',
  },
  errors: {},
  touched: {},
  isSubmitting: false,
};

const formReducer = (state: FormState, action: FormActionType): FormState => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.field]: action.value,
        },
      };
    case 'SET_FIELD_ERROR': {
      const newErrors: FormErrors = {
        ...state.errors,
        [action.field]: action.error,
      };
      return {
        ...state,
        errors: newErrors,
      };
    }
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

const validationRules: Record<keyof FormValues, (value: string) => string | null> = {
  name: (value: string) => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    return null;
  },
  email: (value: string) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
    return null;
  },
  password: (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/\d/.test(value)) return 'Password must contain at least one number';
    return null;
  },
};

const DynamicForm: React.FC<DynamicFormProps> = ({ onSubmit }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const validateField = useMemo(() => (field: keyof FormValues, value: string) => {
    const validationRule = validationRules[field];
    return validationRule ? validationRule(value) : null;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ 
      type: 'SET_FIELD_VALUE', 
      field: name as keyof FormValues, 
      value 
    });
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    dispatch({ 
      type: 'SET_TOUCHED', 
      field: name as keyof FormValues 
    });
  }, []);

  useEffect(() => {
    Object.keys(state.values).forEach(field => {
      const typedField = field as keyof FormValues;
      const error = validateField(typedField, state.values[typedField]);
      dispatch({ 
        type: 'SET_FIELD_ERROR', 
        field: typedField, 
        error 
      });
    });
  }, [state.values, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasErrors = Object.values(state.errors).some(error => error);
    if (hasErrors) return;

    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    
    try {
      await onSubmit(state.values);
      dispatch({ type: 'RESET_FORM' });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={state.values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${state.touched.name && state.errors.name ? 'form-input-error' : ''}`}
          aria-label="Name"
          aria-invalid={Boolean(state.errors.name)}
        />
        {state.touched.name && state.errors.name && (
          <div className="error-message" role="alert">{state.errors.name}</div>
        )}
      </div>

      <div className="mb-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={state.values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${state.touched.email && state.errors.email ? 'form-input-error' : ''}`}
          aria-label="Email"
          aria-invalid={Boolean(state.errors.email)}
        />
        {state.touched.email && state.errors.email && (
          <div className="error-message" role="alert">{state.errors.email}</div>
        )}
      </div>

      <div className="mb-6">
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`form-input ${state.touched.password && state.errors.password ? 'form-input-error' : ''}`}
          aria-label="Password"
          aria-invalid={Boolean(state.errors.password)}
        />
        {state.touched.password && state.errors.password && (
          <div className="error-message" role="alert">{state.errors.password}</div>
        )}
      </div>

      <Button
        type="submit"
        disabled={state.isSubmitting}
        variant="primary"
        className="w-full bg-secondary text-white hover:bg-primary-hover"
      >
        {state.isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};

export default React.memo(DynamicForm);
