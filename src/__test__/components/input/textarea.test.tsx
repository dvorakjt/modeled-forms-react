import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootFormTemplate, required } from '../../../model';
import { Textarea, RootForm } from '../../../components';
import { renderPossiblyErrantComponent } from '../../testing-util/components/render-possibly-errant-component';
import { MockFormContext } from '../../testing-util/mocks/mock-form-context-provider';

describe('Textarea', () => {
  afterEach(cleanup);

  test('It throws an error when rendered outside of FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<Textarea fieldName='someField' />);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error when rendered inside a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <Textarea fieldName='someField' />
      </MockFormContext>
    );
    expect(errorDetected).toBe(false);
  });

  test('When blurred, it calls visit() on the underlying field, setting the textarea\'s data-visited property.', async () => {
    const template : RootFormTemplate = {
      fields : {
        someField : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Textarea fieldName='someField' />
      </RootForm>
    );

    const textarea = document.getElementsByTagName('textarea')[0];

    expect(textarea.getAttribute('data-visited')).toBeNull();

    await userEvent.click(textarea);
    
    textarea.blur();

    await waitFor(() => expect(textarea.getAttribute('data-visited')).not.toBeNull());
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
        <Textarea fieldName='someField' />
      </RootForm>
    );

    const textarea = document.getElementsByTagName('textarea')[0];

    expect(textarea.getAttribute('data-modified')).toBeNull();

    const expectedValue = 'hello world';

    await userEvent.type(textarea, expectedValue);

    await waitFor(() => expect(textarea.value).toBe(expectedValue));
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
        <Textarea fieldName='someField' />
      </RootForm>
    );

    const textarea = document.getElementsByTagName('textarea')[0];

    expect(textarea.getAttribute('data-modified')).toBeNull();

    await userEvent.type(textarea, 'hello world');

    await waitFor(() => expect(textarea.getAttribute('data-modified')).not.toBeNull());
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
        <Textarea fieldName='someField' />
      </RootForm>
    );

    const textarea = document.getElementsByTagName('textarea')[0];

    //initial value is VALID because the field is unvisited and unmodified, and the form has not been submitted
    expect(textarea.getAttribute('data-validity')).toBe('VALID');

    await userEvent.type(textarea, 'hello world');
    await userEvent.clear(textarea);

    await waitFor(() => expect(textarea.getAttribute('data-validity')).toBe('INVALID'));

    await userEvent.type(textarea, 'hello world');

    await waitFor(() => expect(textarea.getAttribute('data-validity')).toBe('VALID'));
  });
});