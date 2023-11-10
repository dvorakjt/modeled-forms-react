import { autowire } from 'undecorated-di';
import { copyObject } from "../util/copy-object";
import { logErrorInDevMode } from "../util/log-error-in-dev-mode";
import { ConfigLoader, ConfigLoaderKey, ConfigLoaderKeyType } from "./config-loader.interface";
import { Config } from "./config.interface";
import { DEFAULT_CONFIG } from "./default-config";
import { ConfigMFROpts } from '../../util/config-mfr';

class ConfigLoaderImpl implements ConfigLoader {
  config: Config;
  
  constructor() {
    const mergedConfig = copyObject(DEFAULT_CONFIG);

    const configVar = process.env.MODELED_FORMS_REACT_CONFIG;

    if(configVar) {
      let customConfig : Partial<ConfigMFROpts>;

      try {
        customConfig = JSON.parse(configVar);

        for(const [key, value] of Object.entries(customConfig)) {

          if(key in mergedConfig) { 
            if(key.includes('Regex') && typeof value === 'string') {
              try {
                const regex = new RegExp(value);
                mergedConfig[key] = regex;
              } catch(e) {
                logErrorInDevMode(e);
              }
            } else if(typeof value === typeof mergedConfig[key]) {
              mergedConfig[key] = value;
            }
          }
        }
      } catch(e) {
        logErrorInDevMode(e);
      }
    }

    this.config = mergedConfig;

    console.log(this.config);
  }
}

const ConfigLoaderService = autowire<ConfigLoaderKeyType, ConfigLoader, ConfigLoaderImpl>(
  ConfigLoaderImpl,
  ConfigLoaderKey
);

export { ConfigLoaderImpl, ConfigLoaderService };