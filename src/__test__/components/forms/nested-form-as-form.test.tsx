import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { RootFormTemplate } from '../../../model';
import { ConfirmButton, Input, NestedFormAsForm, RootForm } from '../../../components';


describe('NestedFormAsForm', () => {
  afterEach(cleanup);

  test('It renders a form element and provides FormContext.', () => {
    const template : RootFormTemplate = {
      fields : {
        myNestedForm : {
          fields : {
            fieldA : '',
            fieldB : ''
          }
        }
      },
      submitFn : ({ value }) => new Promise((resolve) => resolve(value))
    }

    const expectedId = 'my-nested-form-element';

    render(
      <RootForm template={template}>
        <NestedFormAsForm id={expectedId} fieldName='myNestedForm'>
          <Input fieldName='fieldA' type='text' />
          <Input fieldName='fieldB' type='text' />
          <ConfirmButton>Confirm</ConfirmButton>
        </NestedFormAsForm>
      </RootForm>
    )

    const formElement = document.getElementById(expectedId);

    expect(formElement).toBeTruthy();
  });
});