import React from 'react';
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootFormTemplate, required } from '../../../model';
import { SubmitButton, RootForm } from '../../../components';
import { renderPossiblyErrantComponent } from '../../util/components/render-possibly-errant-component';
import { MockFormContext } from '../../util/mocks/mock-form-context-provider';
import { MockRootFormContext } from '../../util/mocks/mock-root-form-context-provider';

describe('SubmitButton', () => {
  afterEach(cleanup);

  test('It throws an error if rendered outside of a RootFormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <SubmitButton onResolve={(val) => console.log(val)} onReject={(e) => console.error(e)} />
      </MockFormContext>
    );
    expect(errorDetected).toBe(true);
  });

  test('It throws an error if rendered outside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockRootFormContext>
        <SubmitButton onResolve={(val) => console.log(val)} onReject={(e) => console.error(e)} />
      </MockRootFormContext>
    );
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error if rendered inside both a RootFormContext and a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockRootFormContext>
        <MockFormContext>
          <SubmitButton onResolve={(val) => console.log(val)} onReject={(e) => console.error(e)} />
        </MockFormContext>
      </MockRootFormContext>
    );
    expect(errorDetected).toBe(false);
  });

  test('The button is disabled if validity is less than Validity.VALID_FINALIZABLE.', () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : {
          defaultValue : '',
          syncValidators : [
            required('Field A is required.')
          ]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SubmitButton onResolve={(val) => console.log(val)} onReject={(e) => console.error(e)} />
      </RootForm>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    expect(submitButton.getAttribute('disabled')).not.toBeNull();
  });

  test('The button is NOT disabled if validity is Validity.VALID_FINALIZABLE.', () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SubmitButton onResolve={(val) => console.log(val)} onReject={(e) => console.error(e)} />
      </RootForm>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    expect(submitButton.getAttribute('disabled')).toBeNull();
  });

  test('When clicked, the RootFormContext\'s submit() method is called.', async () => {
    const submit = vi.fn().mockResolvedValue({ fieldA : ''});

    render(
      <MockRootFormContext mockContextValue={{ submit }}>
        <MockFormContext>
          <SubmitButton onResolve={() => {
            return;
          }} onReject={(e) => console.error(e)} />
        </MockFormContext>
      </MockRootFormContext>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    userEvent.click(submitButton);

    await waitFor(() => expect(submit).toHaveBeenCalledOnce());
  });

  test('When clicked, if the promise returned by the submit function resolves, onResolve is called.', async () => {
    const expectedValue = { fieldA : 'test' };

    const submit = vi.fn().mockResolvedValue(expectedValue);

    const onResolve = vi.fn();

    render(
      <MockRootFormContext mockContextValue={{ submit }}>
        <MockFormContext>
          <SubmitButton onResolve={onResolve} onReject={(e) => console.error(e)} />
        </MockFormContext>
      </MockRootFormContext>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    userEvent.click(submitButton);

    await waitFor(() => expect(onResolve).toHaveBeenCalledWith(expectedValue));
  });

  test('When clicked, if the promise returned by the submit function is rejected, onReject is called.', async () => {
    const expectedError = new Error('Error submitting form.');

    const submit = vi.fn().mockRejectedValue(expectedError);

    const onReject = vi.fn();

    render(
      <MockRootFormContext mockContextValue={{ submit }}>
        <MockFormContext>
          <SubmitButton onResolve={vi.fn()} onReject={onReject} />
        </MockFormContext>
      </MockRootFormContext>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    userEvent.click(submitButton);

    await waitFor(() => expect(onReject).toHaveBeenCalledWith(expectedError));
  });

  test('When clicked, onFinally is called if the promise resolved.', async () => {
    const submit = vi.fn().mockResolvedValue({ fieldA : ''})

    const onFinally = vi.fn();

    render(
      <MockRootFormContext mockContextValue={{ submit }}>
        <MockFormContext>
          <SubmitButton onResolve={vi.fn()} onReject={vi.fn()} onFinally={onFinally} />
        </MockFormContext>
      </MockRootFormContext>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    userEvent.click(submitButton);

    await waitFor(() => expect(onFinally).toHaveBeenCalledOnce());
  });

  test('When clicked, onFinally is called if the promise was rejected.', async () => {
    const submit = vi.fn().mockRejectedValue(new Error('Error submitting the form.'));

    const onFinally = vi.fn();

    render(
      <MockRootFormContext mockContextValue={{ submit }}>
        <MockFormContext>
          <SubmitButton onResolve={vi.fn()} onReject={vi.fn()} onFinally={onFinally} />
        </MockFormContext>
      </MockRootFormContext>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    userEvent.click(submitButton);

    await waitFor(() => expect(onFinally).toHaveBeenCalledOnce());
  });
});
