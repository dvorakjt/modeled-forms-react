import { Config } from "./config.interface"

interface ConfigLoader {
  config : Config
}

const ConfigLoaderKey = 'ConfigLoader';

type ConfigLoaderKeyType = typeof ConfigLoaderKey;

export { ConfigLoaderKey, type ConfigLoader, type ConfigLoaderKeyType };