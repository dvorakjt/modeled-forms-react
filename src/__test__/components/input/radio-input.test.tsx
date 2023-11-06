import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootFormTemplate } from '../../../model';
import { RadioInput, RootForm } from '../../../components';
import { renderPossiblyErrantComponent } from '../../util/components/render-possibly-errant-component';
import { MockFormContext } from '../../util/mocks/mock-form-context-provider';
describe('RadioInput', () => {
  afterEach(cleanup);

  test('It throws an error when rendered outside of FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<RadioInput fieldName='someField' value='someValue' labelText='Some Field' />);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error when rendered inside a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <RadioInput fieldName='someField' value='someValue' labelText='Some Field' />
      </MockFormContext>
    );
    expect(errorDetected).toBe(false);
  });

  test('When clicked, it calls visit() on the underlying field, setting the input\'s data-visited property.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myRadio : 'some value'
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <RadioInput fieldName='myRadio' value='some value' labelText='Some Value' />
      </RootForm>
    );

    const radio = document.getElementsByTagName('input')[0];

    expect(radio.getAttribute('data-visited')).toBeNull();

    await userEvent.click(radio);

    await waitFor(() => expect(radio.getAttribute('data-visited')).not.toBeNull());
  });

  test('When clicked, it calls visit() on the underlying field, setting the label\'s data-visited property.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myRadio : 'some value'
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <RadioInput fieldName='myRadio' value='some value' labelText='Some Value' />
      </RootForm>
    );

    const radio = document.getElementsByTagName('input')[0];
    const label = document.getElementsByTagName('label')[0];

    expect(label.getAttribute('data-visited')).toBeNull();

    await userEvent.click(radio);

    await waitFor(() => expect(label.getAttribute('data-visited')).not.toBeNull());
  });

  test('When multiple radio buttons are present, the field\'s value is updated accordingly when each is clicked.', async () => {
    const template : RootFormTemplate = {
      fields : {
        occupation : 'programmer'
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <RadioInput fieldName='occupation' value='programmer' labelText='Programmer' />
        <RadioInput fieldName='occupation' value='doctor' labelText='Doctor' />
        <RadioInput fieldName='occupation' value='chef' labelText='Chef' />
      </RootForm>
    );

    const radioElements = document.getElementsByTagName('input');

    expect(radioElements[0].checked).toBe(true);

    await userEvent.click(radioElements[1]);

    await waitFor(() => expect(radioElements[1].checked && !radioElements[0].checked).toBe(true));
  });
});