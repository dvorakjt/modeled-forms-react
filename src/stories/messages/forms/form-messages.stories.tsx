import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FormMessages } from '../../../components2/messages/form-messages.component';
import { Input } from '../../../components2/input/input.component';
import { RootForm } from '../../../components2/forms/root-form.component.component';
import { RootFormTemplate } from '../../../model';
import { required } from '../../../model';
import styles from './styles.module.css';

const meta : Meta<typeof FormMessages> = {
  component : FormMessages,
  parameters : {
    layout: 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof FormMessages>;

const template : RootFormTemplate = {
  fields : {
    password : {
      defaultValue : '',
      syncValidators : [
        required('password is required')
      ]
    },
    confirmPassword : {
      defaultValue : '',
      syncValidators : [
        required('please confirm your password')
      ]
    }
  },
  multiFieldValidators : {
    sync : [
      ({ password, confirmPassword }) => {
        const isValid = password.value === confirmPassword.value;

        return {
          isValid,
          message : isValid ? 'The passwords match!' : 'The passwords do not match.'
        }
      }
    ]
  },
  submitFn : ({ value }) => new Promise((resolve) => resolve(value))
}

export const Default : Story = {
  render : () => {
    return (
      <RootForm template={template} id='myForm'>
        <label>Password</label>
        <br />
        <Input type='password' className={styles.input} fieldName='password' />
        <br />
        <label>Confirm Password</label>
        <br />
        <Input type='password' className={styles.input} fieldName='confirmPassword' />
        <br />
        <FormMessages idPrefix='myForm' containerClassName={styles.field_messages} messageClassName={styles.field_message} />
      </RootForm>
    )
  }
}