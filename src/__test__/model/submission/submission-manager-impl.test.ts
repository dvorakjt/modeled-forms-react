import { describe, test, expect, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { SubmissionManagerImpl } from "../../../model/submission/submission-manager-impl";
import { container } from "../../../model/container";
import { Message, MessageType, State, Validity } from "../../../model";
import { Visited } from "../../../model/state/visited.enum";
import { Modified } from "../../../model/state/modified-enum";

describe('SubmissionManagerImpl', () => {
  test('trySubmit() calls onSuccess when the Promise returned by the submitFn resolves.', async () => {
    const submitFn = () => new Promise<void>((resolve) => resolve());

    const submissionManager = new SubmissionManagerImpl(submitFn, container.services.ConfigLoader.config);

    const onSuccess = vi.fn();

    const state : State<any> = {
      value : {},
      validity : Validity.VALID_FINALIZABLE,
      messages : [] as Array<Message>,
      visited : Visited.NO,
      modified : Modified.NO
    }

    submissionManager.trySubmit({ state, onSuccess });

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  test('If the promise returned by the submitFn is rejected with an error that has a message property, message.text is set to that message.', async () => {
    const expectedError = 'There was a problem submitting the form.';

    const submitFn = vi.fn().mockRejectedValue(new Error(expectedError));

    const submissionManager = new SubmissionManagerImpl(submitFn, container.services.ConfigLoader.config);

    const state : State<any> = {
      value : {},
      validity : Validity.VALID_FINALIZABLE,
      messages : [] as Array<Message>,
      visited : Visited.NO,
      modified : Modified.NO
    }

    submissionManager.trySubmit({ state, });

    await waitFor(() => expect(submissionManager.message).toStrictEqual({
      text : expectedError,
      type : MessageType.ERROR
    }));
  });

  test('If the promise returned by the submitFn is rejected without a message, message.text is set to the global default.', async () => {
    const submitFn = vi.fn().mockRejectedValue(null);

    const submissionManager = new SubmissionManagerImpl(submitFn, container.services.ConfigLoader.config);

    const state : State<any> = {
      value : {},
      validity : Validity.VALID_FINALIZABLE,
      messages : [] as Array<Message>,
      visited : Visited.NO,
      modified : Modified.NO
    }

    submissionManager.trySubmit({ state, });

    await waitFor(() => expect(submissionManager.message).toStrictEqual({
      text : container.services.ConfigLoader.config.globalMessages.submissionError,
      type : MessageType.ERROR
    }));
  });

  test('trySubmit() calls onError when the Promise returned by the submitFn is rejected.', async () => {
    const submitFn = vi.fn().mockRejectedValue(new Error('error submitting the form'));

    const submissionManager = new SubmissionManagerImpl(submitFn, container.services.ConfigLoader.config);

    const onError = vi.fn();

    const state : State<any> = {
      value : {},
      validity : Validity.VALID_FINALIZABLE,
      messages : [] as Array<Message>,
      visited : Visited.NO,
      modified : Modified.NO
    }

    submissionManager.trySubmit({ state, onError });

    await waitFor(() => expect(onError).toHaveBeenCalled());
  });


  test('trySubmit() calls onFinally when the Promise returned by the submitFn resolves.', async () => {
    const submitFn = () => new Promise<void>((resolve) => resolve());

    const submissionManager = new SubmissionManagerImpl(submitFn, container.services.ConfigLoader.config);

    const onFinally= vi.fn();

    const state : State<any> = {
      value : {},
      validity : Validity.VALID_FINALIZABLE,
      messages : [] as Array<Message>,
      visited : Visited.NO,
      modified : Modified.NO
    }

    submissionManager.trySubmit({ state, onFinally });

    await waitFor(() => expect(onFinally).toHaveBeenCalled());
  });

  test('trySubmit() calls onFinally when the Promise returned by the submitFn is rejected.', async () => {
    const submitFn = vi.fn().mockRejectedValue(new Error('error submitting the form'));

    const submissionManager = new SubmissionManagerImpl(submitFn, container.services.ConfigLoader.config);

    const onFinally = vi.fn();

    const state : State<any> = {
      value : {},
      validity : Validity.VALID_FINALIZABLE,
      messages : [] as Array<Message>,
      visited : Visited.NO,
      modified : Modified.NO
    }

    submissionManager.trySubmit({ state, onFinally });

    await waitFor(() => expect(onFinally).toHaveBeenCalled());
  });
});