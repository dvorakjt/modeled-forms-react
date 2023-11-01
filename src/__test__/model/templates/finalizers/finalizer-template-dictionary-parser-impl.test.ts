import { describe, test, expect } from 'vitest';
import { container } from '../../../../model/container';
import { FinalizerTemplateDictionary } from '../../../../model/templates/finalizers/finalizer-template-dictionary.type';
import { MockField } from '../../../util/mocks/mock-field';
import { Validity } from '../../../../model';
import { FinalizerManagerImpl } from '../../../../model/finalizers/finalizer-manager-impl';
import { SyncFinalizer } from '../../../../model/finalizers/sync-finalizer';
import { AsyncFinalizer } from '../../../../model/finalizers/async-finalizer';
import { DefaultFinalizer } from '../../../../model/finalizers/default-finalizer';

describe('FinalizerTemplateDictionaryParserImpl', () => {
  const finalizerTemplateDictionaryParser = container.services.FinalizerTemplateDictionaryParser;

  test('A finalizer entry with a syncFinalizerFn property should have a corresponding SyncFinalizer created in finalizers.', () => {
    const finalizerFacingFields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }
    
    const template : FinalizerTemplateDictionary = {
      fieldAToUpper : {
        syncFinalizerFn : ({ fieldA }) => fieldA.value.toUpperCase()
      }
    }

    const finalizerManager = finalizerTemplateDictionaryParser.parseTemplate(template, finalizerFacingFields) as FinalizerManagerImpl;

    expect(finalizerManager._finalizerMap.fieldAToUpper).toBeInstanceOf(SyncFinalizer);
  });

  test('A finalizer entry with an asyncFinalizerFn property should have a corresponding AsyncFinalizer created in finalizer.', () => {
    const finalizerFacingFields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }
    
    const template : FinalizerTemplateDictionary = {
      fieldAToUpperAsync : {
        asyncFinalizerFn : ({ fieldA }) => {
          return new Promise((resolve) => {
            resolve(fieldA.value.toUpperCase());
          })
        }
      }
    }

    const finalizerManager = finalizerTemplateDictionaryParser.parseTemplate(template, finalizerFacingFields) as FinalizerManagerImpl;

    expect(finalizerManager._finalizerMap.fieldAToUpperAsync).toBeInstanceOf(AsyncFinalizer);
  });

  test('A field passed in as an argument to a sync finalizer should NOT receive a default finalizer.', () => {
    const finalizerFacingFields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }
    
    const template : FinalizerTemplateDictionary = {
      fieldAToUpper : {
        syncFinalizerFn : ({ fieldA }) => fieldA.value.toUpperCase()
      }
    }

    const finalizerManager = finalizerTemplateDictionaryParser.parseTemplate(template, finalizerFacingFields) as FinalizerManagerImpl;

    expect(finalizerManager._finalizerMap.fieldA).toBeUndefined();
  });

  test('A field passed in as an argument to an async finalizer should NOT receive a default finalizer.', () => {
    const finalizerFacingFields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }
    
    const template : FinalizerTemplateDictionary = {
      fieldAToUpperAsync : {
        asyncFinalizerFn : ({ fieldA }) => {
          return new Promise((resolve) => {
            resolve(fieldA.value.toUpperCase());
          })
        }
      }
    }

    const finalizerManager = finalizerTemplateDictionaryParser.parseTemplate(template, finalizerFacingFields) as FinalizerManagerImpl;

    expect(finalizerManager._finalizerMap.fieldA).toBeUndefined();
  });

  test('A field passed in as an argument to a sync finalizer SHOULD receive a default finalizer if preserveOriginalFields is true.', () => {
    const finalizerFacingFields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }
    
    const template : FinalizerTemplateDictionary = {
      fieldAToUpper : {
        syncFinalizerFn : ({ fieldA }) => fieldA.value.toUpperCase(),
        preserveOriginalFields : true
      }
    }

    const finalizerManager = finalizerTemplateDictionaryParser.parseTemplate(template, finalizerFacingFields) as FinalizerManagerImpl;

    expect(finalizerManager._finalizerMap.fieldA).toBeInstanceOf(DefaultFinalizer);
  });

  test('A field passed in as an argument to an async finalizer SHOULD receive a default finalizer if preserveOriginalFields is true.', () => {
    const finalizerFacingFields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }
    
    const template : FinalizerTemplateDictionary = {
      fieldAToUpperAsync : {
        asyncFinalizerFn : ({ fieldA }) => {
          return new Promise((resolve) => {
            resolve(fieldA.value.toUpperCase());
          })
        },
        preserveOriginalFields : true
      }
    }

    const finalizerManager = finalizerTemplateDictionaryParser.parseTemplate(template, finalizerFacingFields) as FinalizerManagerImpl;

    expect(finalizerManager._finalizerMap.fieldA).toBeInstanceOf(DefaultFinalizer);
  });

  test('If multiple finalizers use the same field, it SHOULD receive a default finalizer if preserveOriginalFields is true in at least one template.', () => {
    const finalizerFacingFields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE)
    }
    
    const template : FinalizerTemplateDictionary = {
      fieldAToUpper : {
        syncFinalizerFn : ({ fieldA }) => fieldA.value.toUpperCase(),
        preserveOriginalFields : true
      },
      fieldAToUpperAsync : {
        asyncFinalizerFn : ({ fieldA }) => {
          return new Promise((resolve) => {
            resolve(fieldA.value.toUpperCase());
          })
        },
        preserveOriginalFields : false
      }
    }

    const finalizerManager = finalizerTemplateDictionaryParser.parseTemplate(template, finalizerFacingFields) as FinalizerManagerImpl;

    expect(finalizerManager._finalizerMap.fieldA).toBeInstanceOf(DefaultFinalizer);
  });
  
  test('Fields not included in finalizer template dictionary should receive default finalizers.', () => {
    const finalizerFacingFields = {
      fieldA : new MockField('', Validity.VALID_FINALIZABLE),
      fieldB : new MockField('', Validity.VALID_FINALIZABLE)
    }
    
    const template : FinalizerTemplateDictionary = {
      fieldAToUpper : {
        syncFinalizerFn : ({ fieldA }) => fieldA.value.toUpperCase()
      }
    }

    const finalizerManager = finalizerTemplateDictionaryParser.parseTemplate(template, finalizerFacingFields) as FinalizerManagerImpl;

    expect(finalizerManager._finalizerMap.fieldB).toBeInstanceOf(DefaultFinalizer);
  });
});