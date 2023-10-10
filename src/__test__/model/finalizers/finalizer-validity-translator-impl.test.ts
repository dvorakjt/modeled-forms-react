import { describe, test, expect } from 'vitest';
import { FinalizerValidityTranslatorImpl } from '../../../model/finalizers/finalizer-validity-translator-impl';
import { FinalizerValidity } from '../../../model/state/finalizer-validity.enum';
import { Validity } from '../../../model';

describe('FinalizerValidityTranslatorImpl', () => {
  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FINALIZER_ERROR, it returns Validity.ERROR.', () => {
    const finalizerValidityTranslator = new FinalizerValidityTranslatorImpl();
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FINALIZER_ERROR)).toBe(Validity.ERROR);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FIELD_ERROR, it returns Validity.ERROR.', () => {
    const finalizerValidityTranslator = new FinalizerValidityTranslatorImpl();
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FIELD_ERROR)).toBe(Validity.ERROR);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FIELD_INVALID, it returns Validity.INVALID.', () => {
    const finalizerValidityTranslator = new FinalizerValidityTranslatorImpl();
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FIELD_INVALID)).toBe(Validity.INVALID);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FIELD_PENDING, it returns Validity.PENDING.', () => {
    const finalizerValidityTranslator = new FinalizerValidityTranslatorImpl();
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FIELD_PENDING)).toBe(Validity.PENDING);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FIELD_VALID_UNFINALIZABLE, it returns Validity.VALID_UNFINALIZABLE.', () => {
    const finalizerValidityTranslator = new FinalizerValidityTranslatorImpl();
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FIELD_VALID_UNFINALIZABLE)).toBe(Validity.VALID_UNFINALIZABLE);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.VALID_FINALIZING, it returns Validity.VALID_FINALIZABLE.', () => {
    const finalizerValidityTranslator = new FinalizerValidityTranslatorImpl();
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.VALID_FINALIZING)).toBe(Validity.VALID_FINALIZABLE);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.VALID_FINALIZED, it returns Validity.VALID_FINALIZABLE.', () => {
    const finalizerValidityTranslator = new FinalizerValidityTranslatorImpl();
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.VALID_FINALIZED)).toBe(Validity.VALID_FINALIZABLE);
  });
});