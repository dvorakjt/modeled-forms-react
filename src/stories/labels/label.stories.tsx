import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Label } from '../../components2/labels/label.component';
import { Input } from '../../components2/input/input.component';
import { RootForm } from '../../components2/forms/root-form.component.component';
import { RootFormTemplate } from '../../model';
import { required } from '../../model';
import styles from './styles.module.css';

const meta : Meta<typeof Label> = {
  component : Label,
  parameters : {
    layout: 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof Label>;

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
        <Label fieldName='name' className={styles.label}>Name:</Label>
        <br />
        <Input type='text' className={styles.input} fieldName='name' />
      </RootForm>
    )
  }
}