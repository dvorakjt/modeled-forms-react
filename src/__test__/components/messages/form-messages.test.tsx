import React from "react";
import { describe, test, expect, afterEach } from "vitest";
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { RootFormTemplate, required } from "../../../model";
import { SubmitButton, FormMessages, RootForm } from "../../../components";
import { MockFormContext } from "../../util/mocks/mock-form-context-provider";
import { renderPossiblyErrantComponent } from "../../util/components/render-possibly-errant-component";
import { container } from "../../../model/container";

describe('FormMessages', () => {
  afterEach(cleanup);

  test('It throws an error when rendered outside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<FormMessages idPrefix="myForm" />)
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error when rendered inside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <FormMessages idPrefix="myForm" />
      </MockFormContext>
    );

    expect(errorDetected).toBe(false);
  });

  test('It displays the form\'s messages.', async () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : {
          defaultValue : '',
          syncValidators : [
            required('field A is required')
          ]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const containerClassName = 'messagesContainer';

    render(
      <RootForm template={template}>
        <FormMessages idPrefix="myForm" containerClassName={containerClassName} />
        <SubmitButton />
      </RootForm>
    )

    const submitButton = document.getElementsByTagName('button')[0];

    await userEvent.click(submitButton);
    
    const messagesContainer = document.getElementsByClassName(containerClassName)[0];

    await waitFor(() => expect(messagesContainer.childNodes[0].textContent).toBe(
      container.services.ConfigLoader.config.globalMessages.confirmationFailed
    ));
  });
});
