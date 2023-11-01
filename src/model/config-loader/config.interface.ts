export interface Config {
  autoTrim: boolean;
  emailRegex: RegExp;
  symbolRegex: RegExp;
  globalMessages: {
    pendingAsyncValidatorSuite: string;
    singleFieldValidationError: string;
    pendingAsyncMultiFieldValidator: string;
    multiFieldValidationError: string;
    adapterError: string;
    finalizerError: string;
    finalizerPending: string;
    submissionFailed: string;
  },
}