import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FieldMessages } from '../../../components/messages/field-messages.component';
import { Input } from '../../../components/input/input.component';
import { RootForm } from '../../../components/forms/root-form.component.component';
import { RootFormTemplate, email } from '../../../model';
import { required } from '../../../model';
import styles from './styles.module.css';

const meta : Meta<typeof FieldMessages> = {
  component : FieldMessages,
  parameters : {
    layout: 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof FieldMessages>;

const template : RootFormTemplate = {
  fields : {
    email : {
      defaultValue : '',
      syncValidators : [
        required('Email is required.'),
        email('Please enter a valid email address.', 'Email address is valid!')
      ]
    }
  },
  submitFn : ({ value }) => new Promise((resolve) => resolve(value))
}

export const Default : Story = {
  render : () => {
    return (
      <RootForm template={template}>
        <label>Email:</label>
        <br />
        <Input type='text' className={styles.input} fieldName='email' />
        <br />
        <FieldMessages fieldName='email' containerClassName={styles.field_messages} messageClassName={styles.field_message} />
      </RootForm>
    )
  }
}