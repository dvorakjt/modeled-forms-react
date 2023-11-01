import { autowire } from 'undecorated-di';
import { config } from '../../config';
import { ConfigLoader, ConfigLoaderKey, ConfigLoaderKeyType } from './config-loader.interface';

export class ConfigLoaderImpl implements ConfigLoader {
  config = config;
}

export const ConfigLoaderService = autowire<ConfigLoaderKeyType, ConfigLoader, ConfigLoaderImpl>(ConfigLoaderImpl, ConfigLoaderKey);