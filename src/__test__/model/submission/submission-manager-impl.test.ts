import { describe, test, expect } from "vitest";
import { SubmitFn } from "../../../model/submission/submit-fn.type";
import { SubmissionManagerImpl } from "../../../model/submission/submission-manager-impl";
import { AnyState, Message, MessageType, Validity } from "../../../model";
import { Visited } from "../../../model/state/visited.enum";
import { Modified } from "../../../model/state/modified-enum";
import { container } from "../../../model/container";

describe('SubmissionManagerImpl', () => {
  test('setting submissionState causes submissionStateChanges to emit a new value.', () => {
    const submitFn : SubmitFn = () => {
      return new Promise((resolve) => {
        resolve('response from an imaginary server');
      });
    }
    const submissionManager = new SubmissionManagerImpl(submitFn);

    const expectedSubmissionState = {
      submissionAttempted : true,
      message : {
        text : 'a message',
        type : MessageType.INVALID
      }
    }

    submissionManager.submissionState = expectedSubmissionState;

    submissionManager.submissionStateChanges.subscribe(change => {
      expect(change).toStrictEqual(expectedSubmissionState);
    })
  });

  test('When submit() is called, submissionAttempted is set to true.', () => {
    const submitFn : SubmitFn = () => {
      return new Promise((resolve) => {
        resolve('response from an imaginary server');
      });
    }
    const submissionManager = new SubmissionManagerImpl(submitFn);

    const state : AnyState = {
      value : {
        someField : ''
      },
      validity : Validity.VALID_FINALIZABLE,
      messages : ([] as Array<Message>),
      visited : Visited.YES,
      modified : Modified.YES,
    }

    submissionManager.submit(state);

    expect(submissionManager.submissionState.submissionAttempted).toBe(true);
  });

  test('When submit() is called, if validity is Validity.INVALID, the promise is rejected.', async () => {
    const submitFn : SubmitFn = () => {
      return new Promise((resolve) => {
        resolve('response from an imaginary server');
      });
    }
    const submissionManager = new SubmissionManagerImpl(submitFn);

    const state : AnyState = {
      value : {},
      validity : Validity.INVALID,
      messages : ([] as Array<Message>),
      visited : Visited.NO,
      modified : Modified.NO,
    }

    let error : any;

    try {
      await submissionManager.submit(state)
    } catch(e) {
      error = e;
    } finally {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('When submit() is called, if validity is Validity.INVALID, message is set to the expected message.', async () => {
    const submitFn : SubmitFn = () => {
      return new Promise((resolve) => {
        resolve('response from an imaginary server');
      });
    }
    const submissionManager = new SubmissionManagerImpl(submitFn);

    const state : AnyState = {
      value : {},
      validity : Validity.INVALID,
      messages : ([] as Array<Message>),
      visited : Visited.NO,
      modified : Modified.NO,
    }

    try {
      await submissionManager.submit(state)
    } catch(e) {
      expect(submissionManager.submissionState.message).toStrictEqual({
        text : container.services.ConfigLoader.config.globalMessages.submissionFailed,
        type : MessageType.INVALID
      });
    } 
  });

  test('When submit() is called, if validity is Validity.VALID_FINALIZABLE and the promise resolves, the promise returned by submit() resolves.', async () => {
    const expectedResponse = 'response from an imaginary server';

    const submitFn : SubmitFn = () => {
      return new Promise((resolve) => {
        resolve(expectedResponse);
      });
    }
    const submissionManager = new SubmissionManagerImpl(submitFn);

    const state : AnyState = {
      value : {
        someField : ''
      },
      validity : Validity.VALID_FINALIZABLE,
      messages : ([] as Array<Message>),
      visited : Visited.YES,
      modified : Modified.YES,
    }

    const response = await submissionManager.submit(state);
    expect(response).toBe(expectedResponse);
  });

  test('When submit() is called, if validity is Validity.VALID_FINALIZABLE and the promise is rejected, the promise returned by submit() is rejected.', async () => {
    const expectedError = new Error('error submitting form data');
    const submitFn : SubmitFn = () => {
      return new Promise((_resolve, reject) => {
        reject(expectedError);
      });
    }
    const submissionManager = new SubmissionManagerImpl(submitFn);

    const state : AnyState = {
      value : {
        someField : ''
      },
      validity : Validity.VALID_FINALIZABLE,
      messages : ([] as Array<Message>),
      visited : Visited.YES,
      modified : Modified.YES,
    }

    let error : any;

    try {
      await submissionManager.submit(state)
    } catch(e) {
      error = e;
    } finally {
      expect(error).toBe(expectedError);
    }
  });
})