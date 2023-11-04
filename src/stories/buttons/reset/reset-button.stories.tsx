import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ResetButton } from '../../../components2/buttons/reset-button.component';
import { RootForm } from '../../../components2/forms/root-form.component';
import { Input } from '../../../components2/input/input.component';
import { FormValueDisplay } from '../../utils/form-value-display.component';
import { RootFormTemplate, Validity, email, maxDate, required } from '../../../model';
import styles from './styles.module.css';

const meta : Meta<typeof ResetButton> = {
  component : ResetButton,
  parameters : {
    layout: 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof ResetButton>;

const template : RootFormTemplate = {
  fields : {
    name : {
      defaultValue : '',
      syncValidators : [
        required('name is required')
      ]
    },
    email : {
      defaultValue : '',
      syncValidators : [
        required('email is required'),
        email('please enter a valid email address')
      ]
    },
    birthday : {
      defaultValue : '',
      syncValidators : [
        required('birthday is required'),
        maxDate(new Date(), 'birthday must be a date before today')
      ]
    }
  },
  finalizedFields : {
    age : {
      syncFinalizerFn : ({ birthday }) => {
        if(birthday.validity !== Validity.VALID_FINALIZABLE) return '';

        const ageDifMs = Date.now() - new Date(birthday.value).getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
      }
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
        <label>Email</label><br />
        <Input type='email' className={styles.input} fieldName='email' />
        <label>Birthday</label><br />
        <Input type='date' className={styles.input} fieldName='birthday'  />
        <br />
        <ResetButton />
        <FormValueDisplay />
      </RootForm>
    )
  }
}