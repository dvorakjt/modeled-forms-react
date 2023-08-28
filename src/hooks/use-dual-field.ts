import { useState } from 'react';
import { AbstractDualField } from '../model/fields/base/abstract-dual-field';
import { useField } from './use-field';

export function useDualField(dualField: AbstractDualField) {
  const primaryField = useField(dualField.primaryField);
  const secondaryField = useField(dualField.secondaryField);
  const [useSecondaryField, _setUseSecondaryField] = useState(
    dualField.useSecondaryField,
  );

  const setUseSecondaryField = (useSecondaryField: boolean) => {
    dualField.useSecondaryField = useSecondaryField;
    _setUseSecondaryField(dualField.useSecondaryField);
  };

  return {
    primaryField,
    secondaryField,
    useSecondaryField,
    setUseSecondaryField,
  };
}
