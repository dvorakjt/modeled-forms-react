import { Subject, Observable } from 'rxjs';
import * as React from 'react';
import React__default, { PropsWithChildren } from 'react';

declare enum Validity {
    ERROR = 0,
    INVALID = 1,
    PENDING = 2,
    VALID_UNFINALIZABLE = 3,
    VALID_FINALIZABLE = 4
}

declare enum MessageType {
    ERROR = "ERROR",
    INVALID = "INVALID",
    PENDING = "PENDING",
    VALID = "VALID"
}

interface ValidatorResult {
    isValid: boolean;
    message?: string;
}

type SyncValidator<T> = (value: T) => ValidatorResult;

declare function email(errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function inDateRange(min: Date, max: Date, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function inLengthRange(minLength: number, maxLength: number, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function inNumRange(min: number, max: number, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function includesDigit(errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function includesLower(errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function includesSymbol(errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function includesUpper(errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function maxDate(max: Date, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function maxLength(maxLength: number, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function maxNum(max: number, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function minDate(min: Date, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function minLength(minLength: number, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function minNum(min: number, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function pattern(pattern: RegExp, errorMessage: string, successMessage?: string): SyncValidator<string>;

declare function required(errorMessage: string, successMessage?: string): SyncValidator<string>;

interface Message {
    type: MessageType;
    text: string;
}

interface ValidatorSuiteResult<T> {
    value: T;
    validity: Validity;
    messages: Array<Message>;
}

type State<T> = ValidatorSuiteResult<T> & {
    omit?: boolean;
    useSecondaryField?: boolean;
};

type AnyState = State<any>;

type FieldState = State<string>;

interface DualFieldSetStateArg {
    primaryFieldState?: ValidatorSuiteResult<string>;
    secondaryFieldState?: ValidatorSuiteResult<string>;
    useSecondaryField?: boolean;
    omit?: boolean;
}

interface DualFieldSetValueArg {
    primaryFieldValue?: string;
    secondaryFieldValue?: string;
    useSecondaryField?: boolean;
}

type SubmitFn = (state: State<any>) => Promise<any>;

interface OmittableFormElement {
    set omit(omit: boolean);
    get omit(): boolean;
}

interface StatefulFormElement<T> {
    stateChanges: Subject<State<T>>;
    get state(): State<T>;
}

interface ResettableFormElement {
    reset(): void;
}

declare abstract class AbstractField implements StatefulFormElement<string>, OmittableFormElement, ResettableFormElement {
    abstract state: FieldState;
    abstract stateChanges: Subject<State<string>>;
    abstract omit: boolean;
    abstract setState(state: FieldState | DualFieldSetStateArg): void;
    abstract setValue(value: string | DualFieldSetValueArg): void;
    abstract reset(): void;
}

interface BaseForm extends StatefulFormElement<any>, ResettableFormElement {
    userFacingFields: FormElementDictionary;
    firstNonValidFormElement: string | undefined;
    firstNonValidFormElementChanges: Subject<string | undefined>;
}

declare abstract class AbstractNestedForm implements BaseForm, OmittableFormElement {
    abstract userFacingFields: FormElementDictionary;
    abstract omit: boolean;
    abstract stateChanges: Subject<State<any>>;
    abstract firstNonValidFormElement: string | undefined;
    abstract firstNonValidFormElementChanges: Subject<string | undefined>;
    abstract state: State<any>;
    abstract reset(): void;
}

type FormElementDictionary = {
    [key: string]: AbstractNestedForm | AbstractField;
};

interface OverallValidity {
    overallValidity(): Validity;
    hasOmittedFields(): boolean;
}
type AggregatedStateChanges = Omit<{
    [K in keyof FormElementDictionary]: AnyState;
}, keyof OverallValidity> & OverallValidity;

type AsyncBaseFinalizerFn = (valueToAdapt: AggregatedStateChanges) => Promise<any>;

type AsyncFinalizerTemplate = {
    asyncFinalizerFn: AsyncBaseFinalizerFn;
    syncFinalizerFn?: undefined;
    preserveOriginalFields?: boolean;
};

type SyncAdapterFn<V> = (valueToAdapt: AggregatedStateChanges) => V;

type SyncBaseFinalizerFn = SyncAdapterFn<any>;

type SyncFinalizerTemplate = {
    syncFinalizerFn: SyncBaseFinalizerFn;
    asyncFinalizerFn?: undefined;
    preserveOriginalFields?: boolean;
};

type FinalizerTemplateVariations = SyncFinalizerTemplate | AsyncFinalizerTemplate;

type FinalizerTemplateDictionary = Record<string, FinalizerTemplateVariations>;

type AsyncAdapterFn<V> = (valueToAdapt: AggregatedStateChanges) => Promise<V> | Observable<V>;

type AsyncDualFieldStateControlFn = AsyncAdapterFn<DualFieldSetStateArg>;

type AsyncValidator<T> = (value: T) => Promise<ValidatorResult>;

type BaseFieldTemplate = {
    omitByDefault?: boolean;
    syncValidators?: Array<SyncValidator<string>>;
    asyncValidators?: Array<AsyncValidator<string>>;
    pendingAsyncValidatorMessage?: string;
};

interface DualFieldTemplate extends BaseFieldTemplate {
    defaultValue?: undefined;
    primaryDefaultValue: string;
    secondaryDefaultValue: string;
}

type AsyncStateControlledDualFieldTemplate = DualFieldTemplate & {
    asyncStateControlFn: AsyncDualFieldStateControlFn;
    syncStateControlFn?: undefined;
    asyncValueControlFn?: undefined;
    syncValueControlFn?: undefined;
};

type AsyncFieldStateControlFn = AsyncAdapterFn<FieldState>;

type FieldTemplate = BaseFieldTemplate & {
    defaultValue: string;
    primaryDefaultValue?: undefined;
    secondaryDefaultValue?: undefined;
};

type AsyncStateControlledFieldTemplate = FieldTemplate & {
    asyncStateControlFn: AsyncFieldStateControlFn;
    syncStateControlFn?: undefined;
    asyncValueControlFn?: undefined;
    syncValueControlFn: undefined;
};

type AsyncDualFieldValueControlFn = AsyncAdapterFn<DualFieldSetValueArg>;

type AsyncValueControlledDualFieldTemplate = DualFieldTemplate & {
    asyncValueControlFn: AsyncDualFieldValueControlFn;
    syncValueControlFn?: undefined;
    asyncStateControlFn?: undefined;
    syncStateControlFn?: undefined;
};

type AsyncFieldValueControlFn = AsyncAdapterFn<string | undefined>;

type AsyncValueControlledFieldTemplate = FieldTemplate & {
    asyncValueControlFn: AsyncFieldValueControlFn;
    syncValueControlFn?: undefined;
    asyncStateControlFn?: undefined;
    syncStateControlFn?: undefined;
};

type SyncDualFieldStateControlFn = SyncAdapterFn<DualFieldSetStateArg>;

type SyncStateControlledDualFieldTemplate = DualFieldTemplate & {
    syncStateControlFn: SyncDualFieldStateControlFn;
    asyncStateControlFn: undefined;
    syncValueControlFn?: undefined;
    asyncValueControlFn?: undefined;
};

type SyncFieldStateControlFn = SyncAdapterFn<FieldState>;

type SyncStateControlledFieldTemplate = FieldTemplate & {
    syncStateControlFn: SyncFieldStateControlFn;
    asyncStateControlFn?: undefined;
    syncValueControlFn?: undefined;
    asyncValueControlFn?: undefined;
};

type SyncDualFieldValueControlFn = SyncAdapterFn<DualFieldSetValueArg>;

type SyncValueControlledDualFieldTemplate = DualFieldTemplate & {
    syncValueControlFn: SyncDualFieldValueControlFn;
    asyncValueControlFn?: undefined;
    syncStateControlFn?: undefined;
    asyncStateControlFn?: undefined;
};

type SyncFieldValueControlFn = SyncAdapterFn<string | undefined>;

type SyncValueControlledFieldTemplate = FieldTemplate & {
    syncValueControlFn: SyncFieldValueControlFn;
    asyncValueControlFn?: undefined;
    syncStateControlFn?: undefined;
    asyncStateControlFn?: undefined;
};

type FieldTemplateVariations = string | FieldTemplate | DualFieldTemplate | AsyncStateControlledFieldTemplate | AsyncStateControlledDualFieldTemplate | AsyncValueControlledFieldTemplate | AsyncValueControlledDualFieldTemplate | SyncStateControlledFieldTemplate | SyncStateControlledDualFieldTemplate | SyncValueControlledFieldTemplate | SyncValueControlledDualFieldTemplate;

interface NestedFormTemplate extends BaseFormTemplate {
    omitByDefault?: boolean;
}

type FieldOrNestedFormTemplate = FieldTemplateVariations | NestedFormTemplate;

type FormElementTemplateDictionaryOrMap = Record<string, FieldOrNestedFormTemplate> | Map<string, FieldOrNestedFormTemplate>;

interface MultiFieldValidatorsTemplate {
    sync?: Array<SyncValidator<AggregatedStateChanges>>;
    async?: Array<{
        validatorFn: AsyncValidator<AggregatedStateChanges>;
        pendingValidatorMessage?: string;
    }>;
}

interface BaseFormTemplate {
    fields: FormElementTemplateDictionaryOrMap;
    multiFieldValidators?: MultiFieldValidatorsTemplate;
    finalizedFields?: FinalizerTemplateDictionary;
}

interface RootFormTemplate extends BaseFormTemplate {
    submitFn: SubmitFn;
}

declare function useRootForm(template: RootFormTemplate): {
    useSubmissionAttempted: () => {
        submissionAttempted: boolean;
    };
    submit: () => Promise<any>;
    useFormState: () => {
        value: any;
        validity: Validity;
        messages: Message[];
    };
    useFirstNonValidFormElement: () => {
        firstNonValidFormElement: string | undefined;
    };
    reset: (() => void) | (() => void);
    useField: (fieldName: string) => {
        value: string;
        validity: Validity;
        messages: Message[];
        updateValue: (value: string) => void;
        reset: () => void;
    };
    useDualField: (fieldName: string) => {
        usePrimaryField: () => {
            value: string;
            validity: Validity;
            messages: Message[];
            updateValue: (value: string) => void;
            reset: () => void;
        };
        useSecondaryField: () => {
            value: string;
            validity: Validity;
            messages: Message[];
            updateValue: (value: string) => void;
            reset: () => void;
        };
        useSwitchToSecondaryField: () => {
            useSecondaryField: boolean;
            setUseSecondaryField: (useSecondaryField: boolean) => void;
        };
    };
    useNestedForm: (fieldName: string) => {
        useFormState: () => {
            value: any;
            validity: Validity;
            messages: Message[];
        };
        useFirstNonValidFormElement: () => {
            firstNonValidFormElement: string | undefined;
        };
        reset: (() => void) | (() => void);
        useField: (fieldName: string) => {
            value: string;
            validity: Validity;
            messages: Message[];
            updateValue: (value: string) => void;
            reset: () => void;
        };
        useDualField: (fieldName: string) => {
            usePrimaryField: () => {
                value: string;
                validity: Validity;
                messages: Message[];
                updateValue: (value: string) => void;
                reset: () => void;
            };
            useSecondaryField: () => {
                value: string;
                validity: Validity;
                messages: Message[];
                updateValue: (value: string) => void;
                reset: () => void;
            };
            useSwitchToSecondaryField: () => {
                useSecondaryField: boolean;
                setUseSecondaryField: (useSecondaryField: boolean) => void;
            };
        };
        useNestedForm: any;
        useOmittableFormElement: (fieldName: string) => {
            omitFormElement: boolean;
            setOmitFormElement: (omit: boolean) => void;
        };
    };
    useOmittableFormElement: (fieldName: string) => {
        omitFormElement: boolean;
        setOmitFormElement: (omit: boolean) => void;
    };
};

type MessageComponentProps = {
    className?: string;
    type: MessageType;
    text: string;
};
type MessageComponent = (props: MessageComponentProps) => JSX.Element;

type FieldMessagesProps = {
    fieldName: string;
    messagesContainerClassName?: string;
    messageClassName?: string;
    MessageComponent?: MessageComponent;
};
declare function FieldMessages({ fieldName, messagesContainerClassName, messageClassName, MessageComponent }: FieldMessagesProps): React__default.JSX.Element;

declare const FormContext: React.Context<{
    useFormState: () => {
        value: any;
        validity: Validity;
        messages: Message[];
    };
    useFirstNonValidFormElement: () => {
        firstNonValidFormElement: string | undefined;
    };
    reset: (() => void) | (() => void);
    useField: (fieldName: string) => {
        value: string;
        validity: Validity;
        messages: Message[];
        updateValue: (value: string) => void;
        reset: () => void;
    };
    useDualField: (fieldName: string) => {
        usePrimaryField: () => {
            value: string;
            validity: Validity;
            messages: Message[];
            updateValue: (value: string) => void;
            reset: () => void;
        };
        useSecondaryField: () => {
            value: string;
            validity: Validity;
            messages: Message[];
            updateValue: (value: string) => void;
            reset: () => void;
        };
        useSwitchToSecondaryField: () => {
            useSecondaryField: boolean;
            setUseSecondaryField: (useSecondaryField: boolean) => void;
        };
    };
    useNestedForm: (fieldName: string) => any;
    useOmittableFormElement: (fieldName: string) => {
        omitFormElement: boolean;
        setOmitFormElement: (omit: boolean) => void;
    };
} | null>;

type FormMessagesProps = {
    messagesContainerClassName?: string;
    messageClassName?: string;
    MessageComponent?: MessageComponent;
};
declare function FormMessages({ messagesContainerClassName, messageClassName, MessageComponent }: FormMessagesProps): React__default.JSX.Element;

type LabelProps = {
    fieldName: string;
    labelText: string;
    labelClassName?: string;
};
declare function Label({ fieldName, labelText, labelClassName }: LabelProps): React__default.JSX.Element;

type InputProps = {
    fieldName: string;
    inputType: string;
    inputClassName: string;
    readOnly?: boolean;
};
declare function Input({ fieldName, inputType, inputClassName, readOnly }: InputProps): React__default.JSX.Element;

type InputGroupProps = {
    inputGroupClassName?: string;
} & LabelProps & InputProps & FieldMessagesProps;
declare function InputGroup({ fieldName, inputGroupClassName, inputClassName, inputType, readOnly, labelText, labelClassName, messageClassName, messagesContainerClassName, MessageComponent }: InputGroupProps): React__default.JSX.Element;

type NestedFormProviderProps = {
    fieldName: string;
} & PropsWithChildren;
declare function NestedFormProvider({ fieldName, children }: NestedFormProviderProps): React__default.JSX.Element;

interface ResetButtonProps {
    disabled: boolean;
    className: string;
}
declare function ResetButton(props: ResetButtonProps): React__default.JSX.Element;

type RootFormProviderProps = {
    template: RootFormTemplate;
} & PropsWithChildren;
declare function RootFormProvider({ template, children }: RootFormProviderProps): React__default.JSX.Element;

interface SubmitButtonProps {
    className: string;
}
declare function SubmitButton({ className }: SubmitButtonProps): React__default.JSX.Element;

declare function validityToString(validity: Validity): "error" | "invalid" | "pending" | "valid";

export { AnyState, DualFieldSetStateArg, DualFieldSetValueArg, FieldMessages, FieldState, FormContext, FormMessages, Input, InputGroup, Label, Message, MessageComponent, MessageComponentProps, MessageType, NestedFormProvider, NestedFormTemplate, ResetButton, RootFormProvider, RootFormTemplate, State, SubmitButton, Validity, email, inDateRange, inLengthRange, inNumRange, includesDigit, includesLower, includesSymbol, includesUpper, maxDate, maxLength, maxNum, minDate, minLength, minNum, pattern, required, useRootForm, validityToString };
