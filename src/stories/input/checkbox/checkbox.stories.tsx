import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { CheckboxInput } from '../../../components/input/checkbox-input.component';
import { RootForm } from '../../../components/forms/root-form.component.component';
import { RootFormTemplate } from '../../../model';
import { FormValueDisplay } from '../../utils/form-value-display.component';

const meta : Meta<typeof CheckboxInput> = {
  component : CheckboxInput,
  parameters : {
    layout: 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof CheckboxInput>;

const template : RootFormTemplate = {
  fields : {
    isDeveloper : ''
  },
  submitFn : ({ value }) => new Promise((resolve) => resolve(value))
}

export const Default : Story = {
  render : () => {
    return (
      <RootForm template={template}>
        <CheckboxInput fieldName='isDeveloper' value='true' labelText='I am a developer' />
        <FormValueDisplay />
      </RootForm>
    )
  }
}