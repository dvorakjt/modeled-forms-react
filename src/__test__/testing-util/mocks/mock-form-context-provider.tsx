/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { PropsWithChildren } from "react"
import { FormContext, FormContextType } from "../../../components/context-providers/form-context"
import { Message, Validity } from "../../../model"
import { Visited } from "../../../model/state/visited.enum"
import { Modified } from "../../../model/state/modified.enum"
import { TryConfirmArgsObject } from "../../../model/confirmation/confirmation-manager.interface"

interface MockFormContextProps {
  mockContextValue? : Partial<FormContextType>
}

export function MockFormContext({ mockContextValue = {}, children } : PropsWithChildren<MockFormContextProps>) {
  return (
    <FormContext.Provider value={{...getMockFormContextValue(), ...mockContextValue}}>
      {children}
    </FormContext.Provider>
  )
}

function getMockFormContextValue() {
  const mockUseField = () => {
    const field = {
      value : '',
      validity : Validity.VALID_FINALIZABLE,
      messages : [] as Array<Message>,
      visited : Visited.NO,
      modified : Modified.NO,
      updateValue : (newValue : string) => {
        field.value = newValue;
      },
      visit : () => field.visited = Visited.YES,
      reset : () => {
        field.value = '';
        field.visited = Visited.NO
      }
    }
    return field;
  }

  const mockFormContextValue : FormContextType = {
    useFormState : () => {
      return {
        value : {},
        validity : Validity.VALID_FINALIZABLE,
        messages : [],
        visited : Visited.NO,
        modified : Modified.NO
      }
    },
    useField : (fieldName : string) => {
      return mockUseField()
    },
    useDualField : (fieldName : string) => {
      return {
        usePrimaryField : mockUseField,
        useSecondaryField : mockUseField,
        useSwitchToSecondaryField : () => {
          const returnValue = {
            useSecondaryField : false,
            setUseSecondaryField : (useSecondaryField : boolean) => {
              returnValue.useSecondaryField = useSecondaryField;
            }
          }

          return returnValue;
        },
        reset : () => {
          return;
        }
      }
    },
    useNestedForm : (fieldName : string) => {
      return getMockFormContextValue()
    },
    useFirstNonValidFormElement : () => undefined,
    useExtractedValue : (key : string) => key,
    useOmittableFormElement : (fieldName : string) => {
      const returnValue = {
        omitFormElement : false,
        setOmitFormElement : (omit : boolean) => returnValue.omitFormElement = omit
      }

      return returnValue;
    },
    useConfirmationAttempted : () => false,
    tryConfirm : (argsObject : TryConfirmArgsObject) => {
      return;
    },
    reset : () => {
      return;
    }
  }

  return mockFormContextValue;
}