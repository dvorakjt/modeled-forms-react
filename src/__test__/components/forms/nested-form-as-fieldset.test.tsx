import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { RootFormTemplate } from '../../../model';
import { ConfirmButton, Input, NestedFormAsFieldset, RootForm } from '../../../components';

describe('NestedFormAsFieldset', () => {
  afterEach(cleanup);

  test('It renders a fieldset element and provides FormContext.', () => {
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

    render(
      <RootForm template={template}>
        <NestedFormAsFieldset fieldName='myNestedForm'>
          <Input fieldName='fieldA' type='text' />
          <Input fieldName='fieldB' type='text' />
          <ConfirmButton>Confirm</ConfirmButton>
        </NestedFormAsFieldset>
      </RootForm>
    )

    const fieldsetElements = document.getElementsByTagName('fieldset');

    expect(fieldsetElements.length).toBe(1);
  });
});