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
  #finalizerFnFactory: FinalizerFnFactory;
  #finalizerFactory: FinalizerFactory;
  #finalizerManagerFactory: FinalizerManagerFactory;

  constructor(
    finalizerFnFactory: FinalizerFnFactory,
    finalizerFactory: FinalizerFactory,
    finalizerManagerFactory: FinalizerManagerFactory,
  ) {
    this.#finalizerFnFactory = finalizerFnFactory;
    this.#finalizerFactory = finalizerFactory;
    this.#finalizerManagerFactory = finalizerManagerFactory;
  }

  parseTemplate(
    template: FinalizerTemplateDictionary,
    finalizerFacingFields: FormElementDictionary,
  ): FinalizerManager {
    const finalizers: FinalizerDictionary = {};
    let originalFieldsToPreserve = new Set<string>();

    for (const [finalizerName, finalizerTemplate] of Object.entries(template)) {
      if (finalizerTemplate.syncFinalizerFn) {
        const finalizerFn = this.#finalizerFnFactory.createSyncFinalizerFn(
          finalizerTemplate.syncFinalizerFn,
        );
        const finalizer = this.#finalizerFactory.createSyncFinalizer(
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
        const finalizerFn = this.#finalizerFnFactory.createAsyncFinalizerFn(
          finalizerTemplate.asyncFinalizerFn,
        );
        const finalizer = this.#finalizerFactory.createAsyncFinalizer(
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
          this.#finalizerFactory.createDefaultFinalizer(field);
      }
    }

    return this.#finalizerManagerFactory.createFinalizerManager(finalizers);
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
