import { useRef, useState, useMemo} from 'react'
import { RootFormTemplate } from '../model/templates/forms/root-form-template.interface';
import { container } from '../model/container';
import { AbstractRootForm } from '../model/forms/abstract-root-form';
import { AbstractNestedForm } from '../model/forms/abstract-nested-form';
import { AbstractField } from '../model/fields/base/abstract-field';
import { AbstractDualField } from '../model/fields/base/abstract-dual-field';

const rootFormTemplateParser = container.services.RootFormTemplateParser;

export function useRootForm(template : RootFormTemplate) {
  const form = useMemo(() => rootFormTemplateParser.parseTemplate(template), [template]);
  const formRef = useRef(form);

  const submit = formRef.current.submit;

  return {
    ..._useForm(formRef.current),
    ..._useSubmissionAttempted(formRef.current),
    submit
  };
}

function _useForm(form : AbstractRootForm | AbstractNestedForm) {
  const { value, validity, messages } = _useFormState(form);
  const { firstNonValidFormElement } = _useFirstNonValidFormElement(form);
  const reset = () => form.reset();

  const useField = (fieldName : string) => {
    if(!(fieldName in form.userFacingFields)) {
      throw new Error('No field with field name ' + fieldName + ' found in form fields.');
    }
    if(!(form.userFacingFields[fieldName] instanceof AbstractField)) {
      throw new Error('Field ' + fieldName + ' exists but is not an instance of AbstractField. Use useNestedForm instead.');
    } else {
      return _useField(form.userFacingFields[fieldName] as AbstractField);
    }
  }

  const useDualField = (fieldName : string) => {
    if(!(fieldName in form.userFacingFields)) {
      throw new Error('No field with field name ' + fieldName + ' found in form fields.');
    }
    if(!(form.userFacingFields[fieldName] instanceof AbstractDualField)) {
      throw new Error('Field ' + fieldName + ' exists but is not an instance of AbstractDualField. Use useField or useNestedForm instead.');
    } else {
      return _useDualField(form.userFacingFields[fieldName] as AbstractDualField);
    }
  }

  const useNestedForm = (fieldName : string) => {
    if(!(fieldName in form.userFacingFields)) {
      throw new Error('No field with field name ' + fieldName + ' found in form fields.');
    }
    if(!(form.userFacingFields[fieldName] instanceof AbstractNestedForm)) {
      throw new Error('Field ' + fieldName + ' exists but is not an instance of AbstractNestedForm.');
    } else {
      return _useForm(form.userFacingFields[fieldName] as AbstractNestedForm);
    }
  }

  const useOmittableFormElement = (fieldName : string) => {
    if(!(fieldName in form.userFacingFields)) {
      throw new Error('No field with field name ' + fieldName + ' found in form fields.');
    }
    return _useOmittableFormElement(form.userFacingFields[fieldName]);
  }

  return {
    value,
    validity,
    messages,
    firstNonValidFormElement,
    reset,
    useField,
    useDualField,
    useNestedForm,
    useOmittableFormElement
  }
}

function _useFormState(form : AbstractRootForm | AbstractNestedForm) {
  const [value, setValue] = useState(form.state.value);
  const [validity, setValidity] = useState(form.state.validity);
  const [messages, setMessages] = useState(form.state.messages);

  form.stateChanges.subscribe(stateChange => {
    //here we would be able to compare equality if records were used to maintain state
    setValue(stateChange.value);
    setValidity(stateChange.validity);
    setMessages(stateChange.messages);
  });

  return {
    value,
    validity,
    messages
  }
}

function _useSubmissionAttempted(form : AbstractRootForm) {
  const [submissionAttempted, setSubmissionAttempted] = useState(form.submissionState.submissionAttempted);
  
  form.submissionStateChanges.subscribe(change => {
    setSubmissionAttempted(change.submissionAttempted);
  });

  return {
    submissionAttempted
  }
}

function _useFirstNonValidFormElement(form : AbstractRootForm | AbstractNestedForm) {
  const [firstNonValidFormElement, setFirstNonValidFormElement] = useState(form.firstNonValidFormElement);

  form.firstNonValidFormElementChanges.subscribe(change => {
    setFirstNonValidFormElement(change);
  });

  return {
    firstNonValidFormElement
  }
}

function _useField(field : AbstractField) {
  const [value, setValue] = useState(field.state.value);
  const [validity, setValidity] = useState(field.state.validity);
  const [messages, setMessages] = useState(field.state.messages);

  field.stateChanges.subscribe(change => {
    setValue(change.value);
    setValidity(change.validity);
    setMessages(change.messages);
  });  

  const updateValue = (value : string) => {
    field.setValue(value);
  }

  const reset = field.reset;

  return {
    value,
    validity,
    messages,
    updateValue,
    reset
  }
}

function _useDualField(dualField : AbstractDualField) {
  const primaryField = _useField(dualField.primaryField);
  const secondaryField = _useField(dualField.secondaryField);
  const [useSecondaryField, _setUseSecondaryField] = useState(dualField.useSecondaryField);

  const setUseSecondaryField = (useSecondaryField : boolean) => {
    dualField.useSecondaryField = useSecondaryField;
    _setUseSecondaryField(dualField.useSecondaryField);
  }

  return {
    primaryField,
    secondaryField,
    useSecondaryField,
    setUseSecondaryField
  }
}

function _useOmittableFormElement(formElement : AbstractField | AbstractNestedForm) {
  const [omitFormElement, _setOmitFormElement] = useState(formElement.omit);

  formElement.stateChanges.subscribe(change => {
    _setOmitFormElement(change.omit ? true : false);
  });

  const setOmitFormElement = (omit : boolean) => {
    formElement.omit = omit;
  }

  return {
    omitFormElement,
    setOmitFormElement
  }
}