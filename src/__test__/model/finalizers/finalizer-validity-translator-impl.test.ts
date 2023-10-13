import { describe, test, expect, beforeEach } from 'vitest';
import { FinalizerValidityTranslatorImpl } from '../../../model/finalizers/finalizer-validity-translator-impl';
import { FinalizerValidity } from '../../../model/state/finalizer-validity.enum';
import { Validity } from '../../../model';
import { FinalizerValidityTranslator } from '../../../model/finalizers/finalizer-validity-translator.interface';

describe('FinalizerValidityTranslatorImpl', () => {
  let finalizerValidityTranslator : FinalizerValidityTranslator;

  beforeEach(() => {
    finalizerValidityTranslator = new FinalizerValidityTranslatorImpl();
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FINALIZER_ERROR, it returns Validity.ERROR.', () => {
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FINALIZER_ERROR)).toBe(Validity.ERROR);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FIELD_ERROR, it returns Validity.ERROR.', () => {
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FIELD_ERROR)).toBe(Validity.ERROR);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FIELD_INVALID, it returns Validity.INVALID.', () => {
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FIELD_INVALID)).toBe(Validity.INVALID);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FIELD_PENDING, it returns Validity.PENDING.', () => {
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FIELD_PENDING)).toBe(Validity.PENDING);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.FIELD_VALID_UNFINALIZABLE, it returns Validity.VALID_UNFINALIZABLE.', () => {
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.FIELD_VALID_UNFINALIZABLE)).toBe(Validity.VALID_UNFINALIZABLE);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.VALID_FINALIZING, it returns Validity.VALID_FINALIZABLE.', () => {
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.VALID_FINALIZING)).toBe(Validity.VALID_FINALIZABLE);
  });

  test('when translateFinalizerValidityToValidity() is called with FinalizerValidity.VALID_FINALIZED, it returns Validity.VALID_FINALIZABLE.', () => {
    expect(finalizerValidityTranslator.translateFinalizerValidityToValidity(FinalizerValidity.VALID_FINALIZED)).toBe(Validity.VALID_FINALIZABLE);
  });

  test('when translateValidityToFinalizerValidity() is called with Validity.ERROR, it returns FinalizerValidity.FIELD_ERROR.', () => {
    expect(finalizerValidityTranslator.translateValidityToFinalizerValidity(Validity.ERROR)).toBe(FinalizerValidity.FIELD_ERROR);
  });

  test('when translateValidityToFinalizerValidity() is called with Validity.INVALID, it returns FinalizerValidity.FIELD_INVALID.', () => {
    expect(finalizerValidityTranslator.translateValidityToFinalizerValidity(Validity.INVALID)).toBe(FinalizerValidity.FIELD_INVALID);
  });

  test('when translateValidityToFinalizerValidity() is called with Validity.PENDING, it returns FinalizerValidity.FIELD_PENDING.', () => {
    expect(finalizerValidityTranslator.translateValidityToFinalizerValidity(Validity.PENDING)).toBe(FinalizerValidity.FIELD_PENDING);
  });

  test('when translateValidityToFinalizerValidity() is called with Validity.VALID_UNFINALIZABLE, it returns FinalizerValidity.FIELD_VALID_UNFINALIZABLE.', () => {
    expect(finalizerValidityTranslator.translateValidityToFinalizerValidity(Validity.VALID_UNFINALIZABLE)).toBe(FinalizerValidity.FIELD_VALID_UNFINALIZABLE);
  });

  test('when translateValidityToFinalizerValidity() is called with Validity.VALID_FINALIZABLE, it returns FinalizerValidity.VALID_FINALIZING.', () => {
    expect(finalizerValidityTranslator.translateValidityToFinalizerValidity(Validity.VALID_FINALIZABLE)).toBe(FinalizerValidity.VALID_FINALIZING);
  });
});