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
        return Validity.INVALID;
      case FinalizerValidity.FIELD_PENDING:
        return Validity.PENDING;
      case FinalizerValidity.FIELD_VALID_UNFINALIZABLE:
        return Validity.VALID_UNFINALIZABLE;
      case FinalizerValidity.VALID_FINALIZING:
        return Validity.VALID_UNFINALIZABLE;
      case FinalizerValidity.VALID_FINALIZED:
        return Validity.VALID_FINALIZABLE;
    }
  }
  translateValidityToFinalizerValidity(validity: Validity): FinalizerValidity {
    let returnValue;
    switch (validity) {
      case Validity.ERROR:
        returnValue = FinalizerValidity.FIELD_ERROR;
        break;
      case Validity.INVALID:
        returnValue = FinalizerValidity.FIELD_INVALID;
        break;
      case Validity.PENDING:
        returnValue = FinalizerValidity.FIELD_PENDING;
        break;
      case Validity.VALID_UNFINALIZABLE:
        returnValue = FinalizerValidity.FIELD_VALID_UNFINALIZABLE;
        break;
      case Validity.VALID_FINALIZABLE:
        returnValue = FinalizerValidity.VALID_FINALIZING;
        break;
    }
    return returnValue;
  }
}

const FinalizerValidityTranslatorService = autowire<
  FinalizerValidityTranslatorKeyType,
  FinalizerValidityTranslator,
  FinalizerValidityTranslatorImpl
>(FinalizerValidityTranslatorImpl, FinalizerValidityTranslatorKey);

export { FinalizerValidityTranslatorImpl, FinalizerValidityTranslatorService };
