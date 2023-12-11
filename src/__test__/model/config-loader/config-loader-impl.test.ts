import { describe, test, expect, vi, afterEach } from 'vitest';
import { DEFAULT_CONFIG } from '../../../model/config-loader/default-config';
import { ConfigLoaderImpl } from '../../../model/config-loader/config-loader-impl';
import { setNodeEnv } from '../../testing-util/funcs/set-node-env';
describe('ConfigLoader', () => {
  afterEach(() => {
    if("MODELED_FORMS_REACT_CONFIG" in process.env) {
      delete process.env.MODELED_FORMS_REACT_CONFIG;
    }
  });

  test('It loads the default configuration settings.', () => {
    const configLoader = new ConfigLoaderImpl();
    expect(configLoader.config).toStrictEqual(DEFAULT_CONFIG);
  });

  test('If the value assigned to process.env.MODELED_FORMS_REACT_CONFIG cannot be parsed as JSON, the default settings remain in effect.', () => {
    process.env.MODELED_FORMS_REACT_CONFIG = "[1, 2, 3, 4,]"; //trailing comma

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config).toStrictEqual(DEFAULT_CONFIG);
  });

  test('If the value assigned to process.env.MODELED_FORMS_REACT_CONFIG cannot be parsed as JSON, the error is logged in dev mode.', () => {
    const resetProcessEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error : vi.fn()
    });

    process.env.MODELED_FORMS_REACT_CONFIG = "[1, 2, 3, 4,]";

    new ConfigLoaderImpl();

    expect(console.error).toHaveBeenCalledOnce();

    vi.unstubAllGlobals();
    resetProcessEnv();
  });

  test('If the value assigned to process.env.MODELED_FORMS_REACT_CONFIG can be successfully parsed, but it does not contain any key from the default config object, the default config remains in effect.', () => {
    const conf = {
      someInvalidValue : {
        someOtherInvalidValue : 'hello'
      },
      yetAnotherInvalidValue : 'world'
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config).toStrictEqual(DEFAULT_CONFIG);
  });
  
  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG contains the property \'autoTrim\' but it is not of type boolean, autoTrim is set to the default value (true).', () => {
    const conf = {
      autoTrim : 'false'
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config.autoTrim).toBe(true);
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG contains the property \'autoTrim\' and it IS of type boolean, autoTrim is set to that value.', () => {
    const conf = {
      autoTrim : false
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config.autoTrim).toBe(false);
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG contains the property \'emailRegex\' but it is not of type string, emailRegex remains set to its default value.', () => {
    const conf = {
      emailRegex : /.*/
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config.emailRegex.toString()).toBe(DEFAULT_CONFIG.emailRegex.toString());
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT.emailRegex is of type string but it cannot be compiled into a new RegExp, emailRegex remains set to its default value.', () => {
    const conf = {
      emailRegex : "["
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config.emailRegex.toString()).toBe(DEFAULT_CONFIG.emailRegex.toString());
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG.emailRegex is of type string but it cannot be compiled into a new RegExp, an error is logged in dev mode.', () => {
    const resetProcessEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error : vi.fn()
    });
    
    const conf = {
      emailRegex : "["
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    new ConfigLoaderImpl();

    expect(console.error).toHaveBeenCalledOnce();

    vi.unstubAllGlobals();
    resetProcessEnv();
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG.emailRegex can be converted to a RegExp, the value of emailRegex is set to the resultant regular expression.', () => {
    const conf = {
      emailRegex : '.*'
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config.emailRegex.toString()).toBe(new RegExp(conf.emailRegex).toString());
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG contains the property \'symbolRegex\' but it is not of type string, symbolRegex remains set to its default value.', () => {
    const conf = {
      symbolRegex : /.*/
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config.symbolRegex.toString()).toBe(DEFAULT_CONFIG.symbolRegex.toString());
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT.symbolRegex is of type string but it cannot be compiled into a new RegExp, symbolRegex remains set to its default value.', () => {
    const conf = {
      symbolRegex : "["
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config.symbolRegex.toString()).toBe(DEFAULT_CONFIG.symbolRegex.toString());
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG.symbolRegex is of type string but it cannot be compiled into a new RegExp, an error is logged in dev mode.', () => {
    const resetProcessEnv = setNodeEnv('development');
    vi.stubGlobal('console', {
      error : vi.fn()
    });
    
    const conf = {
      symbolRegex : "["
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    new ConfigLoaderImpl();

    expect(console.error).toHaveBeenCalledOnce();

    vi.unstubAllGlobals();
    resetProcessEnv();
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG.symbolRegex can be converted to a RegExp, the value of symbolRegex is set to the resultant regular expression.', () => {
    const conf = {
      symbolRegex : '.*'
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(configLoader.config.symbolRegex.toString()).toBe(new RegExp(conf.symbolRegex).toString());
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG.globalMessages is not of type object, the default values for globalMessages remain in effect.', () => {
    const conf = {
      globalMessages : 'some string'
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    for(const key of Object.keys(configLoader.config.globalMessages)) {
      expect(configLoader.config.globalMessages[key as keyof typeof configLoader.config.globalMessages]).toBe(
        DEFAULT_CONFIG.globalMessages[key as keyof typeof DEFAULT_CONFIG.globalMessages]
      )
    }
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG.globalMessages contains keys not found in the DEFAULT_CONFIG, they are not added.', () => {
    const conf = {
      globalMessages : {
        myMadeUpMessage : 'this is not a valid key'
      }
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect('myMadeUpMessage' in configLoader.config.globalMessages).toBe(false);

    for(const key of Object.keys(configLoader.config.globalMessages)) {
      expect(configLoader.config.globalMessages[key as keyof typeof configLoader.config.globalMessages]).toBe(
        DEFAULT_CONFIG.globalMessages[key as keyof typeof DEFAULT_CONFIG.globalMessages]
      )
    }
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG.globalMessages contains a key inherited from Object, it is NOT set.', () => {
    const conf = {
      globalMessages : {
        toString : 'attempting to overwrite toString'
      }
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    expect(typeof configLoader.config.globalMessages.toString).toBe('function');
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG.globalMessages contains the correct keys, but they are not of type string, they are not set.', () => {
    const conf = {
      globalMessages : {
        pendingAsyncValidatorSuite: 1,
        singleFieldValidationError: 2,
        pendingAsyncMultiFieldValidator: 3,
        multiFieldValidationError: {
          someProp : ''
        },
        adapterError: [
          1, 2, 3, 4, 5
        ],
        finalizerError: new Error('finalizer error'),
        finalizerPending: {
          myArray : [
            1, 2, 3, 4, 5
          ]
        },
        confirmationFailed: true,
        submissionError: false
      }
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    for(const key of Object.keys(configLoader.config.globalMessages)) {
      expect(configLoader.config.globalMessages[key as keyof typeof configLoader.config.globalMessages]).toBe(
        DEFAULT_CONFIG.globalMessages[key as keyof typeof DEFAULT_CONFIG.globalMessages]
      )
    }
  });

  test('If the value passed to process.env.MODELED_FORMS_REACT_CONFIG.globalMessages contains the correct keys, and they are of type string, they are set.', () => {
    const expectedMessage = 'test';
    
    const conf = {
      globalMessages : {
        pendingAsyncValidatorSuite: expectedMessage,
        singleFieldValidationError: expectedMessage,
        pendingAsyncMultiFieldValidator: expectedMessage,
        multiFieldValidationError: expectedMessage,
        adapterError: expectedMessage,
        finalizerError: expectedMessage,
        finalizerPending: expectedMessage,
        confirmationFailed: expectedMessage,
        submissionError: expectedMessage
      }
    }

    process.env.MODELED_FORMS_REACT_CONFIG = JSON.stringify(conf);

    const configLoader = new ConfigLoaderImpl();

    for(const key of Object.keys(configLoader.config.globalMessages)) {
      const message = configLoader.config.globalMessages[key as keyof typeof configLoader.config.globalMessages];

      expect(message).not.toBe(
        DEFAULT_CONFIG.globalMessages[key as keyof typeof DEFAULT_CONFIG.globalMessages]
      )

      expect(message).toBe(expectedMessage);
    }
  });
});
