import { describe, test, expect } from 'vitest';
import { configMFR } from '../../util';
import { ConfigMFROpts } from '../../util/config-mfr';

describe('configMFR', () => {
  test('It stringifies the passed in configuration options.', () => {
    const configOpts : ConfigMFROpts = {
      autoTrim : false,
      emailRegex : '.*',
      symbolRegex : '.*',
      globalMessages : {
        pendingAsyncMultiFieldValidator : 'custom pending async multi-field validator message',
        singleFieldValidationError : 'custom single field validation error message',
        pendingAsyncValidatorSuite : 'custom pending async validator suite message',
        multiFieldValidationError : 'custom multi-field validation error message',
        adapterError : 'custom adapter error message',
        finalizerError : 'custom finalizer error message',
        finalizerPending : 'custom finalizer pending message',
        confirmationFailed : 'custom confirmation failed message',
        submissionError : 'custom submission error message'
      }
    };

    const { MODELED_FORMS_REACT_CONFIG} = configMFR(configOpts);

    expect(JSON.parse(MODELED_FORMS_REACT_CONFIG)).toStrictEqual(configOpts);
  });
});