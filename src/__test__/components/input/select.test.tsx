import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootFormTemplate, required } from '../../../model';
import { Select, RootForm } from '../../../components';
import { renderPossiblyErrantComponent } from '../../testing-util/components/render-possibly-errant-component';
import { MockFormContext } from '../../testing-util/mocks/mock-form-context-provider';

describe('Select', () => {
  afterEach(cleanup);

  test('It throws an error when rendered outside of FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<Select fieldName='someField' />);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error when rendered inside a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <Select fieldName='someField' />
      </MockFormContext>
    );
    expect(errorDetected).toBe(false);
  });

  test('When blurred, it calls visit() on the underlying field, setting its data-visited property.', async () => {
    const template : RootFormTemplate = {
      fields : {
        someField : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Select fieldName='someField' />
      </RootForm>
    );

    const select = document.getElementsByTagName('select')[0];

    expect(select.getAttribute('data-visited')).toBeNull();

    await userEvent.click(select);
    
    select.blur();

    await waitFor(() => expect(select.getAttribute('data-visited')).not.toBeNull());
  });

  
  test('When it receives input, its value is updated.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteColor : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Select fieldName='favoriteColor'>
          <option value=''></option>
          <option value='red'>Red</option>
          <option value='green'>Green</option>
          <option value='blue'>Blue</option>
        </Select>
      </RootForm>
    );

    const select = document.getElementsByTagName('select')[0];

    expect(select.value).toBe('');

    await userEvent.selectOptions(select, 'red');

    await waitFor(() => expect(select.value).toBe('red'));
  });

  test('When it receives input, its data-modified attribute becomes not null.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteColor : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Select fieldName='favoriteColor'>
          <option value=''></option>
          <option value='red'>Red</option>
          <option value='green'>Green</option>
          <option value='blue'>Blue</option>
        </Select>
      </RootForm>
    );

    const select = document.getElementsByTagName('select')[0];

    expect(select.getAttribute('data-modified')).toBeNull();

    await userEvent.selectOptions(select, 'red');

    await waitFor(() => expect(select.getAttribute('data-modified')).not.toBeNull());
  });

  test('Its data-validity property updates as the field\'s state.validity property updates.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteColor : {
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
        <Select fieldName='favoriteColor'>
          <option value=''></option>
          <option value='red'>Red</option>
          <option value='green'>Green</option>
          <option value='blue'>Blue</option>
        </Select>
      </RootForm>
    );

    const select = document.getElementsByTagName('select')[0];

    //initial value is VALID because the field is unvisited and unmodified, and the form has not been submitted
    expect(select.getAttribute('data-validity')).toBe('VALID');

    await userEvent.selectOptions(select, 'red');
    await userEvent.selectOptions(select, '');

    await waitFor(() => expect(select.getAttribute('data-validity')).toBe('INVALID'));

    await userEvent.selectOptions(select, 'red');

    await waitFor(() => expect(select.getAttribute('data-validity')).toBe('VALID'));
  });
});