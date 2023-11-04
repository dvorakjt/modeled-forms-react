import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { RadioInput } from '../../../components2/input/radio-input.component';
import { RootForm } from '../../../components2/forms/root-form.component';
import { SubmitButton } from '../../../components2/buttons/submit-button.component';
import { RootFormTemplate } from '../../../model';

const meta : Meta<typeof RadioInput> = {
  component : RadioInput,
  parameters : {
    layout: 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof RadioInput>;

const template : RootFormTemplate = {
  fields : {
    favoriteFood : 'pizza'
  },
  submitFn : ({ value }) => new Promise((resolve) => resolve(value))
}

export const Default : Story = {
  render : () => {
    return (
      <RootForm template={template}>
        <RadioInput fieldName='favoriteFood' value='pizza' labelText='Pizza' /><br />
        <RadioInput fieldName='favoriteFood' value='hamburger' labelText='Hamburger' /><br />
        <RadioInput fieldName='favoriteFood' value='taco' labelText='Taco' /><br />
        <SubmitButton onResolve={(value) => console.log(value)} onReject={(e) => console.log(e)} />
      </RootForm>
    )
  }
}