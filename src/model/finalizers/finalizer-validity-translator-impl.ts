import {
  FinalizerValidityTranslator,
  FinalizerValidityTranslatorKey,
  FinalizerValidityTranslatorKeyType,
} from './finalizer-validity-translator.interface';
import { FinalizerValidity } from '../state/finalizer-validity.enum';
import { Validity } from '../state/validity.enum';
import { autowire } from 'undecorated-di';

class FinalizerValidityTranslatorImpl implements FinalizerValidityTranslator {
  translateFinalizerValidityToValidity(
    finalizerValidity: FinalizerValidity,
  ): Validity {
    switch (finalizerValidity) {
      case FinalizerValidity.FINALIZER_ERROR:
        return Validity.ERROR;
      case FinalizerValidity.FIELD_ERROR:
        return Validity.ERROR;
      case FinalizerValidity.FIELD_INVALID:
        return Validity.ERROR;
      case FinalizerValidity.FIELD_PENDING:
        return Validity.PENDING;
      case FinalizerValidity.FIELD_VALID_UNFINALIZABLE:
        return Validity.VALID_UNFINALIZABLE;
      case FinalizerValidity.VALID_FINALIZING:
        return Validity.VALID_FINALIZABLE;
      case FinalizerValidity.VALID_FINALIZED:
        return Validity.VALID_FINALIZABLE;
    }
  }
  translateValidityToFinalizerValidity(validity: Validity): FinalizerValidity {
    switch (validity) {
      case Validity.ERROR:
        return FinalizerValidity.FIELD_ERROR;
      case Validity.INVALID:
        return FinalizerValidity.FIELD_ERROR;
      case Validity.PENDING:
        return FinalizerValidity.FIELD_PENDING;
      case Validity.VALID_UNFINALIZABLE:
        return FinalizerValidity.FIELD_VALID_UNFINALIZABLE;
      case Validity.VALID_FINALIZABLE:
        return FinalizerValidity.VALID_FINALIZING;
    }
  }
}

const FinalizerValidityTranslatorService = autowire<
  FinalizerValidityTranslatorKeyType,
  FinalizerValidityTranslator,
  FinalizerValidityTranslatorImpl
>(FinalizerValidityTranslatorImpl, FinalizerValidityTranslatorKey);

export { FinalizerValidityTranslatorImpl, FinalizerValidityTranslatorService };
