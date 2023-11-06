import { autowire } from "undecorated-di";
import { 
  ConfirmationManagerFactory, 
  ConfirmationManagerFactoryKey, 
  ConfirmationManagerFactoryKeyType 
} from "./confirmation-manager-factory.interface";
import { ConfirmationManagerImpl } from "./confirmation-manager-impl";
import { ConfirmationManager } from "./confirmation-manager.interface";

class ConfirmationManagerFactoryImpl implements ConfirmationManagerFactory {
  createConfirmationManager(): ConfirmationManager {
    return new ConfirmationManagerImpl();
  }
}

const ConfirmationManagerFactoryService = autowire<ConfirmationManagerFactoryKeyType, ConfirmationManagerFactory, ConfirmationManagerFactoryImpl>(
  ConfirmationManagerFactoryImpl, ConfirmationManagerFactoryKey
) 

export { ConfirmationManagerFactoryImpl, ConfirmationManagerFactoryService };