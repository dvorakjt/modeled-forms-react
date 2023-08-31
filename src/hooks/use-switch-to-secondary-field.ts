import { useRef, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { FieldState } from '../model/state/field-state.interface';
import { AbstractDualField } from '../model/fields/base/abstract-dual-field';

export function useSwitchToSecondaryField(dualField : AbstractDualField) {
  const [useSecondaryField, _setUseSecondaryField] = useState(dualField.useSecondaryField);
  const stateChangesSubRef = useRef<Subscription | null>(null);

  useEffect(() => {
    stateChangesSubRef.current = dualField.stateChanges.subscribe((change : FieldState) => {
      _setUseSecondaryField(change.useSecondaryField ? true : false);
    });
    return () => stateChangesSubRef.current?.unsubscribe();
  }, []);

  const setUseSecondaryField = (useSecondaryField : boolean) => {
    dualField.useSecondaryField = useSecondaryField;
  }

  return {
    useSecondaryField,
    setUseSecondaryField
  }
}