import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { SelectOther } from '../../../components2/input/select-other.component';
import { RootForm } from '../../../components2/forms/root-form.component';
import { SubmitButton } from '../../../components2/buttons/submit-button.component';
import { RootFormTemplate, required } from '../../../model';
import styles from './styles.module.css';

const meta : Meta<typeof SelectOther> = {
  component : SelectOther,
  parameters : {
    layout : 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof SelectOther>;

const template : RootFormTemplate = {
  fields : {
    politicalParty : {
      primaryDefaultValue : '',
      secondaryDefaultValue : '',
      syncValidators : [
        required('Please enter a political party.')
      ]
    }
  },
  submitFn : ({ value }) => new Promise((resolve) => resolve(value))
}

export const Default : Story = {
  render : () => {
    return (
    <RootForm template={template}>
      <SelectOther fieldName='politicalParty' label='Political Party' className={styles.select_other}>
        <option value=''></option>
        <option value='democratic'>Democratic</option>
        <option value='republican'>Republican</option>
        <option value='libertarian'>Libertarian</option>
        <option value='green'>Green</option>
      </SelectOther>
      <br />
      <br />
      <SubmitButton onResolve={(value) => console.log(value)} onReject={(e) => console.log(e)} />
    </RootForm>
    );
  }
}