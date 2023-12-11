import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { RootFormTemplate } from '../../../model';
import { Input, ResetButton, RootForm } from '../../../components';
import { renderPossiblyErrantComponent } from '../../testing-util/components/render-possibly-errant-component';

describe('ResetButton', () => {
  afterEach(cleanup);

  test('It does NOT throw an error if rendered inside of a form context.', () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }
    const { errorDetected } = renderPossiblyErrantComponent(<RootForm template={template}><ResetButton /></RootForm>);
    expect(errorDetected).toBe(false);
  });

  test('It throws an error if rendered outside of a form context.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<ResetButton />);
    expect(errorDetected).toBe(true);
  });
  
  test('It resets the form when clicked.', async () => {
    const template : RootFormTemplate = {
      fields : {
        fieldA : '',
        fieldB : ''
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <Input type='text' fieldName='fieldA' />
        <Input type='text' fieldName='fieldB' />
        <ResetButton />
      </RootForm>
    );

    //add some values to the fields
    const inputElements = document.getElementsByTagName('input');

    await userEvent.type(inputElements[0], 'some value');

    await waitFor(() => expect(inputElements[0].value).toBe('some value'));

    await userEvent.type(inputElements[1], 'some other value');

    await waitFor(() => expect(inputElements[1].value).toBe('some other value'));

    //click the reset button
    const resetButton = document.getElementsByTagName('button')[0];

    await userEvent.click(resetButton);

    //await reset
    await waitFor(() => expect(inputElements[0].value).toBe(''));
    expect(inputElements[1].value).toBe('');
  });
});