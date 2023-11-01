import { describe, test, expect } from "vitest";
import { SubmissionManagerFactoryImpl } from "../../../model/submission/submission-manager-factory-impl";
import { SubmitFn } from "../../../model/submission/submit-fn.type";
import { SubmissionManagerImpl } from "../../../model/submission/submission-manager-impl";

describe('SubmissionManagerFactoryImpl', () => {
  test('createSubmissionManager returns a new SubmissionManagerImpl.', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const submitFn : SubmitFn = ({ value }) => {
      return new Promise((resolve) => {
        resolve('Response from an imaginary server.');
      })
    }

    const submissionManagerFactory = new SubmissionManagerFactoryImpl();

    expect(submissionManagerFactory.createSubmissionManager(submitFn)).toBeInstanceOf(SubmissionManagerImpl);
  });
});