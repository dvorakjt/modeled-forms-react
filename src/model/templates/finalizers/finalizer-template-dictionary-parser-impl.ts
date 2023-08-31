import { autowire } from 'undecorated-di';
import {
  FinalizerFactory,
  FinalizerFactoryKey,
} from '../../finalizers/finalizer-factory.interface';
import {
  FinalizerFnFactory,
  FinalizerFnFactoryKey,
} from '../../finalizers/finalizer-functions/finalizer-fn-factory.interface';
import {
  FinalizerManagerFactory,
  FinalizerManagerFactoryKey,
} from '../../finalizers/finalizer-manager-factory.interface';
import { FinalizerManager } from '../../finalizers/finalizer-manager.interface';
import { FinalizerDictionary } from '../../finalizers/finalizer-map.type';
import { FormElementDictionary } from '../../form-elements/form-element-dictionary.type';
import {
  FinalizerTemplateDictionaryParser,
  FinalizerTemplateDictionaryParserKey,
  FinalizerTemplateDictionaryParserKeyType,
} from './finalizer-template-dictionary-parser.interface';
import { FinalizerTemplateDictionary } from './finalizer-template-dictionary.type';

class FinalizerTemplateDictionaryParserImpl
  implements FinalizerTemplateDictionaryParser
{
  _finalizerFnFactory: FinalizerFnFactory;
  _finalizerFactory: FinalizerFactory;
  _finalizerManagerFactory: FinalizerManagerFactory;

  constructor(
    finalizerFnFactory: FinalizerFnFactory,
    finalizerFactory: FinalizerFactory,
    finalizerManagerFactory: FinalizerManagerFactory,
  ) {
    this._finalizerFnFactory = finalizerFnFactory;
    this._finalizerFactory = finalizerFactory;
    this._finalizerManagerFactory = finalizerManagerFactory;
  }

  parseTemplate(
    template: FinalizerTemplateDictionary,
    finalizerFacingFields: FormElementDictionary,
  ): FinalizerManager {
    const finalizers: FinalizerDictionary = {};
    let originalFieldsToPreserve = new Set<string>();

    for (const [finalizerName, finalizerTemplate] of Object.entries(template)) {
      if (finalizerTemplate.syncFinalizerFn) {
        const finalizerFn = this._finalizerFnFactory.createSyncFinalizerFn(
          finalizerTemplate.syncFinalizerFn,
        );
        const finalizer = this._finalizerFactory.createSyncFinalizer(
          finalizerFn,
          finalizerFacingFields,
        );
        finalizers[finalizerName] = finalizer;
        finalizer.accessedFields.onValue(accessedFields => {
          if (finalizerTemplate.preserveOriginalFields) {
            originalFieldsToPreserve = new Set([
              ...originalFieldsToPreserve,
              ...accessedFields,
            ]);
          }
        });
      } else if (finalizerTemplate.asyncFinalizerFn) {
        const finalizerFn = this._finalizerFnFactory.createAsyncFinalizerFn(
          finalizerTemplate.asyncFinalizerFn,
        );
        const finalizer = this._finalizerFactory.createAsyncFinalizer(
          finalizerFn,
          finalizerFacingFields,
        );
        finalizers[finalizerName] = finalizer;
        finalizer.accessedFields.onValue(accessedFields => {
          if (finalizerTemplate.preserveOriginalFields) {
            originalFieldsToPreserve = new Set([
              ...originalFieldsToPreserve,
              ...accessedFields,
            ]);
          }
        });
      }
    }

    for (const [fieldName, field] of Object.entries(finalizerFacingFields)) {
      if (
        originalFieldsToPreserve.has(fieldName) ||
        !(fieldName in finalizers)
      ) {
        finalizers[fieldName] =
          this._finalizerFactory.createDefaultFinalizer(field);
      }
    }

    return this._finalizerManagerFactory.createFinalizerManager(finalizers);
  }
}

const FinalizerTemplateDictionaryParserService = autowire<
  FinalizerTemplateDictionaryParserKeyType,
  FinalizerTemplateDictionaryParser,
  FinalizerTemplateDictionaryParserImpl
>(FinalizerTemplateDictionaryParserImpl, FinalizerTemplateDictionaryParserKey, [
  FinalizerFnFactoryKey,
  FinalizerFactoryKey,
  FinalizerManagerFactoryKey,
]);

export {
  FinalizerTemplateDictionaryParserImpl,
  FinalizerTemplateDictionaryParserService,
};
