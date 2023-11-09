import { describe, test, expect } from 'vitest';
import { validityToString } from '../../../components/util/validity-to-string';
import { Validity } from '../../../model';

describe('validityToString()', () => {
  test("If it receives Validity.ERROR, it returns 'ERROR'.", () => {
    expect(validityToString(Validity.ERROR)).toBe('ERROR');
  });

  test("If it receives Validity.INVALID, it returns 'INVALID'.", () => {
    expect(validityToString(Validity.INVALID)).toBe('INVALID');
  });

  test("If it receives Validity.PENDING, it returns 'PENDING'.", () => {
    expect(validityToString(Validity.PENDING)).toBe('PENDING');
  });

  test("If it receives Validity.VALID_UNFINALIZABLE, it returns 'VALID'.", () => {
    expect(validityToString(Validity.VALID_UNFINALIZABLE)).toBe('VALID');
  });

  test("If it receives Validity.VALID_FINALIZABLE, it returns 'VALID'.", () => {
    expect(validityToString(Validity.VALID_FINALIZABLE)).toBe('VALID');
  });
});
