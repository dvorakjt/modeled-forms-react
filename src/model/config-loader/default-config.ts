import { Config } from "./config.interface";

export const DEFAULT_CONFIG : Config = {
  autoTrim: true,
  emailRegex:
    /^[A-Z0-9]+(?:[_%+.-][A-Z0-9]+)*@[A-Z0-9]+(?:[.-][A-Z0-9]+)*\.[A-Z]{2,}$/i,
  symbolRegex: /[ !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]/,
  globalMessages: {
    pendingAsyncValidatorSuite: 'Checking field...',
    singleFieldValidationError:
      'An unexpected error occurred while validating the field.',
    pendingAsyncMultiFieldValidator: 'Checking form...',
    multiFieldValidationError:
      'An unexpected error occurred while validating the validity of the form.',
    adapterError:
      "An unexpected error occurred while generating this field's value.",
    finalizerError:
      'An unexpected error occurred while preparing the form for submission.',
    finalizerPending: 'Preparing form for submission...',
    confirmationFailed:
      'There are invalid or pending fields, or the form is currently being prepared for submission.',
    submissionError: 'There was an unknown problem submitting the form.',
  },
};