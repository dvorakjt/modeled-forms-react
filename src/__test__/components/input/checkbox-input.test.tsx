import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootFormTemplate, required } from '../../../model';
import { CheckboxInput, RootForm } from '../../../components';
import { renderPossiblyErrantComponent } from '../../testing-util/components/render-possibly-errant-component';
import { MockFormContext } from '../../testing-util/mocks/mock-form-context-provider';
import { FormValueDisplay } from '../../../stories/utils/form-value-display.component';

describe('CheckboxInput', () => {
  afterEach(cleanup);

  test('It throws an error when rendered outside of FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<CheckboxInput fieldName='someField' value='someValue' labelText='Some Field' />);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error when rendered inside a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <CheckboxInput fieldName='someField' value='someValue' labelText='Some Field' />
      </MockFormContext>
    );
    expect(errorDetected).toBe(false);
  });

  test('When clicked, it calls focus() on the underlying field, setting the input\'s data-focused property.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myCheckbox : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <CheckboxInput fieldName='myCheckbox' value='checked' labelText='Check Me' />
      </RootForm>
    );

    const checkbox = document.getElementsByTagName('input')[0];

    expect(checkbox.getAttribute('data-focused')).toBeNull();

    await userEvent.click(checkbox);

    await waitFor(() => expect(checkbox.getAttribute('data-focused')).not.toBeNull());
  });

  test('When clicked, it calls focus() on the underlying field, setting the label\'s data-focused property.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myCheckbox : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <CheckboxInput fieldName='myCheckbox' value='checked' labelText='Check Me' />
      </RootForm>
    );

    const checkbox = document.getElementsByTagName('input')[0];
    const label = document.getElementsByTagName('label')[0];

    expect(label.getAttribute('data-focused')).toBeNull();

    await userEvent.click(checkbox);

    await waitFor(() => expect(label.getAttribute('data-focused')).not.toBeNull());
  });

  test('When clicked, input[data-modified] becomes not null.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myCheckbox : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <CheckboxInput fieldName='myCheckbox' value='checked' labelText='Check Me' />
      </RootForm>
    );

    const checkbox = document.getElementsByTagName('input')[0];

    expect(checkbox.getAttribute('data-modified')).toBeNull();

    await userEvent.click(checkbox);

    await waitFor(() => expect(checkbox.getAttribute('data-modified')).not.toBeNull());
  });

  test('When clicked, label[data-modified] becomes not null.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myCheckbox : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <CheckboxInput fieldName='myCheckbox' value='checked' labelText='Check Me' />
      </RootForm>
    );

    const checkbox = document.getElementsByTagName('input')[0];
    const label = document.getElementsByTagName('label')[0];

    expect(label.getAttribute('data-modified')).toBeNull();

    await userEvent.click(checkbox);

    await waitFor(() => expect(label.getAttribute('data-modified')).not.toBeNull());
  });

  test('When blurred, input[data-visited] becomes not null.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myCheckbox : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <CheckboxInput fieldName='myCheckbox' value='checked' labelText='Check Me' />
      </RootForm>
    );

    const checkbox = document.getElementsByTagName('input')[0];

    expect(checkbox.getAttribute('data-visited')).toBeNull();

    await userEvent.click(checkbox);
    checkbox.blur();

    await waitFor(() => expect(checkbox.getAttribute('data-visited')).not.toBeNull());
  });

  test('When blurred, label[data-visited] becomes not null.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myCheckbox : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <CheckboxInput fieldName='myCheckbox' value='checked' labelText='Check Me' />
      </RootForm>
    );

    const checkbox = document.getElementsByTagName('input')[0];
    const label = document.getElementsByTagName('label')[0];

    expect(label.getAttribute('data-visited')).toBeNull();

    await userEvent.click(checkbox);
    checkbox.blur();

    await waitFor(() => expect(label.getAttribute('data-visited')).not.toBeNull());
  });

  test('The input\'s data-validity property updates as the field\'s state.validity property updates.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myCheckbox : {
          defaultValue : '',
          syncValidators : [
            required('This checkbox must be checked.')
          ]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <CheckboxInput fieldName='myCheckbox' value='checked' labelText='Check Me' />
      </RootForm>
    );

    const checkbox = document.getElementsByTagName('input')[0];

    //initial value is VALID because the field is unvisited and unmodified, and the form has not been submitted
    expect(checkbox.getAttribute('data-validity')).toBe('VALID');

    await userEvent.dblClick(checkbox);

    await waitFor(() => expect(checkbox.getAttribute('data-validity')).toBe('INVALID'));

    await userEvent.click(checkbox);

    await waitFor(() => expect(checkbox.getAttribute('data-validity')).toBe('VALID'));
  });

  test('The label\'s data-validity property updates as the field\'s state.validity property updates.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myCheckbox : {
          defaultValue : '',
          syncValidators : [
            required('This checkbox must be checked.')
          ]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <CheckboxInput fieldName='myCheckbox' value='checked' labelText='Check Me' />
      </RootForm>
    );

    const checkbox = document.getElementsByTagName('input')[0];
    const label = document.getElementsByTagName('label')[0];

    //initial value is VALID because the field is unvisited and unmodified, and the form has not been submitted
    expect(label.getAttribute('data-validity')).toBe('VALID');

    await userEvent.dblClick(checkbox);

    await waitFor(() => expect(label.getAttribute('data-validity')).toBe('INVALID'));

    await userEvent.click(checkbox);

    await waitFor(() => expect(label.getAttribute('data-validity')).toBe('VALID'));
  });

  test('It sets the field\'s value to an empty string when it is unchecked.', async () => {
    const template : RootFormTemplate = {
      fields : {
        myCheckbox : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <CheckboxInput fieldName='myCheckbox' value='checked' labelText='Check Me' />
        <FormValueDisplay />
      </RootForm>
    );

    const checkbox = document.getElementsByTagName('input')[0];
    const formValueDisplay = document.getElementsByTagName('pre')[0];

    await userEvent.dblClick(checkbox);

    await waitFor(() => expect(formValueDisplay.textContent).toBe(JSON.stringify({ myCheckbox : ''})));
  });
});