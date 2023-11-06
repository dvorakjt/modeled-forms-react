import React from "react";
import { describe, test, expect, afterEach } from "vitest";
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { RootFormTemplate, includesDigit, includesLower, includesSymbol, includesUpper, required } from "../../../model";
import { ConfirmButton, FieldMessages, RootForm } from "../../../components";
import { MockFormContext } from "../../util/mocks/mock-form-context-provider";
import { renderPossiblyErrantComponent } from "../../util/components/render-possibly-errant-component";

describe('FieldMessages', () => {
  afterEach(cleanup);

  test('It throws an error if rendered outside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<FieldMessages fieldName="someField" />);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error if rendered inside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <FieldMessages fieldName="someField" />
      </MockFormContext>
    );

    expect(errorDetected).toBe(false);
  });

  test('It displays an empty array of messages for an unvisited, unmodified field within an unconfirmed form.', () => {
    const template : RootFormTemplate = {
      fields : {
        password : {
          defaultValue : '',
          syncValidators : [
            required('password is required.'),
            includesLower('password must include a lowercase character.'),
            includesUpper('password must include an uppercase character.'),
            includesDigit('password must include a digit.'),
            includesSymbol('password must include a symbol.')
          ]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const containerClassName = 'messagesContainer';

    render(
      <RootForm template={template}>
        <FieldMessages fieldName="password" containerClassName={containerClassName} />
      </RootForm>
    );

    const container = document.getElementsByClassName(containerClassName)[0];

    expect(container.childElementCount).toBe(0);
  });

  test('It displays the expected messages when the field is visited/modified or the form has been confirmed.', async () => {
    const template : RootFormTemplate = {
      fields : {
        password : {
          defaultValue : '',
          syncValidators : [
            required('password is required.'),
            includesLower('password must include a lowercase character.'),
            includesUpper('password must include an uppercase character.'),
            includesDigit('password must include a digit.'),
            includesSymbol('password must include a symbol.')
          ]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const containerClassName = 'messagesContainer';

    render(
      <RootForm template={template}>
        <FieldMessages fieldName="password" containerClassName={containerClassName} />
        <ConfirmButton>Confirm</ConfirmButton>
      </RootForm>
    );

    const confirmButton = document.getElementsByTagName('button')[0];

    await userEvent.click(confirmButton);

    const container = document.getElementsByClassName(containerClassName)[0];

    await waitFor(() => expect(container.childNodes[0].textContent).toBe('password is required.'));
    expect(container.childNodes[1].textContent).toBe('password must include a lowercase character.');
    expect(container.childNodes[2].textContent).toBe('password must include an uppercase character.');
    expect(container.childNodes[3].textContent).toBe('password must include a digit.');
    expect(container.childNodes[4].textContent).toBe('password must include a symbol.');
  });
});