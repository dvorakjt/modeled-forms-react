import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../../components2/input/input.component';
import { RootFormProvider } from '../../../components2/context-providers/root-form-provider.component';
import { SubmitButton } from '../../../components2/buttons/submit-button.component';
import { RootFormTemplate } from '../../../model';
import { required } from '../../../model';
import styles from './styles.module.css';

const meta : Meta<typeof Input> = {
  component : Input,
  parameters : {
    layout: 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof Input>;

const template : RootFormTemplate = {
  fields : {
    name : {
      defaultValue : '',
      syncValidators : [
        required('name is required')
      ]
    }
  },
  submitFn : ({ value }) => new Promise((resolve) => resolve(value))
}

export const Default : Story = {
  render : () => {
    return (
      <RootFormProvider template={template}>
        <label>Name</label><br />
        <Input type='text' className={styles.input} fieldName='name' />
        <br />
        <br />
        <SubmitButton onResolve={(value) => console.log(value)} onReject={(e) => console.log(e)} />
      </RootFormProvider>
    )
  }
}