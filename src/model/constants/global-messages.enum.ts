export enum GlobalMessages {
  PENDING_ASYNC_VALIDATOR_SUITE_MESSAGE = 'Checking field...',
  SINGLE_INPUT_VALIDATION_ERROR = 'An unexpected error occurred while validating the field.',
  PENDING_ASYNC_MULTI_INPUT_VALIDATOR = 'Checking form...',
  MULTI_INPUT_VALIDATION_ERROR = 'An unexpected error occurred while validating the validity of the form.',
  FIELD_ADAPTER_ERROR = "An unexpected error occurred while generating this field's value.",
  FINALIZER_ERROR = 'An unexpected error occurred while preparing the form for submission.',
  FINALIZER_PENDING = 'Preparing form for submission...',
  SUBMISSION_FAILED = 'There are invalid or pending fields, or the form is currently being prepared for submission.',
}
