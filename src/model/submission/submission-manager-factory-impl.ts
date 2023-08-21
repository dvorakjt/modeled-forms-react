import { autowire } from "undecorated-di";
import { SubmissionManagerFactory, SubmissionManagerFactoryKey, SubmissionManagerFactoryKeyType } from "./submission-manager-factory.interface";
import { SubmissionManagerImpl } from "./submission-manager-impl";
import { SubmissionManager } from "./submission-manager.interface";
import { SubmitFn } from "./submit-fn.type";

class SubmissionManagerFactoryImpl implements SubmissionManagerFactory {
  createSubmissionManager(submitFn: SubmitFn): SubmissionManager {
    return new SubmissionManagerImpl(submitFn);
  }
}

const SubmissionManagerFactoryService = autowire<SubmissionManagerFactoryKeyType, SubmissionManagerFactory, SubmissionManagerFactoryImpl>(
  SubmissionManagerFactoryImpl,
  SubmissionManagerFactoryKey
)

export { SubmissionManagerFactoryImpl, SubmissionManagerFactoryService }