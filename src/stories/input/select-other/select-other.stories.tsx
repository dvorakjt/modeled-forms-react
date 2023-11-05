import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { SelectOther } from '../../../components2/input/select-other.component';
import { RootForm } from '../../../components2/forms/root-form.component.component';
import { RootFormTemplate, required } from '../../../model';
import styles from './styles.module.css';
import { FormValueDisplay } from '../../utils/form-value-display.component';

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
      <SelectOther 
        fieldName='politicalParty' 
        labelText='Political Party'
        selectProps={{
          labelClassName : styles.label,
          selectClassName : styles.select
        }}
        inputProps={{
          labelClassName : styles.label,
          inputClassName : styles.input
        }}
      >
        <option value=''></option>
        <option value='democratic'>Democratic</option>
        <option value='republican'>Republican</option>
        <option value='libertarian'>Libertarian</option>
        <option value='green'>Green</option>
      </SelectOther>
      <br />
      <br />
      <FormValueDisplay />
    </RootForm>
    );
  }
}