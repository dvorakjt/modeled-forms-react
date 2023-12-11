import React from 'react';
import { describe, test, expect, afterEach } from "vitest";
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootFormTemplate, required } from '../../../model';
import { Label, Input, RootForm } from '../../../components';
import { MockFormContext } from '../../testing-util/mocks/mock-form-context-provider';
import { renderPossiblyErrantComponent } from '../../testing-util/components/render-possibly-errant-component';

describe('Label', () => {
  afterEach(cleanup);

  test('It throws an error when rendered outside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<Label fieldName='someField'>Some Field</Label>);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error when rendered inside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <Label fieldName='someField'>Some Field</Label>
      </MockFormContext>
    );

    expect(errorDetected).toBe(false);
  });

  test('When the corresponding <Input /> is blurred, its data-visited property becomes not null.', async () => {
    const template : RootFormTemplate = {
      fields : {
        someField : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Label fieldName='someField'>Some Field</Label>
        <Input fieldName='someField' type='text' />
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];
    const label = document.getElementsByTagName('label')[0];

    expect(label.getAttribute('data-visited')).toBeNull();

    await userEvent.click(input);
    
    input.blur();

    await waitFor(() => expect(label.getAttribute('data-visited')).not.toBeNull());
  });

  test('When the corresponding <Input /> receives input, its data-modified attribute becomes not null.', async () => {
    const template : RootFormTemplate = {
      fields : {
        someField : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Label fieldName='someField'>Some Field</Label>
        <Input fieldName='someField' type='text' />
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];
    const label = document.getElementsByTagName('label')[0];

    expect(label.getAttribute('data-modified')).toBeNull();

    await userEvent.type(input, 'hello world');

    await waitFor(() => expect(label.getAttribute('data-modified')).not.toBeNull());
  });

  test('Its data-validity property updates as the field\'s state.validity property updates.', async () => {
    const template : RootFormTemplate = {
      fields : {
        someField : {
          defaultValue : '',
          syncValidators : [
            required('someField is required.')
          ]
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Label fieldName='someField'>Some Field</Label>
        <Input fieldName='someField' type='text' />
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];
    const label = document.getElementsByTagName('label')[0];

    //initial value is VALID because the field is unvisited and unmodified, and the form has not been submitted
    expect(label.getAttribute('data-validity')).toBe('VALID');

    await userEvent.type(input, 'hello world');
    await userEvent.clear(input);

    await waitFor(() => expect(label.getAttribute('data-validity')).toBe('INVALID'));

    await userEvent.type(input, 'hello world');

    await waitFor(() => expect(label.getAttribute('data-validity')).toBe('VALID'));
  });
});