import React from 'react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootFormTemplate, required } from '../../../model';
import { ConfirmButton, RootForm } from '../../../components';
import { renderPossiblyErrantComponent } from '../../util/components/render-possibly-errant-component';
import { MockFormContext } from '../../util/mocks/mock-form-context-provider';
import { container } from '../../../model/container';

describe('ConfirmButton', () => {
  afterEach(cleanup);

  test('It throws an error if rendered outside a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<ConfirmButton />);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error if rendered inside a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <ConfirmButton />
      </MockFormContext>
    );
    expect(errorDetected).toBe(false);
  });

  test('When clicked, it calls tryConfirm, passing in onSuccess, onError and errorMessage.', async () => {
    const props = {
      onSuccess : vi.fn(),
      onError : vi.fn(),
      errorMessage : 'There was an error confirming the form.'
    }

    const tryConfirm = vi.fn();

    render(
      <MockFormContext mockContextValue={{ tryConfirm }}>
        <ConfirmButton {...props}>Confirm</ConfirmButton>
      </MockFormContext>
    )

    const confirmButton = document.getElementsByTagName('button')[0];

    await userEvent.click(confirmButton);

    await waitFor(() => expect(tryConfirm).toHaveBeenCalledWith(props));
  });

  test('When no errorMessage is passed in a prop, the global default confirmation error message is used.', async () => {
    const expectedTryConfirmArg = {
      errorMessage : container.services.ConfigLoader.config.globalMessages.confirmationFailed
    }

    const tryConfirm = vi.fn();

    render(
      <MockFormContext mockContextValue={{ tryConfirm }}>
        <ConfirmButton>Confirm</ConfirmButton>
      </MockFormContext>
    )

    const confirmButton = document.getElementsByTagName('button')[0];

    await userEvent.click(confirmButton);

    await waitFor(() => expect(tryConfirm).toHaveBeenCalledWith(expectedTryConfirmArg));
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
        <ConfirmButton enableOnlyWhenValid />
      </RootForm>
    );

    const confirmButton = document.getElementsByTagName('button')[0];

    expect(confirmButton.getAttribute('disabled')).not.toBeNull();
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
        <ConfirmButton enableOnlyWhenValid/>
      </RootForm>
    );

    const confirmButton = document.getElementsByTagName('button')[0];

    expect(confirmButton.getAttribute('disabled')).toBeNull();
  });
});
