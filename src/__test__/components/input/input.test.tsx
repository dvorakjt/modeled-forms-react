import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootFormTemplate, required } from '../../../model';
import { Input, RootForm } from '../../../components';
import { renderPossiblyErrantComponent } from '../../testing-util/components/render-possibly-errant-component';
import { MockFormContext } from '../../testing-util/mocks/mock-form-context-provider';

describe('Input', () => {
  afterEach(cleanup);

  test('It throws an error when rendered outside of FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<Input fieldName='someField' type='text' />);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error when rendered inside a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <Input fieldName='someField' type='text' />
      </MockFormContext>
    );
    expect(errorDetected).toBe(false);
  });

  test('When blurred, it calls visit() on the underlying field, setting the input\'s data-visited property.', async () => {
    const template : RootFormTemplate = {
      fields : {
        someField : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Input fieldName='someField' type='text' />
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];

    expect(input.getAttribute('data-visited')).toBeNull();

    await userEvent.click(input);
    
    input.blur();

    await waitFor(() => expect(input.getAttribute('data-visited')).not.toBeNull());
  });

  test('When it receives input, its value is updated.', async () => {
    const template : RootFormTemplate = {
      fields : {
        someField : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Input fieldName='someField' type='text' />
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];

    expect(input.getAttribute('data-modified')).toBeNull();

    const expectedValue = 'hello world';

    await userEvent.type(input, expectedValue);

    await waitFor(() => expect(input.value).toBe(expectedValue));
  });


  test('When it receives input, its data-modified attribute becomes not null.', async () => {
    const template : RootFormTemplate = {
      fields : {
        someField : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Input fieldName='someField' type='text' />
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];

    expect(input.getAttribute('data-modified')).toBeNull();

    await userEvent.type(input, 'hello world');

    await waitFor(() => expect(input.getAttribute('data-modified')).not.toBeNull());
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
        <Input fieldName='someField' type='text' />
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];

    //initial value is VALID because the field is unvisited and unmodified, and the form has not been submitted
    expect(input.getAttribute('data-validity')).toBe('VALID');

    await userEvent.type(input, 'hello world');
    await userEvent.clear(input);

    await waitFor(() => expect(input.getAttribute('data-validity')).toBe('INVALID'));

    await userEvent.type(input, 'hello world');

    await waitFor(() => expect(input.getAttribute('data-validity')).toBe('VALID'));
  });
});