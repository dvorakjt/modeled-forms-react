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
        <SubmitButton />
      </MockFormContext>
    );
    expect(errorDetected).toBe(true);
  });

  test('It throws an error if rendered outside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockRootFormContext>
        <SubmitButton />
      </MockRootFormContext>
    );
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error if rendered inside both a RootFormContext and a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockRootFormContext>
        <MockFormContext>
          <SubmitButton />
        </MockFormContext>
      </MockRootFormContext>
    );
    expect(errorDetected).toBe(false);
  });

  test('The button is disabled if validity is less than Validity.VALID_FINALIZABLE and enableOnlyWhenValid is true.', () => {
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
        <SubmitButton enableOnlyWhenValid />
      </RootForm>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    expect(submitButton.getAttribute('disabled')).not.toBeNull();
  });

  test('The button is NOT disabled if validity is Validity.VALID_FINALIZABLE and enableOnlyWhenValid is true.', () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SubmitButton enableOnlyWhenValid/>
      </RootForm>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    expect(submitButton.getAttribute('disabled')).toBeNull();
  });

  test('When clicked, the RootFormContext\'s submit() method is called.', async () => {
    const trySubmit = vi.fn().mockResolvedValue({ fieldA : ''});

    render(
      <MockRootFormContext mockContextValue={{ trySubmit }}>
        <MockFormContext>
          <SubmitButton />
        </MockFormContext>
      </MockRootFormContext>
    );

    const submitButton = document.getElementsByTagName('button')[0];

    await userEvent.click(submitButton);

    await waitFor(() => expect(trySubmit).toHaveBeenCalledOnce());
  });
});
