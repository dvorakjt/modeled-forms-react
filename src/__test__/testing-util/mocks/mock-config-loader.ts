import { ConfigLoader } from '../../../model/config-loader/config-loader.interface';
import { Config } from '../../../model/config-loader/config.interface';

export class MockConfigLoader implements ConfigLoader {
  constructor(config: Partial<Config>) {
    this.config = config as Config;
  }

  config: Config;
}
