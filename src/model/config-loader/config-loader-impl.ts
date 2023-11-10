import { autowire } from 'undecorated-di';
import { logErrorInDevMode } from "../util/log-error-in-dev-mode";
import { ConfigLoader, ConfigLoaderKey, ConfigLoaderKeyType } from "./config-loader.interface";
import { Config } from "./config.interface";
import { DEFAULT_CONFIG } from "./default-config";
import { ConfigMFROpts } from '../../util/config-mfr';

class ConfigLoaderImpl implements ConfigLoader {
  config: Config;
  
  constructor() {
    const mergedConfig = {
      ...DEFAULT_CONFIG,
      globalMessages : {
        ...DEFAULT_CONFIG.globalMessages
      }
    }

    const configVar = process.env.MODELED_FORMS_REACT_CONFIG;

    if(configVar) {
      let customConfig : Partial<ConfigMFROpts>;

      try {
        customConfig = JSON.parse(configVar);

        for(const [key, value] of Object.entries(customConfig)) {
          switch(key) {
            case 'autoTrim' :
              if(typeof value === 'boolean') {
                mergedConfig[key] = value;
              }
              break;
            case 'emailRegex' :
            case 'symbolRegex' :
              if(typeof value === 'string') {
                try {
                  const regex = new RegExp(value);
                  mergedConfig[key] = regex;
                } catch(e) {
                  logErrorInDevMode(e);
                }
              }
              break;
            case 'globalMessages' :
              if(typeof value === 'object') {
                for(const [messageKey, messageValue] of Object.entries(value)) {
                  if(Object.prototype.hasOwnProperty.call(mergedConfig.globalMessages, messageKey) && typeof messageValue === 'string') {
                    mergedConfig.globalMessages[messageKey as keyof typeof mergedConfig.globalMessages] = messageValue;
                  }
                }
              }
              break;
          }
        }
      } catch(e) {
        logErrorInDevMode(e);
      }
    }

    this.config = mergedConfig;
  }
}

const ConfigLoaderService = autowire<ConfigLoaderKeyType, ConfigLoader, ConfigLoaderImpl>(
  ConfigLoaderImpl,
  ConfigLoaderKey
);

export { ConfigLoaderImpl, ConfigLoaderService };