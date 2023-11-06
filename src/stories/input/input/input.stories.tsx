import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../../components/input/input.component';
import { RootForm } from '../../../components/forms/root-form.component.component';
import { RootFormTemplate } from '../../../model';
import { required } from '../../../model';
import styles from './styles.module.css';
import { FormValueDisplay } from '../../utils/form-value-display.component';

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
      <RootForm template={template}>
        <label>Name</label><br />
        <Input type='text' className={styles.input} fieldName='name' />
        <br />
        <br />
        <FormValueDisplay />
      </RootForm>
    )
  }
}