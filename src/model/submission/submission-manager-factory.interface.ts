import { SubmissionManager } from "./submission-manager.interface";
import { SubmitFn } from "./submit-fn.type";

interface SubmissionManagerFactory {
  createSubmissionManager(submitFn : SubmitFn) : SubmissionManager;
}
const SubmissionManagerFactoryKey = 'SubmissionManagerFactory';
type SubmissionManagerFactoryKeyType = typeof SubmissionManagerFactoryKey;

export { SubmissionManagerFactoryKey, type SubmissionManagerFactory, type SubmissionManagerFactoryKeyType };