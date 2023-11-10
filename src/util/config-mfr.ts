import { Config } from "../model/config-loader/config.interface";

export type ConfigMFROpts = {
  [K in keyof Config] : K extends 'emailRegex' | 'symbolRegex' ? string : Config[K]
}

export function configMFR(options : Partial<ConfigMFROpts>) {
  return {
    MODELED_FORMS_REACT_CONFIG : JSON.stringify(options)
  }
}