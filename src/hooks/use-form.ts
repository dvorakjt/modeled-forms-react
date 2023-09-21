import { useFormState as _useFormState } from './use-form-state';
import { useFirstNonValidFormElement as _useFirstNonValidFormElement } from './use-first-non-valid-form-element';
import { useField as _useField } from './use-field';
import { useDualField as _useDualField } from './use-dual-field';
import { useExtractedValue as _useExtractedValue } from './use-extracted-value';
import { useOmittableFormElement as _useOmittableFormElement } from './use-omittable-form-element';
import { AbstractRootForm } from '../model/forms/abstract-root-form';
import { AbstractNestedForm } from '../model/forms/abstract-nested-form';
import { AbstractField } from '../model/fields/base/abstract-field';
import { AbstractDualField } from '../model/fields/base/abstract-dual-field';

export function useForm(form: AbstractRootForm | AbstractNestedForm) {
  const useFormState = () => _useFormState(form);
  const useFirstNonValidFormElement = () => _useFirstNonValidFormElement(form);
  const reset = () => form.reset();

  const useField = (fieldName: string) => {
    if (!(fieldName in form.userFacingFields)) {
      throw new Error(
        'No field with field name ' + fieldName + ' found in form fields.',
      );
    }
    if (!(form.userFacingFields[fieldName] instanceof AbstractField)) {
      throw new Error(
        'Field ' +
          fieldName +
          ' exists but is not an instance of AbstractField. Use useNestedForm instead.',
      );
    } 
    return _useField(form.userFacingFields[fieldName] as AbstractField);
  };

  const useDualField = (fieldName: string) => {
    if (!(fieldName in form.userFacingFields)) {
      throw new Error(
        'No field with field name ' + fieldName + ' found in form fields.',
      );
    }
    if (!(form.userFacingFields[fieldName] instanceof AbstractDualField)) {
      throw new Error(
        'Field ' +
          fieldName +
          ' exists but is not an instance of AbstractDualField. Use useField or useNestedForm instead.',
      );
    } 
    return _useDualField(
      form.userFacingFields[fieldName] as AbstractDualField,
    );
  };

  const useNestedForm = (fieldName: string) => {
    if (!(fieldName in form.userFacingFields)) {
      throw new Error(
        'No field with field name ' + fieldName + ' found in form fields.',
      );
    }
    if (!(form.userFacingFields[fieldName] instanceof AbstractNestedForm)) {
      throw new Error(
        'Field ' +
          fieldName +
          ' exists but is not an instance of AbstractNestedForm.',
      );
    }
    return useForm(form.userFacingFields[fieldName] as AbstractNestedForm);
  };

  const useOmittableFormElement = (fieldName: string) => {
    if (!(fieldName in form.userFacingFields)) {
      throw new Error(
        'No field with field name ' + fieldName + ' found in form fields.',
      );
    }
    return _useOmittableFormElement(form.userFacingFields[fieldName]);
  };

  const useExtractedValue = (key : string) => {
    if(!(key in form.extractedValues)) {
      throw new Error(
        'No extracted value with key ' + key + ' found in extractedValues.'
      );
    }

    return _useExtractedValue(form.extractedValues[key]);
  }

  return {
    useFormState,
    useFirstNonValidFormElement,
    reset,
    useField,
    useDualField,
    useNestedForm,
    useOmittableFormElement,
    useExtractedValue
  };
}
