import { AbstractDualField } from '../model/fields/base/abstract-dual-field';
import { useField } from './use-field';
import { useSwitchToSecondaryField as _useSwitchToSecondaryField } from './use-switch-to-secondary-field';

export function useDualField(dualField: AbstractDualField) {
  const usePrimaryField = () => useField(dualField.primaryField);
  const useSecondaryField = () => useField(dualField.secondaryField);
  const useSwitchToSecondaryField = () => _useSwitchToSecondaryField(dualField);
  const reset = () => dualField.reset();

  return {
    usePrimaryField,
    useSecondaryField,
    useSwitchToSecondaryField,
    reset,
  };
}
