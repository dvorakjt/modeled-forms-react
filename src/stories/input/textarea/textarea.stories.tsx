import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../../../components2/input/textarea.component';
import { RootForm } from '../../../components2/forms/root-form.component';
import { SubmitButton } from '../../../components2/buttons/submit-button.component';
import { RootFormTemplate } from '../../../model';

const meta : Meta<typeof Textarea> = {
  component : Textarea,
  parameters : {
    layout: 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof Textarea>;

const template : RootFormTemplate = {
  fields : {
    comments : ''
  },
  submitFn : ({ value }) => new Promise((resolve) => resolve(value))
}

export const Default : Story = {
  render : () => {
    return (
      <RootForm template={template}>
        <label>Comments:</label><br />
        <Textarea fieldName='comments' />
        <br />
        <br />
        <SubmitButton onResolve={(value) => console.log(value)} onReject={(e) => console.log(e)} />
      </RootForm>
    )
  }
}