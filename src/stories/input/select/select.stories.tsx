import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Select } from '../../../components2/input/select.component';
import { RootForm } from '../../../components2/forms/root-form.component';
import { SubmitButton } from '../../../components2/buttons/submit-button.component';
import { RootFormTemplate } from '../../../model';

const meta : Meta<typeof Select> = {
  component : Select,
  parameters : {
    layout : 'centered'
  }
}

export default meta;

type Story = StoryObj<typeof Select>;

const template : RootFormTemplate = {
  fields : {
    favIceCreamFlavor : {
      defaultValue : 'chocolate'
    }
  },
  submitFn : ({ value }) => new Promise((resolve) => resolve(value))
}

export const Default : Story = {
  render : () => {
    return (
    <RootForm template={template}>
      <label>Favorite Ice Cream Flavor:</label><br />
      <Select fieldName='favIceCreamFlavor'>
        <option value='chocolate'>Chocolate</option>
        <option value='vanilla'>Vanilla</option>
        <option value='strawberry'>Strawberry</option>
        <option value='pistachio'>Pistachio</option>
      </Select>
      <br />
      <br />
      <SubmitButton onResolve={(value) => console.log(value)} onReject={(e) => console.log(e)} />
    </RootForm>
    );
  }
}