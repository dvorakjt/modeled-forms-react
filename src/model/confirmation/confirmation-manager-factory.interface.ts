import { ConfirmationManager } from './confirmation-manager.interface';

interface ConfirmationManagerFactory {
  createConfirmationManager(): ConfirmationManager;
}

const ConfirmationManagerFactoryKey = 'ConfirmationManagerFactory';

type ConfirmationManagerFactoryKeyType = typeof ConfirmationManagerFactoryKey;

export {
  ConfirmationManagerFactoryKey,
  type ConfirmationManagerFactory,
  type ConfirmationManagerFactoryKeyType,
};
