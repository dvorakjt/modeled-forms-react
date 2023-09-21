import React from "react";
import { RootFormProvider } from "../components/root-form-provider.component";
import { template } from "./form.template";
import styles from './styles.module.css';
import { InputGroup } from "../components/input-group.component";
import { NestedFormProvider } from "../components/nested-form-provider.component";

export function Form() {
  return <RootFormProvider template={template}>
    <InputGroup fieldName="firstName" labelText="First Name" inputType="text" inputGroupClassName={styles.inputGroup} inputClassName={styles.input} />
    <InputGroup fieldName="lastName" labelText="Last Name" inputType="text" inputGroupClassName={styles.inputGroup} inputClassName={styles.input} />
    <InputGroup fieldName="emailAddr" labelText="Email" inputType="email" inputGroupClassName={styles.inputGroup} inputClassName={styles.input} />
    <InputGroup fieldName="password" labelText="Password" inputType="password" inputGroupClassName={styles.inputGroup} inputClassName={styles.input} />
    <NestedFormProvider fieldName="ageInformation">
      <InputGroup fieldName="birthday" labelText="Birthday" inputType="date" inputGroupClassName={styles.inputGroup} inputClassName={styles.input} />
      <InputGroup fieldName="age" labelText="Age" inputType="text" inputGroupClassName={styles.inputGroup} inputClassName={styles.input} readOnly />
    </NestedFormProvider>
  </RootFormProvider>
}