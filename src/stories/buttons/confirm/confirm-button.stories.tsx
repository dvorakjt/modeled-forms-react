import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ConfirmButton } from '../../../components/buttons/confirm-button.component';
import { RootForm } from '../../../components/forms/root-form.component.component';
import { Input } from '../../../components/input/input.component';
import { RootFormTemplate, Validity, email, maxDate, required } from '../../../model';
import styles from './styles.module.css';
import { FormMessages } from '../../../components';

const meta : Meta<typeof ConfirmButton> = {
  component : ConfirmButton,
  parameters : {
    layout: 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof ConfirmButton>;

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

export const Default: Story = {
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
        <FormMessages idPrefix='myForm' />
        <ConfirmButton>Confirm</ConfirmButton>
      </RootForm>
    )
  }
}