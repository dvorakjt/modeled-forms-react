# Modeled Forms React
Powerful MVC-inspired form management for React with declarative syntax and visually unopinionated, fully customizable components.

## Table of Contents
[About](#about)  
[Installation](#installation)  
[Getting Started](#getting-started)  
[Templates](#templates)  
[Validators](#validators)  
[Controlled Fields](#controlled-fields)  
[Multi-Field Validators](#multi-field-validators)  
[Finalized Fields](#finalized-fields)  
[Extracted Values](#extracted-values)  
[Components](#components)  
[Accessibility](#accessibility)  
[Hooks](#hooks)  
[First Non-Valid Form Element](#first-non-valid-form-element)  
[Confirmation](#confirmation)  
[Submission](#submission)  
[Usage With Next.js App Router](#usage-with-next.js-app-router)  
[Configuration](#configuration)  
[Contributing](#contributing)  
[Issues](#issues)  
[License](#license)  

## About
Modeled Forms React provides powerful, MVC-inspired form state management for React-based applications. 

The basic premise is that the developer creates a template which defines the structure of the form data (fields, validators, nested forms, multi-field validators), the structure of the data to be submitted to the backend (finalized fields), and the structure of any data that should be created for consumption by the frontend based on form data, but not submitted to the backend (extracted values)--i.e. the model.

This template is then passed into a special component which creates the necessary classes to realize the model. As the value of fields are modified, their validity is modified simultaneously. Finalized fields are also modified in response to changes in field's data. Therefore, once defined, you can always rely on the structure of your form data to correspond precisely to the description you provide in your template.

Hooks are then used behind the scenes to provide stateful representations of this data to components.  Components such as RootForm, RootFormProvider, NestedFormProvider and others provide stateful representation of your form data to other components, and components such as Input, RadioInput, ResetButton and others read from and update this data. 

Therefore, as the developer you are only responsible for defining the structure of your data, and, in a separate place, the visual structure and styles applied to your form.

## Installation

To install Modeled Forms React, run the following command within a React-based project. React 18 or higher is required.

    npm i modeled-forms-react

## Getting Started

***Note:** If you are using the App Router in Next.js 13, please see [Usage With Next.js App Router](#usage-with-next.js-app-router) for an additional step that must be taken for compatibility with server components.*

First we need to define a RootFormTemplate. Note that for this example, we'll be using typescript. We'll start with something very simple. Let's begin by importing the `RootFormTemplate` type from `modeled-forms-react`.

    // form-templates/my-first-form-template.ts
    import type { RootFormTemplate } from 'modeled-forms-react';
Next, let's define an enum representing the form field names. Strictly speaking, this step is not necessary, but it will make our lives easier when we define the components representing the form's fields. Note that a plain JavaScript object would work just as well.

    // form-templates/my-first-form-template.ts
    import type { RootFormTemplate } from 'modeled-forms-react';
     
    export enum MyFirstFormFields {
	  firstName = 'firstName',
	  middleName = 'middleName',
	  lastName = 'lastName'
    }
Next, let's create a simple RootFormTemplate:

    // form-templates/my-first-form-template.ts
    import type { RootFormTemplate } from 'modeled-forms-react';
     
    export enum MyFirstFormFields {
	  firstName = 'firstName',
	  middleName = 'middleName',
	  lastName = 'lastName'
    }
	 
	export const myFirstFormTemplate : RootFormTemplate = {
	  fields : {
	    [MyFirstFormFields.firstName] : '',
	    [MyFirstFormFields.middleName] : '',
	    [MyFirstFormFields.lastName] : ''
	  },
	  submitFn : ({ value }) => new Promise(resolve => resolve(value))
	} 
   
Let's examine the code we just wrote.  The `fields` property of the template determines the fields that will be created for our components to consume. To create a very simple field with no validators or other features, simply add the field's name as a property to the `fields` object, assigning it a string representing the field\'s default value. Note that the fields property can be an object, as above, or a `Map` with keys of type string and values of `NestedForm | FieldTemplateVariations.` We'll see the rationale behind using a `Map` later, but for now we'll stick to using an object for simplicity.

The other property that is required in a `RootFormTemplate` is `submitFn`. There are three things that are important to note here. First, the `submitFn` must return a promise. Second, if the promise is rejected with an instance of `Error`, the message property of the error will be included in the form's messages. You can use this to control the error message your form displays should the fields all be valid but submission fails. Third, the object passed in as an argument to the submit function will represent the form's state. Therefore, you can destructure such properties as `value`, which we've done here, and submit them to your backend.

Despite not declaring any validators or really using very many features of the library yet at all, this form already provides us with some utility. By default, all fields are trimmed before finalized (and before validated if validators are present). Thus, you don't have to worry about trimming any of these fields' values prior to submission. (This behavior can be turned off, of course. See [Configuration](#configuration).)

 Next, we need to create some components that allow users to view and interact with this data.

Let's create component! First, we'll import the enum and template we just defined, as well as the `RootForm` component from `modeled-forms-react`.

    // components/my-first-form.tsx
    import { RootForm } from 'modeled-forms-react';
    import { 
      MyFirstFormFields, 
      myFirstFormTemplate 
    } from '@/form-templates/my-first-form-template';

Now, let's create a component that returns a RootForm that receives our template as a prop. 

***Note:** if using Next.js App Router, you should add the 'use client' directive to the top of this file.*

    // components/my-first-form.tsx
    import { RootForm } from 'modeled-forms-react';
    import { 
      MyFirstFormFields, 
      myFirstFormTemplate 
    } from '@/form-templates/my-first-form-template';
     
    export function MyFirstForm() {
	  return (
	    <RootForm template={myFirstFormTemplate}></RootForm>
	  );
    }
This doesn't do too much yet. We need to add some inputs and labels. Let's import those from `modeled-forms-react` and add them to the component.

    // components/my-first-form.tsx
    import { RootForm, Label, Input } from 'modeled-forms-react';
    import { 
      MyFirstFormFields, 
      myFirstFormTemplate 
    } from '@/form-templates/my-first-form-template';
     
    export function MyFirstForm() {
	  return (
	    <RootForm template={myFirstFormTemplate}>
		  <Label fieldName={MyFirstFormFields.firstName}>First Name</Label>
		  <Input type='text' fieldName={MyFirstFormFields.firstName} />
		  
		  <Label fieldName={MyFirstFormFields.middleName}>Middle Name</Label>
		  <Input type='text' fieldName={MyFirstFormFields.middleName} />
		  
		  <Label fieldName={MyFirstFormFields.lastName}>Last Name</Label>
		  <Input type='text' fieldName={MyFirstFormFields.lastName} />
		</RootForm>
	  );
    }

We can also add a SubmitButton which we can instruct to log the form's value when the promise we created in our submit function resolves, and ResetButton which will reset the form's state.

    // components/my-first-form.tsx
    import { 
      RootForm,
      Label, 
      Input,
      SubmitButton,
      ResetButton 
    } from 'modeled-forms-react';
    
    import { 
      MyFirstFormFields, 
      myFirstFormTemplate 
    } from '@/form-templates/my-first-form-template';
     
    export function MyFirstForm() {
	  return (
	    <RootForm template={myFirstFormTemplate}>
		  <Label fieldName={MyFirstFormFields.firstName}>First Name</Label>
		  <Input type='text' fieldName={MyFirstFormFields.firstName} />
		  
		  <Label fieldName={MyFirstFormFields.middleName}>Middle Name</Label>
		  <Input type='text' fieldName={MyFirstFormFields.middleName} />
		  
		  <Label fieldName={MyFirstFormFields.lastName}>Last Name</Label>
		  <Input type='text' fieldName={MyFirstFormFields.lastName} />

		  <SubmitButton onSuccess={(value) => console.log(value)} />
		  <ResetButton />
		</RootForm>
	  );
    }
You will notice that these components are completely unstyled. To change that, we can add css classes or styles to each component via their `className` or `style` props. We'll use css modules for this example.

    //components/my-first-form.module.css
    .form {
      /* add styles for your form here.*/
    }
    
    .label {
      /* add styles for your labels here */
    } 
    
    .input {
	  /* add styles for your input here */
    }
     
    .button {
      /* add styles for your button here */
    }

Now let's import this file and apply the classes we've created.

    // components/my-first-form.tsx
    import { 
      RootForm,
      Label, 
      Input,
      SubmitButton,
      ResetButton 
    } from 'modeled-forms-react';
    
    import { 
      MyFirstFormFields, 
      myFirstFormTemplate 
    } from '@/form-templates/my-first-form-template';

	import styles from './my-first-form.module.css';
     
    export function MyFirstForm() {
	  return (
	    <RootForm template={myFirstFormTemplate} className={styles.form}>
		  <Label 
		    fieldName={MyFirstFormFields.firstName}
		    className={styles.label}
		  >
		    First Name
		  </Label>
		  <Input 
		    type='text' 
		    fieldName={MyFirstFormFields.firstName}
		    className={styles.input} 
		  />
		  
		  <Label 
		    fieldName={MyFirstFormFields.middleName}
		    className={styles.label}
		  >
		    Middle Name
		  </Label>
		  <Input 
		    type='text' 
		    fieldName={MyFirstFormFields.middleName}
		    className={styles.input}
		  />
		  
		  <Label 
		    fieldName={MyFirstFormFields.lastName}
		    className={styles.label}
		  >
		    Last Name
		  </Label>
		  <Input 
		    type='text' 
		    fieldName={MyFirstFormFields.lastName} 
		    className={styles.input}
		  />

		  <SubmitButton 
		    onSuccess={(value) => console.log(value)} 
		    className={styles.button}
		  />
		  <ResetButton className={styles.button} />
		</RootForm>
	  );
    }

Of course, for a large project which will use the same styles for each element throughout, you could create custom components which return Modeled Forms React components with your styles/classes already applied. This will make your code simpler, easier to understand and less repetitive.

Now let's add some validation. Out of the three fields we create, let's say we want firstName and lastName to be required. Let's go back into our template and import `required`, one of the many built in validators, from `modeled-forms-react.`We'll then modify the field templates for firstName and lastName.

    // form-templates/my-first-form-template.ts
    import { type RootFormTemplate, required } from 'modeled-forms-react';
     
    export enum MyFirstFormFields {
	  firstName = 'firstName',
	  middleName = 'middleName',
	  lastName = 'lastName'
    }
	 
	export const myFirstFormTemplate : RootFormTemplate = {
	  fields : {
	    [MyFirstFormFields.firstName] : {
	      defaultValue : '',
	      syncValidators : [
	        required('Please enter your first name.')
	      ]
	    },
	    [MyFirstFormFields.middleName] : '',
	    [MyFirstFormFields.lastName] : {
	      defaultValue : '',
	      syncValidators : [
	        required('Please enter your last name.')
	      ]
	    }
	  },
	  submitFn : ({ value }) => new Promise(resolve => resolve(value))
	} 

firstName and lastName will now be considered invalid unless their values are not empty strings. Remember, by default, their values will be trimmed for validation, meaning that a value consisting of all whitespace characters will not satisfy this `required` validator. `required` is just one of many built-in validators that you have access to with Modeled Forms React. Further, you can define your own validators, and you can even add asynchronous validators as well.

A few things will happen because of this validator. First, besides setting the validity of the field, it will simultaneously add a message to the array of messages maintained in its state property. The message will be the string we passed as an argument to required. If we passed a second string to required, that message would be included when the field is valid. These messages can be displayed with a `FieldMessages` component.

Additionally, any components (such as a `Label` or `Input`) associated with this field will receive a `data-validity="INVALID"` attribute, assuming the field has been visited (clicked/tabbed to then blurred) or modified, or the form was confirmed/submitted. Labels, Inputs, etc. will also have a `data-visited` attribute if they have been visited and a `data-modified` attribute if they have been modified. Other possible values for `data-validity` are `ERROR`, `PENDING` and `VALID`. Before a field is visited/modified or the form is confirmed/submitted, `data-validity` defaults to `VALID`.

You can take advantage of this to style your components. For example:

    .input[data-validity="INVALID"] {
	    /* add styles for an invalid input here */
    }

Let's add some messages components to the MyFirstForm component to display messages returned by the validators we added.

First, let's add some classes to our css module which we can use to style the messages component.

    //components/my-first-form.module.css
    .form {
      /* add styles for your form here.*/
    }
    
    .label {
      /* add styles for your labels here */
    } 
    
    .input {
	  /* add styles for your input here */
    }

	.input[data-validity="INVALID"] {
	  /* add styles for invalid input here */
	}
     
    .button {
      /* add styles for your button here */
    }
	
	.messages_container {
	  /* style the container that wraps messages. */
	}
	 
	.message {
	  /* style each message */
	}
	 
	.message[data-validity="INVALID"] {
	  /* style invalid messages */
	}

Now, we can add some `FieldMessages`  components and a `FormMessages` component to our form component! We'll also add an `id` propto the form so we can pass that into the `idPrefix` prop of the `FormMessages` component.

    // components/my-first-form.tsx
    import { 
      RootForm,
      Label, 
      Input,
      SubmitButton,
      ResetButton,
      FieldMessages,
      FormMessages 
    } from 'modeled-forms-react';
    
    import { 
      MyFirstFormFields, 
      myFirstFormTemplate 
    } from '@/form-templates/my-first-form-template';

	import styles from './my-first-form.module.css';
     
    export function MyFirstForm() {
	  return (
	    <RootForm 
	      template={myFirstFormTemplate} 
	      className={styles.form}
	      id='my-first-form'
	    >
		  <Label 
		    fieldName={MyFirstFormFields.firstName}
		    className={styles.label}
		  >
		    First Name
		  </Label>
		  <Input 
		    type='text' 
		    fieldName={MyFirstFormFields.firstName}
		    className={styles.input} 
		  />
		  <FieldMessages
		    fieldName={MyFirstFormFields.firstName}
		    containerClassName={styles.messages_container}
		    messageClassName={styles.message}
		  />
		  
		  <Label 
		    fieldName={MyFirstFormFields.middleName}
		    className={styles.label}
		  >
		    Middle Name
		  </Label>
		  <Input 
		    type='text' 
		    fieldName={MyFirstFormFields.middleName}
		    className={styles.input}
		  />
		  <FieldMessages
		    fieldName={MyFirstFormFields.firstName}
		    containerClassName={styles.messages_container}
		    messageClassName={styles.message}
		  />
		  
		  <Label 
		    fieldName={MyFirstFormFields.lastName}
		    className={styles.label}
		  >
		    Last Name
		  </Label>
		  <Input 
		    type='text' 
		    fieldName={MyFirstFormFields.lastName} 
		    className={styles.input}
		  />
		  <FieldMessages
		    fieldName={MyFirstFormFields.firstName}
		    containerClassName={styles.messages_container}
		    messageClassName={styles.message}
		  />
			
		  <FormMessages 
		    containerClassName={styles.messages_container}
		    messageClassName={styles.message}
		    idPrefix='my-first-form'
		  />
		  
		  <SubmitButton 
		    onSuccess={(value) => console.log(value)} 
		    className={styles.button}
		  />
		  <ResetButton className={styles.button} />
		</RootForm>
	  );
    }
Congratulations, you've created your first form with Modeled Forms React!

## Templates

The `RootFormTemplate` has two required properties: `fields` and `submitFn`.

`fields` is of type `FormElementTemplateDictionaryOrMap`, which is an alias for `Record<string, FieldOrNestedFormTemplate>`.

The keys of this object/Map represent the names of each field, and the template provided defines the structure of the field.

The simplest value one can assign to a `FieldOrNestedFormTemplate` is simply a string representing the default value of a field. The field will be created without any validators or control functions, and will not be omitted by default.

To invoke other options for configuring a field, an object can be provided. To create a simple field, a `defaultValue` property of type string is required on this object. Other properties that can be provided are:

 - `syncValidators` - an array of synchronously executing validators. You can import these from `modeled-forms-react` (technically, what is exported are functions that create validators with the messages and options you pass in, for example the `required` function we used earlier), or you can create your own.
 - `asyncValidators` - an array of asynchronously executing validators. No async validators are exported from this library, but you can define your own. See [Validators](#validators) for more information.
 - `pendingAsyncValidatorMessage` - the message that displays as asyncValidators are running. 
 - `omitByDefault` - determines if the field is omitted by default. Omitted fields are not included in the finalized template, neither are finalizedFields derived from omitted fields and non-omitted fields. Omitted fields do not count towards form validity and multi-field validators which include an omitted field are ignored. Any field or nested form's `omit` property may be toggled later on with a special hook regardless of whether or not `omitByDefault` is included or whether it is set to true or false.

A field template may also represent a `DualField`. This is a special type of field which internally contains two separate fields. Its state as far as other fields are concerned may be toggled back and forth between the states of these two internal fields, but the internal fields each maintain their own unique state. This type of field is used to create the `SelectOther` component, which allows the user to choose from several predefined options, or enter their own value if they don't see a value that best represents their intended input within the predefined options in the dropdown. This template type is identical to the FieldTemplate, with the exception that instead of providing a `defaultValue` property, you must provide both a `primaryDefaultValue` property and a `secondaryDefaultValue` property, both of type string.

Fields may also be controlled fields. Controlled fields are special field's whose value changes automatically depending on the value of another field. An example could be deriving the user's state from their zip code.

Controlled fields are quite easy to declare, and come in a few varieties. First, they may be either state-controlled or value-controlled. With a state controlled field, the fields entire state (value, validity, messages, etc.) can be controlled by the value of another field OR fields. Value-controlled fields are bit simpler--only their value is controlled by another field or fields. 

Second, controlled fields can be controlled synchronously or asynchronously. Synchronous, value-controlled fields are recommended  for most controlled fields. 

Controlled fields are declared by adding a control function to a `Field` or `DualField` template. Only one control function is allowed per field, but multiple fields may be accessed by this control function. The following properties can be included in a `Field` or `DualField` template to add a control function to that field.

     - syncValueControlFn
     - syncStateControlFn
     - asyncValueControlFn
     - asyncStateControlFn
For more information, see [Controlled Fields](#controlled-fields).

The `fields` property of a RootFormTemplate may also included a `NestedFormTemplate`. Here is a very simple example:

    const rootFormTemplate : RootFormTemplate = {
      fields : {
        myNestedForm : {
          fields : {
            someField : ''
          }
        }
      },
      submitFn : ({value}) => new Promise(resolve => resolve(value))
    }
A `NestedFormTemplate` may in turn include its own `NestedFormTemplate`(s), which in turn may include still more nested forms, and so on and so on. A nested form is useful when you want to separate a very long form into several pages, define a fieldset, etc. A `NestedFormTemplate` requires only a `fields` property, and should NOT include a `submitFn`. A `NestedFormTemplate` may include an `omitByDefault` property, which yields the same result as the eponymous property in a field template. The other properties available to a `NestedFormTemplate`are identical to those available to a `RootFormTemplate`, so we will henceforth resume discussion of `RootFormTemplate` properties.

Form templates may also include a `multiFieldValidators` property. This property describes special validators that evaluate the values of several fields together, provided those fields are all individually valid. Synchronously executing multi-field validators are added in the `sync` property of the multiFieldValidators property, and asynchronously executing multi-field validators are added to the `async` property of the multiFieldValidators property. For more information, see [Validators](#validators).

Form templates may also include a `finalizedFields` property. Normally, each field receives a default finalizer, which simply adds that field's key and value as a key-value pair within the form's value. However, by defining custom finalizers, you can create new values within your forms value based on the state(s) of one or more fields. You also have control over whether the fields from which they are derived are included in the form's value (by default, adding a custom finalizer removes the original fields from the form's value, but this behavior can be turned off). Like many other custom functions provided to the template, finalizers may either be synchronous or asynchronous. For more information, see [Finalized Fields](#finalized-fields).

A form template may include an `extractedValues` property. Extracted values allow you to define a value which is derived from the state of a field or fields within your form. This value will not be included in the form's value and can be any type of value you want. This allows you to add information derived from your form to your UI without needing to interfere with the actual value of your form. The `extractedValues` property may include `syncExtractedValues` and/or `asyncExtractedValues` keys, whose values are of type`Record<string, SyncExtractedValueFn>` and `Record<string, AsyncExtractedValueFn>`, respectively.

 A real-life use case could be a message to a user in a voter registration form which reflects their eligibility to register depending on their age and US state. For more information, see [Extracted Values](#extracted-values).

Finally, a RootFormTemplate must include a `submitFn`. This property should be a function that destructures a State object, and returns a promise.

State for a `RootForm` includes the following properties:

 - `value` - the current value of the form, typically an object whose keys represent the fields of the form and whose values represent the values of those fields
 - `validity` - the current validity of the form. Validity is an enum with values ERROR, INVALID, PENDING, VALID_UNFINALIZABLE, VALID_FINALIZABLE. These values correspond to ascending integers, allowing you to compare validities with comparison operators. 
	 - Validity.ERROR is typically only encountered should an unexpected error occur.
	 - Validity.INVALID means that a field has validators that returned an invalid result, or that a form contains INVALID fields.
	 - Validity.PENDING means an asynchronous validator is running.
	 - Validity.VALID_UNFINALIZABLE means that all of the form's fields are valid, but an asynchronous finalizer is still finishing its task of preparing a finalized field, so the forms value is not ready to be finalized by an outer form's finalizers. This Validity state will only be encountered should you define asynchrous finalizers.
	 - Validity.VALID_FINALIZABLE means that all of the form's fields are valid and its value has been fully prepared by finalizers.
 - `messages`- an array of `Message`. A `Message`includes properties `text` and `type`. These are the messages returned by Validators.
 - `visited` - visited can be `Visited.NO`, `Visited.YES` or `Visited.PARTIALLY`.
 - `modified` - modified can be `Modified.NO`, `Modified.YES,` or `Modified.PARTIALLY`

State for nested forms and fields adds an `omit`  property, and state for dual fields adds a `useSecondaryField` property. These are both booleans and represent whether the element is currently omitted, and whether or not it is currently projecting its secondary field's state, respectively. The value property for `FieldState` must be a string, but for forms it will be an object whose shape is defined by the form's finalizers.

For your `submitFn`, it is likely that you will only care about destructuring the `value` property from `State`. Prior to calling the submitFn, the form will perform a step known as confirmation. If its validity is less than `Validity.VALID_FINALIZABLE`, the `submitFn` will not be called, and instead an error message will be displayed by the `FormMessages` component. `FieldMessages` components will also immediately display any error messages which are normally hidden until the corresponding field is visited or modified or the confirmation step is attempted, and labels, inputs etc. will have their true validity assigned to their `data-validity` attribute. This gives your users the opportunity to at least visit each field before a bunch of error messages appear but ensures that if they don't visit any fields, the error messages will appear when they try to submit the invalid form.


## Validators

***Note:** Validators come in two varieties: single-field validators which are added to each field template, and multi-field validators which are added to the `multiFieldValidators` property of a form template. In this section, we will discuss single-field validators. For multi-field validators, see [Multi-Field Validators](#multi-field-validators).* 

A validator is essentially a function that takes in a string and returns a `ValidatorResult` object after performing some computations on that string. Asynchronous validators are almost identical, except that they return a `Promise<ValidatorResult>`.

The `ValidatorResult` type must include an `isValid` property of type boolean, and can optionally include a `message` of type string. This is useful for when you want to return a message if the field is invalid, but not if the field is valid. Note that asynchronous validators should not call `reject()` inside their promise, but should resolve with an object that includes an `isValid` property set to `false` should their criteria for validity be unmet.

This project comes with many built-in "validators." Really, these are functions that return a sync validator, customized with messages you provide.

The available built-in validators are:
 - `required()`
 - `email()`
 - `inDateRange()`
 - `inLengthRange()`
 - `inNumRange()`
 - `includesDigit()`
 - `includesLower()`
 - `includesSymbol()`
 - `includesUpper()`
 - `maxDate()`
 - `maxLength()`
 - `maxNum()`
 - `minDate()`
 - `minLength()`
 - `minNum()`
 - `pattern()`

Let's look the `includesLower()` validator to see how these validators work and what they return. This is the definition for `includesLower()`:

    import { container } from '../../container';
    import type { SyncValidator } from '../sync-validator.type';
    import type { ValidatorResult } from '../validator-result.interface';
    
    const autoTransformer = container.services.AutoTransformer;
    
    export function includesLower(
      errorMessage: string,
      successMessage?: string,
    ): SyncValidator<string> {
      return (value: string) => {
        value = autoTransformer.transform(value);
        
        const result: ValidatorResult = {
          isValid: /[a-z]/.test(value),
        };
        if (!result.isValid) {
          result.message = errorMessage;
        } else if (successMessage) {
          result.message = successMessage;
        }

        return result;
      };
    }

The function returned by this built-in "validator" is the real validator. This function first uses the autoTransformer class to apply any transformations (currently, only trimming is available) defined in the config file to the value. This ensures that the value being tested is the same as the value that finalizers will receive. 

A regular expression is then used to evaluate if the field contains a lowercase letter. If not, `isValid` is false, and  `message` is set to the error message passed into the outer function. Otherwise, `isValid` is true, and if a `successMessage` was passed into the outer function, that is set as the `message` on the `ValidatorResult` object. Finally, this object is returned.

Therefore, to define your own custom validator, all you need to do is create a function that takes in a string and results either a `ValidatorResult` or a `Promise<ValidatorResult>`. You can then add this function to either the `syncValidators` or `asyncValidators` (respectively) arrays of a field template.

In terms of behavior, all `syncValidators` are run first. Their messages are all collected and set as the field\'s messages, but the overall validity returned by the validator suite becomes the minimum of all the sync validator results.

If all sync validators pass, the async validators run. Updating the value of the field while async validators are in progress causes the in progress validators to be unsubscribed from, and the process restarts beginning with any sync validators.

## Controlled Fields

Controlled fields allow you to create a field that subscribes to changes in the state(s) of another field or fields, and update its own state or value based on the state of those other fields.

To request an instance of a controlled field, simply add a control function to your field template, like so (see the `syncValueControlFn` property of `addressTemplate.fields[AddressFields.STATE]`:

    import {
      NestedFormTemplate
    } from 'modeled-forms-react';
    import zipState from 'zip-state';
    import { US_STATE_ABBREVIATIONS } from './util/us-states/us-state-abbreviations';
    import { isZipCode } from './util/validators/is-zip-code';
    
    export enum AddressFields {
      STREET_LINE_1 = 'streetLine1',
      STREET_LINE_2 = 'streetLine2',
      CITY = 'city',
      STATE = 'state',
      ZIP = 'zip'
    }
    
    export const addressTemplate : NestedFormTemplate = {
      fields : {
        [AddressFields.STREET_LINE_1] : '',
        [AddressFields.STREET_LINE_2] : '',
        [AddressFields.CITY] : '',
        [AddressFields.STATE] : {
          defaultValue : US_STATE_ABBREVIATIONS[0],
          syncValueControlFn : ({ [AddressFields.ZIP] : zip }) => {
            const stateAbbreviation = zipState(zip.value);
    
            if(!stateAbbreviation) return;
    
            return stateAbbreviation;
          }
        },
        [AddressFields.ZIP] : {
          defaultValue : '',
          syncValidators : [
            isZipCode
          ]
        }
      }
    }
 All control functions must destructure an instance of `AggregatedStateChanges`. By destructuring specific fields from this object, the controlled field will know which fields to subscribe to to generate its values. In addition to making all of the field states of your form available, `AggregatedStateChanges`makes the following properties available:

 - `overallValidity(): Validity;` - a function which returns the minimum validity of all fields subscribed to via the destructuring subscription process.
 - `modified() : Modified;`- a function which returns `Modified.YES` if all fields have been modified, `Modified.NO` if no fields have been modified, and `Modified.PARTIALLY` if some fields have been modified. Once again, fields refers not to all fields, but to fields subscribed to via the destructuring subscription process.
 - `visited() : Visited;`- a function which returns `Visited.YES` if all fields have been visited, `Visited.NO` if no fields have been visited, and `Visited.PARTIALLY` if some fields have been visited. Again, fields refers not to all fields, but to fields subscribed to via the destructuring subscription process.
 - `hasOmittedFields(): boolean;`- a function which returns true if at least one field has an `omit` property of `true`.

Though all control functions must destructure this `AggregatedStateChanges` object, they each return a different type of value, and each must return a different type of value depending on whether it is included in a `Field` template or a `DualField` template. You can find information about each type of control function listed below:

|Template Property Name  |Field Return Type  |DualField Return Type | Notes |
|--|--|--|--|
| syncValueControlFn | string \| undefined | DualFieldSetValueArg | For Fields, returning undefined allows to elect not to set the Field's value |
|syncStateControlFn | Partial\<FieldState\> | DualFieldSetStateArg | |
|asyncValueControlFn | Promise\<string \| undefined\> \| Observable\<string \| undefined\> | Promise\<DualFieldSetValueArg\> \| Observable\<DualFieldSetValueArg\> |
|asyncStateControlFn | Promise\<Partial\<FieldState\>\> \| Observable\<Partial\<FieldState\>\> | Promise\<DualFieldSetStateArg\> \| Observable\<DualFieldSetStateArg\> |

The definitions of `DualFieldSetValueArg` and `DualFieldSetStateArg` are as follows:

#### DualFieldSetValueArg

    interface DualFieldSetValueArg {
      primaryFieldValue?: string;
      secondaryFieldValue?: string;
      useSecondaryField?: boolean;
    }
#### DualFieldSetStateArg 

    interface DualFieldSetStateArg {
      primaryFieldState?: Partial<FieldState>;
      secondaryFieldState?: Partial<FieldState>;
      useSecondaryField?: boolean;
      omit?: boolean;
    }

Here, `useSecondaryField` allows you to set whether the secondary field is active or not.

## Multi-Field Validators

Multi-field validators are similar to controlled fields in that the functions used to define them must also destructure the `AggregatedStateChanges` object and come in both synchronous and asynchronous varieties. To declare these in your template, add the `multiFieldValidators` property to a form template.

This key should be assigned an object with properties `sync` and/or `async`. These represent arrays of sync multi-field validator templates and async multi-field validator templates, respectively. The template for a sync multi-input validator is just the function signature, which must be of type `SyncValidator<AggregatedStateChanges>`. The template for an async multi-input validator is an object with properties `validatorFn` which must be of type `AsyncValidator<AggregatedStateChanges>`, and an optional `pendingValidatorMessage` property, of type string.

Multi-input validators run only once all fields are individually valid.  If a multi-input validator includes omittedFields, it is treated as valid. Fields may participate in multiple multi-field validators. A field may only be finalized once all of its own validators, together with the multi-input validators of which it is a participant, succeed.

Messages returned by multi-field validators are displayed by the `FormMessages` component, together with other messages related to the state of the form itself.

## Finalized Fields

Finalized fields provide you with a mechanism by which you can customize the structure of the data to be submitted by the submitFn. If you provide a `finalizedFields` property in your form template, you can add keys to this object representing the names you wish to assign to your finalized fields. Any fields omitted from this object automatically receive a default finalizer. If the object is omitted entirely or is empty, every field will receive a default finalizer.

Each key of this object must be assign a finalizer template object. This object has a key representing its finalizerFn, either `asyncFinalizerFn`, or `syncFinalizerFn.` It also has an optional key, `preserveOriginalFields`, of type boolean. By default, the field(s) used to produce a finalized field are not included in the form's finalized value, but you can override this behavior by settting `preserveOriginalFields` to true in at least one finalizerFn in which your field participates.

A finalizer function simply destructures an `AggregatedStateChanges` object and returns some value, or a returns a `Promise` which ultimately resolves to a value, in the case of an async finalizer function.

Finalizers are run in response to every change to your form's data, so the finalized data will always be in a valid state that is ready to submit to your backend.

## Extracted Values

Extracted values provide you with a means of subscribing to your fields' values, deriving new values from those fields in real-time, and exposing them in a stateful manner to your React components. To define extracted values, add the `extractedValues` property to your template, and assign it an object with keys of `syncExtractedValues` and/or `asyncExtractedValues`. Each of these are objects with keys with which you will be to retrieve a stateful representation of your extracted value using the `useExtractedValue` hook. Each key's value must be a function that destructures an `AggregatedStateChanges` object and returns either some value (in the case of sync extracted values), or a `Promise` or rxjs `Observable` (in the case of async extracted values).

## Components

There are many components exported by the library. As templates are to the model of your form, so are components to its view. These are the primary mechanism by which you should construct the visual layout and appearance of your form.

All components in the libary must be children of a `RootForm` or `RootFormProvider` component. This component provides both the `RootForm` context and a `FormContext` to all child components. `NestedFormProvider`, `NestedFormAsForm` and `NestedFormAsFieldset` provide only `FormContext`.

Components consume this context, and interact with it. For instance, an `Input` component takes in a `fieldName` as a prop. It then hooks into the state of this field, and is able to update that field's state, and what it displays is in turn updated by that state. Almost all components can receive `className` and `style` props, allowing you to customize their appearance. Some include multiple html elements, and therefore receive class names/style props for each element they contain. Further, elements such as `Label` and `Input` (and many others) have custom attributes representing the state of the corresponding field in the model, which can be used to style the component depending on its validity, whether it has been visited, etc.

The following components are exported from the library:

 #### RootForm 
 
Provides RootFormContext and FormContext. Renders an html form element which can be styled with className or style props.
 
#### RootFormProvider 

Provides RootFormContext and FormContext without rendering a form element. Useful for multi-page forms.

#### NestedFormAsForm

Provides FormContext and renders an html form element which can be styled with className or style props. Useful for multi-page forms.
 
#### NestedFormAsFieldset

Provides FormContext and renders and html fieldset element. Useful for nested forms with an outer html form element.

#### NestedFormProvider 

Provides only FormContext without rendering a form or fieldset element.
 
#### Input 

Intended for input types such as text, date, email, password, color, etc. Requires a `type` and `fieldName` prop. Can be styled by providing `className` and/or `style` prop(s).

#### CheckboxInput 

Represents an input of type checkbox Sets the field's value to an empty string when unchecked and the value passed in as the value prop when checked. Also includes a label component. Requires `fieldName`, `value` and `labelText` props. To style the label, provide `labelClassName` and/or `labelStyle` prop(s). To style the input, provide `checkboxClassName` and/or `checkboxStyle` props.

#### RadioInput 

Represents an input of type radio. Requires `fieldName`, `value` and `labelText` props. To style the label, provide `labelClassName` and/or `labelStyle` prop(s). To style the input, provide `radioClassName` and/or `radioStyle` props. Add a few of these with the same fieldnames but different values and labelText props to get the effect of a radio button group.

#### Select

Corresponds to the html select component. You must provide a `fieldName` prop. Additionally, like with an html select element, you can pass in any number of `<option>` elements as children to the component. When declaring the field, ensure that its defaultValue matches the value of the option you wish to be selected by default.
 
 #### SelectOther 

A special component that renders a select element with one option already included. This option's value is "other" and when it is selected, an input is displayed in which the user can enter their own custom value.  This component accepts a `fieldName` prop, and `selectProps`, an object including such properties as `labelText`, `selectClassName`, `selectStyle`, `labelClassName` and `labelStyle`, and `inputProps`, an object including such properties as `inputClassName`, `inputStyle`, `labelClassName,` and `labelStyle.` **This component must be used in conjunction with a field declared as a `DualField` in the template.** See [Templates](#templates) for more information. 
 
 #### Textarea

Represents the html textarea component. Must receive a `fieldName` prop. Otherwise, behaves similarly to `Input.`


#### Label

Provides a label that has access to the state of a field. You must supply a fieldName prop. This allows you to style your labels in response to the state of the corresponding field, as the label will have a data-validity property, and will gain data-visited and data-modified properties  when the field is visited or modified, respectively. You can pass in a className and/or style prop to style the label, and you can pass in text or other components as children of this component.

#### FieldMessages

Renders the message returned by a particular field\'s validators in a container with aria-live set to polite. You must pass in a `fieldName` prop. You can pass in `containerClassName`/`containerStyle` and `messageClassName`/`messageStyle` props to style these components.

#### FormMessages

Renders the message associated with the immediately surrounding `FormContext`. You must pass in an `idPrefex` prop (ideally, you should assign your form an id and pass this same id in as this component's `idPrefix` prop). You can pass in `containerClassName`/`containerStyle` and `messageClassName`/`messageStyle` props to style these components.

#### ConfirmButton
A button used to call `tryConfirm` on the immediately surround `FormContext`. This is useful for attempting to advance to the next page of a multi-page form in a manner that resembles submission without actually submitting any data to a backend. The `ConfirmButton` takes a number optional props. First, it can be styled with `className` or `style` prop(s). It also takes `onSuccess` and `onError` props (both optional) representing callbacks  to be called when the confirmation attempt either succeeds or fails. An `errorMessage` prop can be passed in order to customize the error message that is displayed when confirmation fails. Finally, `enableOnlyWhenValid` can be provided to disable the button unless the form is valid, but this is not recommended unless you are using custom components which display error messages even before confirmation is attempted. The button does not display any text by default, so you should include text as a child component.
#### SubmitButton

A button used to call `trySubmit` on the `RootFormContext`. It can be styled with `className` or `style` prop(s). It also takes `onSuccess`,`onError` and `onFinally` props, allowing your application to respond to the promise returned by the `submitFn.` Similar to the `ConfirmButton`, `enableOnlyWhenValid` can be provided to disable the button unless the form is valid, but again, this is not recommended unless you are using custom components which display error messages even before confirmation is attempted.

#### ResetButton

A button which resets the state of the immediately surrounding FormContext and its fields. It can be styled with `className` and/or `style` and also accepts a `disabled` prop.

#### OmittableContext

This component takes a `fieldName` and is used to wrap child components. If the field (or dual field or nested form) corresponding to the provided `fieldName` is currently omitted, the component returns null. Otherwise, it returns its children wrapped in a jsx fragment.

## Accessibility
In addition to basic steps like assigning a name property to inputs, associating labels with inputs using htmlFor, etc, each input receives an aria-describedby attribute with a list of ids of messages associated with that field. These will be read by screen readers provided the FieldMessages component is used. Containers around these messages have aria-live set to polite.

## Hooks

If you wish for more direct access to your form's state and various other properties, you can utilize the hooks that are exported by the library/returned by calling `useContext` and passing in either a `FormContext` or a `RootFormContext`. There are also certain hooks which are not utilized by any of the library's components, as their use cases are highly project-specific.

Currently, the only hook directly exported by the library is the `useRootForm` hook. This is the hook that the `RootForm` and `RootFormProvider` components call internally to instantiate an instance of the `RootForm` class (distinct from the `RootForm` component), and create various other hooks which can be consumed by components that consume the contexts created by these components.

This hook returns a few other hooks and functions which are shared via the context API with consumers. Generally, it is probably never necessary to use this hook yourself. It is more likely that you will want to use some of the hooks it returns, which can be accessed by consuming the contexts that the `RootForm` or `RootFormProvider` components provide.

These contexts are the `FormContext` and the `RootFormContext`. Both `RootForm`/`RootFormProvider` and `NestedFormAsForm`/`NestedFormAsFieldset`/`NestedFormProvider` provide `FormContext`. This means the hooks and functions that your components consume will be provided by the `FormContext` that immediately wraps them.

Hooks available via consuming the `FormContext` include:

 - `useFormState()`
 - `useFirstNonValidFormElement()`
 - `useConfirmationAttempted()`
 - `tryConfirm()`
 - `reset()`
 - `useField()`
 - `useDualField()`
 - `useNestedForm()`
 - `useOmittableFormElement()`
 - `useExtractedValue()`

Almost all of these are utilized by the components. Notably, `useFirstNonValidFormElement()`, `useOmittableFormElement()`, and `useExtractedValue()` are not, so we will discuss them here.

#### useFirstNonValidFormElement()

This returns a stateful value of string | undefined representing the first non-valid field or nested form within the fields of this particular form. For use cases and more information, see [First Non-Valid Form Element](#first-non-valid-form-element).

#### useOmittableFormElement()

This returns both a stateful value representing whether or not a field/nested form is currently omitted, and a mechanism by which you can set that element's omit property. The hook takes in a fieldName, and returns an object with properties `omitFormElement`(a boolean representing whether the element is currently omitted) and `setOmitFormElement()`. `setOmitFormElement()`takes in a boolean and updates the field's omit property, which in turn updates `omitFormElement`.

#### useExtractedValue()

This grants you access to the extracted values you defined in your template. It takes in the key for the extracted value you wish to access and returns a stateful value which updates as that extracted value updates. For more information on extracted values, see [Extracted Values](#extracted-values).

<hr>

The RootFormContext makes only one function available, which is `trySubmit`. Conveniently though, the`RootForm` and `RootFormProvider` components DO provide `FormContext` in addition to `RootFormContext`.

## First Non-Valid Form Element

Each form keeps track of its first non-valid form element (i.e. a field or nested form whose validity is less than `Validity.VALID_FINALIZABLE`). This is accomplished using a heap, in which the order of the keys in the `fields` section of the template determines precedence in this heap. 

Some use-cases for this property include scrolling up to the first non-valid field when confirmation fails, or preventing navigation to the next page in a multi-page form should the current nested form be non-valid.

Because what is considered the "first" form element is determined by the order of the keys of the `fields` section of the template, you can use an instance of the `Map` class to define this section. This better guarantees that the order in which you define your fields is the order in which their keys are iterated over.

## Confirmation

Confirmation is the step that this library takes prior to the submission of a form to ensure that it is valid before actually calling the submit function. This step can also be invoked directly with the `trySubmit()` function which can be accessed by consuming the `FormContext`. The `useConfirmationAttempted()` hook (also available by consuming `FormContext`) returns a stateful value of type boolean representing whether the user has attempted to confirm the form. 

Though the actual confirmation process is very simple (it just checks the validity of the form, which is always the minimum validity of all of its fields anyway), it proved useful to separate this out into a process separate from submission. For a multi-page form, you can call the trySubmit method (or, easier still, use a `ConfirmButton` component) inside each nested form before advancing to the next page. This will cause error messages on unvisited/unmodified fields to display as if submitting the nested form, but won't actually call your `submitFn.`For your root form, though confirmation is distinct from submission, calling `trySubmit` first calls `tryConfirm`, and only calls the `submitFn` if confirmation was successful.

The `tryConfirm()` function takes an object as an argument, with a few optional properties. These same properties are exposed as props by the `ConfirmButton` component. These properties are:

 - `onSuccess` - a function with no parameters that should return void, which is called when confirmation is successful. This could be a function that navigates to the next page in a multi-page form.
 - `onError` - a function with no parameters that should return void, which is called when confirmation fails.
 - `errorMessage` - the error message that will be displayed in FormMessages when confirmation fails.

## Submission
Submission occurs when `trySubmit` is called. Prior to submission, the form's validity is checked during the confirmation step. If this check fails, submission is not attempted. If it succeeds, the `submitFn` is called. trySubmit accepts an object which can include `onSuccess`, `onError` and `onFinally` callback functions, allow your application to respond to the results of the `submitFn`.

## Usage with Next.js App Router

All of the components exported by this library harness the power of React hooks to deliver the user experience that they do. For instance, every component with the exception of `RootForm` and `RootFormProvider` calls `useContext()`. Additionally, `RootForm` and `RootFormProvider` accept a `RootFormTemplate` as a prop, which is not a serializable value, and therefore cannot be passed between server and client components. Therefore, you must create a component that defines the line between server and client components. The easiest way to do this is to create a component that renders your form, and add the 'use client' directive to the top of this file. Here is an example of what this might look like:

    'use client';
    import { RootFormProvider } from  "modeled-forms-react";
    import { PropsWithChildren } from  "react";    
    
    //import your form template
    import { rootFormTemplate } from  "@/form-templates/root-form.template";
    
    export  function  MyRootFormProvider({ children } :  PropsWithChildren) {
      return  (
        <RootFormProvider  template={rootFormTemplate}>
          {children}
        </RootFormProvider>
      );
    }

 Please see the [Examples](#examples) section for a link to a complete example built with the Next.js 13 app router. 

## Configuration

To configure Modeled Forms React, you can set an environment variable named `MODELED_FORMS_REACT_CONFIG` to a stringified config object. Modeled Forms React will look for `process.env.MODELED_FORMS_REACT_CONFIG` and attempt to parse this string into configurable properties. Modeled Forms React exports a utility function that facilitates this, `configMFR`. This very simply takes in a `Partial` of the `ConfigMFROptions` type (see below for all available properties) and returns an object with the key `MODELED_FORMS_REACT_CONFIG` assigned the stringified representation of the config object you passed in.

Here is an example usage of this utility function with Next.js.

    //next.config.js
    
    const { configMFR } = require('modeled-forms-react');
    
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      env : {
        ...configMFR({
          autoTrim : false,
          emailRegex : '.*', //a string that will be passed into a RegExp constructor
          symbolRegex : '.*', //another string that will be passed into a RegExp constructor
          globalMessages : {
            pendingAsyncValidatorSuite: 'your async validator message',
            singleFieldValidationError: 'your single field validation error message',
            pendingAsyncMultiFieldValidator: 'your pending async multi-field validator message',
            multiFieldValidationError: 'your multi-field validation error message',
            adapterError: 'your adapter error message here',
            finalizerError: 'your finalizer error message',
            finalizerPending: 'your finalizer pending message',
            confirmationFailed: 'your confirmation failed message',
            submissionError: 'your submission error message'
          }
        })
      },
    }
    
    module.exports = nextConfig

  
  

-  `autoTrim` - boolean. If true, form field values are trimmed before validation and before finalization (though the displayed value is not changed).

-  `emailRegex` - a string representation of a regular expression. This will be compiled into the regular expression used by the built-in `email` validator. You can provide a different regular expression if the needs of your project demand one.

-  `symbolRegex` - a string representation of a regular expression. This will be compiled into the expression used by the built-in `includesSymbol` validator.

-  `globalMessages` - this is an object whose properties represent default messages for various scenarios. You may wish to change these messages to better match the tone of your project, for i18n reasons, etc. This object contains the following customizable properties, each of which should be of type string:

	-  `pendingAsyncValidatorSuite`

	-  	`singleFieldValidationError`

	-  	`pendingAsyncMultiFieldValidator`

	-  `multiFieldValidationError`

	-  `adapterError`

	-  `finalizerError`

	-  `finalizerPending`

	-  `confirmationFailed`

	-  `submissionError`

  


## Contributing
If you wish to contribute to this project, please feel free to send me an [email](mailto:dvorakjt@gmail.com) to discuss a potential collaboration. There are many features I'd still like to implement, and probably a lot of refinements that can be made, so going forward, some help would be appreciated! 🙏

## Issues

If you encounter a bug, compatibility issue, etc., please submit an issue or send me an [email](mailto:dvorakjt@gmail.com). Even after 600+ unit tests, and testing with a variety of React frameworks, some bugs or compatibility issues could still be waiting to be caught, and I want to hear about them! 

If there is a feature you'd really like to see implemented, I want to hear about that too!


## License

MIT License

Copyright (c) 2023 Joseph Dvorak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

