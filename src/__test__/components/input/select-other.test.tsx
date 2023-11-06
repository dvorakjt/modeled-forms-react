import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RootFormTemplate } from '../../../model';
import { SelectOther, RootForm } from '../../../components';
import { renderPossiblyErrantComponent } from '../../util/components/render-possibly-errant-component';
import { MockFormContext } from '../../util/mocks/mock-form-context-provider';

describe('SelectOther', () => {
  afterEach(cleanup);

  test('It throws an error when rendered outside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<SelectOther fieldName='someField' />);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error when rendered inside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <SelectOther fieldName='someField' />
      </MockFormContext>
    );

    expect(errorDetected).toBe(false);
  });

  test('Selecting "other" causes the input to render.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteFood : {
          primaryDefaultValue : 'pizza',
          secondaryDefaultValue : ''
        }
      },
      submitFn : ({value}) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SelectOther fieldName='favoriteFood'>
          <option value='pizza'>Pizza</option>
          <option value='hamburger'>Hamburger</option>
          <option value='taco'>Taco</option>
        </SelectOther>
      </RootForm>
    );

    const select = document.getElementsByTagName('select')[0];

    await userEvent.selectOptions(select, 'other');

    await waitFor(() => {
      return expect(document.getElementsByTagName('input').length).toBe(1);
    });
  });

  test('Selecting any option except "other" causes the input to unmount.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteFood : {
          primaryDefaultValue : 'pizza',
          secondaryDefaultValue : ''
        }
      },
      submitFn : ({value}) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SelectOther fieldName='favoriteFood'>
          <option value='pizza'>Pizza</option>
          <option value='hamburger'>Hamburger</option>
          <option value='taco'>Taco</option>
        </SelectOther>
      </RootForm>
    );

    const select = document.getElementsByTagName('select')[0];

    await userEvent.selectOptions(select, 'other');

    await waitFor(() => {
      return expect(document.getElementsByTagName('input').length).toBe(1);
    });

    await userEvent.selectOptions(select, 'pizza');

    await waitFor(() => {
      return expect(document.getElementsByTagName('input').length).toBe(0);
    });
  });

  test('The input is displayed if the primaryField\'s default value is "other".', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteFood : {
          primaryDefaultValue : 'other',
          secondaryDefaultValue : ''
        }
      },
      submitFn : ({value}) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SelectOther fieldName='favoriteFood'>
          <option value='pizza'>Pizza</option>
          <option value='hamburger'>Hamburger</option>
          <option value='taco'>Taco</option>
        </SelectOther>
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];

    expect(input).toBeTruthy();
  });

  test('The input\'s value is updated when it receives input.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteFood : {
          primaryDefaultValue : 'other',
          secondaryDefaultValue : ''
        }
      },
      submitFn : ({value}) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SelectOther fieldName='favoriteFood'>
          <option value='pizza'>Pizza</option>
          <option value='hamburger'>Hamburger</option>
          <option value='taco'>Taco</option>
        </SelectOther>
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];

    await userEvent.type(input, 'ice cream');

    await waitFor(() => expect(input.value).toBe('ice cream'));
  });

  test('When labelText is passed in as a prop, the label corresponding to the select element is rendered with the provided text.', () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteFood : {
          primaryDefaultValue : 'pizza',
          secondaryDefaultValue : ''
        }
      },
      submitFn : ({value}) => new Promise((resolve) => resolve(value))
    }

    const expectedLabelText = 'Favorite Food:';

    render(
      <RootForm template={template}>
        <SelectOther fieldName='favoriteFood' labelText={expectedLabelText}>
          <option value='pizza'>Pizza</option>
          <option value='hamburger'>Hamburger</option>
          <option value='taco'>Taco</option>
        </SelectOther>
      </RootForm>
    );

    const label = screen.queryByText(expectedLabelText);
    expect(label).toBeTruthy();
  });

  test('When the select field is blurred, its data-visited attribute is set.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteFood : {
          primaryDefaultValue : 'pizza',
          secondaryDefaultValue : ''
        }
      },
      submitFn : ({value}) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SelectOther fieldName='favoriteFood' labelText='Favorite Food'>
          <option value='pizza'>Pizza</option>
          <option value='hamburger'>Hamburger</option>
          <option value='taco'>Taco</option>
        </SelectOther>
      </RootForm>
    );

    const select = document.getElementsByTagName('select')[0];

    await userEvent.click(select);

    select.blur();

    await waitFor(() => expect(select.getAttribute('data-visited')).not.toBeNull());
  });

  test('When the select field is blurred, the data-visited attribute of the corresponding label element is set.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteFood : {
          primaryDefaultValue : 'pizza',
          secondaryDefaultValue : ''
        }
      },
      submitFn : ({value}) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SelectOther fieldName='favoriteFood' labelText='Favorite Food'>
          <option value='pizza'>Pizza</option>
          <option value='hamburger'>Hamburger</option>
          <option value='taco'>Taco</option>
        </SelectOther>
      </RootForm>
    );

    const select = document.getElementsByTagName('select')[0];

    await userEvent.click(select);

    select.blur();

    const label = document.getElementsByTagName('label')[0];

    await waitFor(() => expect(label.getAttribute('data-visited')).not.toBeNull());
  });

  
  test('When the input element is blurred, its data-visited attribute is set.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteFood : {
          primaryDefaultValue : 'other',
          secondaryDefaultValue : ''
        }
      },
      submitFn : ({value}) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SelectOther fieldName='favoriteFood' labelText='Favorite Food'>
          <option value='pizza'>Pizza</option>
          <option value='hamburger'>Hamburger</option>
          <option value='taco'>Taco</option>
        </SelectOther>
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];

    await userEvent.click(input);

    input.blur();

    await waitFor(() => expect(input.getAttribute('data-visited')).not.toBeNull());
  });

  test('When the input element is blurred, the data-visited attribute of the corresponding label element is set.', async () => {
    const template : RootFormTemplate = {
      fields : {
        favoriteFood : {
          primaryDefaultValue : 'other',
          secondaryDefaultValue : ''
        }
      },
      submitFn : ({value}) => new Promise((resolve) => resolve(value))
    }

    render(
      <RootForm template={template}>
        <SelectOther fieldName='favoriteFood' labelText='Favorite Food'>
          <option value='pizza'>Pizza</option>
          <option value='hamburger'>Hamburger</option>
          <option value='taco'>Taco</option>
        </SelectOther>
      </RootForm>
    );

    const input = document.getElementsByTagName('input')[0];

    await userEvent.click(input);

    input.blur();

    const label = document.getElementsByTagName('label')[1];

    await waitFor(() => expect(label.getAttribute('data-visited')).not.toBeNull());
  });
});