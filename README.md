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

Controlled fields are quite easy to declare, and come in a few "flavors." First, they may be either state-controlled or value-controlled. With a state controlled field, the fields entire state (value, validity, messages, etc.) can be controlled by the value of another field OR fields. Value-controlled fields are bit simpler--only their value is controlled by another field or fields. 

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

Finally, a form template may include //extracted values

//submitFn

## Validators

## Controlled Fields

## Multi-Field Validators

## Finalized Fields

## Components

## Hooks

## First Non-Valid Form Element

## Confirmation

## Submission

## Usage with Next.js App Router

## Configuration

## Contributing

## Issues

## License