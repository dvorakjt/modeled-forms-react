"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from4, except, desc) => {
  if (from4 && typeof from4 === "object" || typeof from4 === "function") {
    for (let key of __getOwnPropNames(from4))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from4[key], enumerable: !(desc = __getOwnPropDesc(from4, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  FieldMessages: () => FieldMessages,
  FormContext: () => FormContext,
  FormMessages: () => FormMessages,
  Input: () => Input,
  InputGroup: () => InputGroup,
  Label: () => Label,
  MessageType: () => MessageType,
  NestedFormProvider: () => NestedFormProvider,
  ResetButton: () => ResetButton,
  RootFormProvider: () => RootFormProvider,
  SubmitButton: () => SubmitButton,
  Validity: () => Validity,
  email: () => email,
  inDateRange: () => inDateRange,
  inLengthRange: () => inLengthRange,
  inNumRange: () => inNumRange,
  includesDigit: () => includesDigit,
  includesLower: () => includesLower,
  includesSymbol: () => includesSymbol,
  includesUpper: () => includesUpper,
  maxDate: () => maxDate,
  maxLength: () => maxLength,
  maxNum: () => maxNum,
  minDate: () => minDate,
  minLength: () => minLength,
  minNum: () => minNum,
  pattern: () => pattern,
  required: () => required,
  useRootForm: () => useRootForm,
  validityToString: () => validityToString
});
module.exports = __toCommonJS(src_exports);

// src/model/state/validity.enum.ts
var Validity = /* @__PURE__ */ ((Validity2) => {
  Validity2[Validity2["ERROR"] = 0] = "ERROR";
  Validity2[Validity2["INVALID"] = 1] = "INVALID";
  Validity2[Validity2["PENDING"] = 2] = "PENDING";
  Validity2[Validity2["VALID_UNFINALIZABLE"] = 3] = "VALID_UNFINALIZABLE";
  Validity2[Validity2["VALID_FINALIZABLE"] = 4] = "VALID_FINALIZABLE";
  return Validity2;
})(Validity || {});

// src/model/state/messages/message-type.enum.ts
var MessageType = /* @__PURE__ */ ((MessageType2) => {
  MessageType2["ERROR"] = "ERROR";
  MessageType2["INVALID"] = "INVALID";
  MessageType2["PENDING"] = "PENDING";
  MessageType2["VALID"] = "VALID";
  return MessageType2;
})(MessageType || {});

// src/config.ts
var import_rc = __toESM(require("rc"), 1);
var config = (0, import_rc.default)("modeledformsreact", {
  autoTrim: true,
  emailRegex: /^[A-Z0-9]+(?:[_%+.-][A-Z0-9]+)*@[A-Z0-9]+(?:[.-][A-Z0-9]+)*\.[A-Z]{2,}$/i,
  symbolRegex: /[ !"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]/,
  globalMessages: {
    pendingAsyncValidatorSuite: "Checking field...",
    singleFieldValidationError: "An unexpected error occurred while validating the field.",
    pendingAsyncMultiFieldValidator: "Checking form...",
    multiFieldValidationError: "An unexpected error occurred while validating the validity of the form.",
    adapterError: "An unexpected error occurred while generating this field's value.",
    finalizerError: "An unexpected error occurred while preparing the form for submission.",
    finalizerPending: "Preparing form for submission...",
    submissionFailed: "There are invalid or pending fields, or the form is currently being prepared for submission."
  }
});

// src/model/container.ts
var import_undecorated_di28 = require("undecorated-di");

// src/model/adapters/adapter-factory-impl.ts
var import_undecorated_di = require("undecorated-di");

// src/model/adapters/adapter-factory.interface.ts
var AdapterFactoryKey = "AdapterFactory";

// src/model/aggregators/aggregator-factory.interface.ts
var AggregatorFactoryKey = "AggregatorFactory";

// src/model/adapters/async-adapter.ts
var import_rxjs = require("rxjs");

// src/model/util/log-error-in-dev-mode.ts
function logErrorInDevMode(e) {
  process.env.NODE_ENV === "development" && console.error(e);
}

// src/model/adapters/async-adapter.ts
var AsyncAdapter = class {
  constructor(adapterFn, aggregator) {
    this._aggregator = aggregator;
    this.stream = new import_rxjs.ReplaySubject(1), this._aggregator.aggregateChanges.subscribe(
      (aggregateChange) => {
        var _a;
        (_a = this._adapterFnSubscription) == null ? void 0 : _a.unsubscribe();
        try {
          const promiseOrObservable = adapterFn(aggregateChange);
          this._adapterFnSubscription = (0, import_rxjs.from)(promiseOrObservable).subscribe({
            next: (next) => this.stream.next(next),
            error: (e) => {
              logErrorInDevMode(e);
              this.stream.error(e);
            }
          });
        } catch (e) {
          logErrorInDevMode(e);
          this.stream.error(e);
        }
      }
    );
  }
};

// src/model/adapters/sync-adapter.ts
var import_rxjs2 = require("rxjs");
var SyncAdapter = class {
  constructor(adapterFn, aggregator) {
    this._aggregator = aggregator;
    this.stream = new import_rxjs2.ReplaySubject(1);
    this._aggregator.aggregateChanges.subscribe(
      (aggregateChange) => {
        try {
          const nextValue = adapterFn(aggregateChange);
          this.stream.next(nextValue);
        } catch (e) {
          logErrorInDevMode(e);
          this.stream.error(e);
        }
      }
    );
  }
};

// src/model/adapters/adapter-factory-impl.ts
var AdapterFactoryImpl = class {
  constructor(aggregatorFactory) {
    this._aggregatorFactory = aggregatorFactory;
  }
  createSyncAdapterFromFnWithFields(syncAdapterFn, fields) {
    const multiFieldAggregator = this._aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new SyncAdapter(syncAdapterFn, multiFieldAggregator);
  }
  createAsyncAdapterFromFnWithFields(asyncAdapterFn, fields) {
    const multiFieldAggregator = this._aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new AsyncAdapter(asyncAdapterFn, multiFieldAggregator);
  }
};
var AdapterFactoryService = (0, import_undecorated_di.autowire)(AdapterFactoryImpl, AdapterFactoryKey, [AggregatorFactoryKey]);

// src/model/emitters/emitter-factory.interface.ts
var EmitterFactoryKey = "EmitterFactory";

// src/model/proxies/proxy-producer-factory.interface.ts
var ProxyProducerFactoryKey = "ProxyProducerFactory";

// src/model/reducers/reducer-factory.interface.ts
var ReducerFactoryKey = "ReducerFactory";

// src/model/subjects/subject-factory.interface.ts
var SubjectFactoryKey = "SubjectFactory";

// src/model/aggregators/multi-field-aggregator-impl.ts
var MultiFieldAggregatorImpl = class {
  constructor(fields, aggregatedStateChangesProxyProducer, fieldStateReducer, accessedFields, subjectFactory) {
    this._aggregatedFieldState = {};
    this._accessedFieldsSubscriptionProcessCompleted = false;
    this._subscribeToAccessedFields = () => {
      if (!this._accessedFieldsSubscriptionProcessCompleted && this._aggregatedStateChangesProxyProducer) {
        const accessedFieldNames = this._aggregatedStateChangesProxyProducer.accessedFieldNames;
        for (const fieldName of accessedFieldNames) {
          this._fields[fieldName].stateChanges.subscribe(
            (stateChange) => {
              this._aggregatedFieldState[fieldName] = stateChange;
              this._fieldStateReducer.updateTallies(fieldName, stateChange);
              if (this._accessedFieldsSubscriptionProcessCompleted) {
                this.aggregateChanges.next(this.aggregatedStateChanges);
              }
            }
          );
        }
        this.accessedFields.setValue(accessedFieldNames);
        this._aggregatedStateChangesProxyProducer = null;
        this._accessedFieldsSubscriptionProcessCompleted = true;
      }
    };
    this._fields = fields;
    this._aggregatedStateChangesProxyProducer = aggregatedStateChangesProxyProducer;
    this._fieldStateReducer = fieldStateReducer;
    this.aggregateChanges = subjectFactory.createOnInitialSubscriptionHandlingBehaviorSubject(
      this._aggregatedStateChangesProxyProducer.getProxy(this._fields)
    );
    this.accessedFields = accessedFields;
    this.aggregateChanges.onInitialSubscription(this._subscribeToAccessedFields);
  }
  get aggregatedStateChanges() {
    return __spreadProps(__spreadValues({}, this._aggregatedFieldState), {
      overallValidity: () => this._fieldStateReducer.validity,
      hasOmittedFields: () => this._fieldStateReducer.omit
    });
  }
};

// src/model/aggregators/multi-input-validator-messages-aggregator-impl.ts
var import_rxjs3 = require("rxjs");

// src/model/util/copy-object.ts
function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}

// src/model/aggregators/multi-input-validator-messages-aggregator-impl.ts
var MultiInputValidatorMessagesAggregatorImpl = class {
  constructor(validators) {
    this._messages = {};
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      validator.messageChanges.subscribe((next) => {
        if (next)
          this._messages[i] = next;
        else
          delete this._messages[i];
        if (this.messagesChanges)
          this.messagesChanges.next(this.messages);
      });
    }
    this.messagesChanges = new import_rxjs3.BehaviorSubject(this.messages);
  }
  get messages() {
    return [...this._generateMessages()];
  }
  *_generateMessages() {
    for (const key in this._messages)
      yield copyObject(this._messages[key]);
  }
};

// src/model/aggregators/aggregator-factory-impl.ts
var import_undecorated_di2 = require("undecorated-di");
var AggregatorFactoryImpl = class {
  constructor(proxyProducerFactory, reducerFactory, emitterFactory, subjectFactory) {
    this._proxyProducerFactory = proxyProducerFactory;
    this._reducerFactory = reducerFactory;
    this._emitterFactory = emitterFactory;
    this._subjectFactory = subjectFactory;
  }
  createMultiFieldAggregatorFromFields(fields) {
    return new MultiFieldAggregatorImpl(
      fields,
      this._proxyProducerFactory.createAggregatedStateChangesProxyProducer(),
      this._reducerFactory.createFieldStateReducer(),
      this._emitterFactory.createOneTimeValueEmitter(),
      this._subjectFactory
    );
  }
  createMultiInputValidatorMessagesAggregatorFromValidators(validators) {
    return new MultiInputValidatorMessagesAggregatorImpl(validators);
  }
};
var AggregatorFactoryService = (0, import_undecorated_di2.autowire)(AggregatorFactoryImpl, AggregatorFactoryKey, [
  ProxyProducerFactoryKey,
  ReducerFactoryKey,
  EmitterFactoryKey,
  SubjectFactoryKey
]);

// src/model/emitters/one-time-event-emitter-impl.ts
var OneTimeEventEmitterImpl = class {
  constructor() {
    this._eventOccurred = false;
    this._callbacks = [];
  }
  onEvent(cb) {
    if (this._eventOccurred)
      cb();
    else
      this._callbacks.push(cb);
  }
  triggerEvent() {
    if (!this._eventOccurred) {
      this._eventOccurred = true;
      for (const cb of this._callbacks) {
        cb();
      }
    }
  }
};

// src/model/emitters/one-time-value-emitter-impl.ts
var OneTimeValueEmitterImpl = class {
  constructor() {
    this._callbacks = [];
  }
  onValue(cb) {
    if (this._value)
      cb(this._value);
    else
      this._callbacks.push(cb);
  }
  setValue(value) {
    if (!this._value) {
      this._value = value;
      for (const cb of this._callbacks) {
        cb(this._value);
      }
    }
  }
};

// src/model/emitters/emitter-factory-impl.ts
var import_undecorated_di3 = require("undecorated-di");
var EmitterFactoryImpl = class {
  createOneTimeEventEmitter() {
    return new OneTimeEventEmitterImpl();
  }
  createOneTimeValueEmitter() {
    return new OneTimeValueEmitterImpl();
  }
};
var EmitterFactoryService = (0, import_undecorated_di3.autowire)(EmitterFactoryImpl, EmitterFactoryKey);

// src/model/fields/base/base-field-factory.interface.ts
var BaseFieldFactoryKey = "BaseFieldFactory";

// src/model/validators/single-input/single-input-validator-suite-factory.interface.ts
var SingleInputValidatorSuiteFactoryKey = "SingleInputValidatorSuiteFactory";

// src/model/fields/base/dual-field.ts
var import_rxjs4 = require("rxjs");

// src/model/fields/base/abstract-field.ts
var AbstractField = class {
};

// src/model/fields/base/abstract-dual-field.ts
var AbstractDualField = class extends AbstractField {
};

// src/model/fields/base/dual-field.ts
var DualField = class extends AbstractDualField {
  constructor(primaryField, secondaryField, omitByDefault) {
    super();
    this._useSecondaryField = false;
    this.primaryField = primaryField;
    this.secondaryField = secondaryField;
    this._omitByDefault = omitByDefault;
    this._omit = this._omitByDefault;
    this.primaryField.stateChanges.subscribe(() => {
      var _a;
      if (!this._useSecondaryField)
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
    });
    this.secondaryField.stateChanges.subscribe(() => {
      var _a;
      if (this._useSecondaryField)
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
    });
    this.stateChanges = new import_rxjs4.BehaviorSubject(this.state);
    this.primaryField.interactionsChanges.subscribe(() => {
      var _a;
      if (!this._useSecondaryField)
        (_a = this.interactionsChanges) == null ? void 0 : _a.next(this.interactions);
    });
    this.secondaryField.interactionsChanges.subscribe(() => {
      var _a;
      if (this._useSecondaryField)
        (_a = this.interactionsChanges) == null ? void 0 : _a.next(this.interactions);
    });
    this.interactionsChanges = new import_rxjs4.BehaviorSubject(this.interactions);
  }
  get interactions() {
    if (this.useSecondaryField)
      return this.secondaryField.interactions;
    else
      return this.primaryField.interactions;
  }
  get state() {
    const state = !this._useSecondaryField ? this.primaryField.state : this.secondaryField.state;
    state.useSecondaryField = this._useSecondaryField;
    state.omit = this._omit;
    return state;
  }
  set useSecondaryField(useSecondaryField) {
    const changeDetected = this.useSecondaryField !== useSecondaryField;
    this._useSecondaryField = useSecondaryField;
    if (this.stateChanges && changeDetected)
      this.stateChanges.next(this.state);
  }
  get useSecondaryField() {
    return this._useSecondaryField;
  }
  set omit(omit) {
    var _a;
    this._omit = omit;
    (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
  }
  get omit() {
    return this._omit;
  }
  setValue(valueObj) {
    if (valueObj.primaryFieldValue)
      this.primaryField.setValue(valueObj.primaryFieldValue);
    if (valueObj.secondaryFieldValue)
      this.secondaryField.setValue(valueObj.secondaryFieldValue);
    if (valueObj.useSecondaryField !== void 0)
      this.useSecondaryField = valueObj.useSecondaryField;
  }
  setState(stateObj) {
    if (stateObj.omit !== void 0)
      this.omit = stateObj.omit;
    if (stateObj.primaryFieldState)
      this.primaryField.setState(stateObj.primaryFieldState);
    if (stateObj.secondaryFieldState)
      this.secondaryField.setState(stateObj.secondaryFieldState);
    if (stateObj.useSecondaryField !== void 0)
      this.useSecondaryField = stateObj.useSecondaryField;
  }
  reset() {
    this._omit = this._omitByDefault;
    this.primaryField.reset();
    this.secondaryField.reset();
    this.useSecondaryField = false;
  }
};

// src/model/fields/base/field.ts
var import_rxjs5 = require("rxjs");
var Field = class extends AbstractField {
  constructor(validatorSuite, defaultValue, omitByDefault) {
    super();
    this._validatorSuite = validatorSuite;
    this._defaultValue = defaultValue;
    this._omitByDefault = omitByDefault;
    const initialState = this._validatorSuite.evaluate(this._defaultValue);
    this._state = __spreadProps(__spreadValues({}, initialState.syncResult), {
      omit: this._omitByDefault
    });
    this.stateChanges = new import_rxjs5.BehaviorSubject(this.state);
    if (initialState.observable)
      this._handleValidityObservable(initialState.observable);
    this._interactions = {
      visited: false,
      modified: this._defaultValue.length > 0
    };
    this.interactionsChanges = new import_rxjs5.BehaviorSubject(this.interactions);
  }
  get state() {
    return copyObject(this._state);
  }
  set omit(omit) {
    this.setState(__spreadProps(__spreadValues({}, this.state), {
      omit
    }));
  }
  get omit() {
    return this.state.omit;
  }
  get interactions() {
    return copyObject(this._interactions);
  }
  set interactions(interactions) {
    this._interactions = interactions;
    if (this.interactionsChanges)
      this.interactionsChanges.next(this.interactions);
  }
  setValue(value) {
    if (this._validatorSuiteSubscription)
      this._validatorSuiteSubscription.unsubscribe();
    const validityResult = this._validatorSuite.evaluate(value);
    this.setState(__spreadProps(__spreadValues({}, validityResult.syncResult), {
      omit: this.state.omit
    }));
    if (validityResult.observable)
      this._handleValidityObservable(validityResult.observable);
  }
  setState(state) {
    this._state = copyObject(state);
    this.stateChanges.next(this.state);
    this.interactions = __spreadProps(__spreadValues({}, this.interactions), {
      modified: true
    });
  }
  reset() {
    this._state.omit = this._omitByDefault;
    this.setValue(this._defaultValue);
    this.interactions = {
      visited: false,
      modified: this._defaultValue.length > 0
    };
  }
  _handleValidityObservable(observable) {
    var _a;
    (_a = this._validatorSuiteSubscription) == null ? void 0 : _a.unsubscribe();
    this._validatorSuiteSubscription = observable.subscribe((result) => {
      this.setState(__spreadProps(__spreadValues({}, result), {
        messages: [
          ...this.state.messages.filter(
            (message) => message.type !== "PENDING" /* PENDING */
          ),
          ...result.messages
        ],
        omit: this.state.omit
      }));
    });
  }
};

// src/model/fields/base/base-field-factory-impl.ts
var import_undecorated_di4 = require("undecorated-di");
var BaseFieldFactoryImpl = class {
  constructor(singleInputValidatorSuiteFactory) {
    this._singleInputValidatorSuiteFactory = singleInputValidatorSuiteFactory;
  }
  createField(defaultValue, omitByDefault, syncValidators, asyncValidators, pendingAsyncValidatorMessage) {
    const validatorSuite = this._singleInputValidatorSuiteFactory.createSingleInputValidatorSuite(
      syncValidators,
      asyncValidators,
      pendingAsyncValidatorMessage
    );
    return new Field(validatorSuite, defaultValue, omitByDefault);
  }
  createDualField(primaryDefaultValue, secondaryDefaultValue, omitByDefault, syncValidators, asyncValidators, pendingAsyncValidatorMessage) {
    const primaryField = this.createField(
      primaryDefaultValue,
      false,
      syncValidators,
      asyncValidators,
      pendingAsyncValidatorMessage
    );
    const secondaryField = this.createField(
      secondaryDefaultValue,
      false,
      syncValidators,
      asyncValidators,
      pendingAsyncValidatorMessage
    );
    return new DualField(primaryField, secondaryField, omitByDefault);
  }
};
var BaseFieldFactoryService = (0, import_undecorated_di4.autowire)(BaseFieldFactoryImpl, BaseFieldFactoryKey, [
  SingleInputValidatorSuiteFactoryKey
]);

// src/model/fields/controlled/controlled-field-factory-impl.ts
var import_undecorated_di5 = require("undecorated-di");

// src/model/fields/controlled/state-controlled-dual-field.ts
var StateControlledDualField = class extends AbstractDualField {
  constructor(field, adapter) {
    super();
    this._field = field;
    this._adapter = adapter;
    this._adapter.stream.subscribe({
      next: (next) => this.setState(next),
      error: () => {
        const errorState = {
          value: "",
          validity: 0 /* ERROR */,
          messages: [
            {
              type: "ERROR" /* ERROR */,
              text: config.globalMessages.adapterError
            }
          ]
        };
        const setStateArg = this._dualField.useSecondaryField ? {
          secondaryFieldState: errorState
        } : {
          primaryFieldState: errorState
        };
        this.setState(setStateArg);
      }
    });
  }
  get stateChanges() {
    return this._field.stateChanges;
  }
  get state() {
    return this._field.state;
  }
  get interactions() {
    return this._field.interactions;
  }
  get interactionsChanges() {
    return this._field.interactionsChanges;
  }
  set omit(omit) {
    this._field.omit = omit;
  }
  get omit() {
    return this._field.omit;
  }
  get primaryField() {
    return this._dualField.primaryField;
  }
  get secondaryField() {
    return this._dualField.secondaryField;
  }
  set useSecondaryField(useSecondaryField) {
    this._dualField.useSecondaryField = useSecondaryField;
  }
  get useSecondaryField() {
    return this._dualField.useSecondaryField;
  }
  get _dualField() {
    return this._field;
  }
  setValue(value) {
    this._dualField.setValue(value);
  }
  setState(state) {
    this._dualField.setState(state);
  }
  reset() {
    this._dualField.reset();
  }
};

// src/model/fields/controlled/state-controlled-field.ts
var StateControlledField = class extends AbstractField {
  constructor(field, adapter) {
    super();
    this._field = field;
    this._adapter = adapter;
    this._adapter.stream.subscribe({
      next: (next) => this.setState(next),
      error: () => {
        this.setState({
          value: "",
          validity: 0 /* ERROR */,
          messages: [
            {
              type: "ERROR" /* ERROR */,
              text: config.globalMessages.adapterError
            }
          ]
        });
      }
    });
  }
  get stateChanges() {
    return this._field.stateChanges;
  }
  get state() {
    return this._field.state;
  }
  get interactions() {
    return this._field.interactions;
  }
  set interactions(interactions) {
    this._field.interactions = interactions;
  }
  get interactionsChanges() {
    return this._field.interactionsChanges;
  }
  set omit(omit) {
    this._field.omit = omit;
  }
  get omit() {
    return this._field.omit;
  }
  setValue(value) {
    this._field.setValue(value);
  }
  setState(state) {
    this._field.setState(state);
  }
  reset() {
    this._field.reset();
  }
};

// src/model/fields/controlled/value-controlled-dual-field.ts
var ValueControlledDualField = class extends AbstractDualField {
  constructor(field, adapter) {
    super();
    this._field = field;
    this._adapter = adapter;
    this._adapter.stream.subscribe({
      next: (next) => {
        if (next)
          this.setValue(next);
      },
      error: () => {
        const errorState = {
          value: "",
          validity: 0 /* ERROR */,
          messages: [
            {
              type: "ERROR" /* ERROR */,
              text: config.globalMessages.adapterError
            }
          ]
        };
        const setStateArg = this._dualField.useSecondaryField ? {
          secondaryFieldState: errorState
        } : {
          primaryFieldState: errorState
        };
        this.setState(setStateArg);
      }
    });
  }
  get stateChanges() {
    return this._field.stateChanges;
  }
  get state() {
    return this._field.state;
  }
  set omit(omit) {
    this._field.omit = omit;
  }
  get omit() {
    return this._field.omit;
  }
  get primaryField() {
    return this._dualField.primaryField;
  }
  get secondaryField() {
    return this._dualField.secondaryField;
  }
  set useSecondaryField(useSecondaryField) {
    this._dualField.useSecondaryField = useSecondaryField;
  }
  get interactions() {
    return this._field.interactions;
  }
  get interactionsChanges() {
    return this._field.interactionsChanges;
  }
  get useSecondaryField() {
    return this._dualField.useSecondaryField;
  }
  get _dualField() {
    return this._field;
  }
  setValue(value) {
    this._dualField.setValue(value);
  }
  setState(state) {
    this._dualField.setState(state);
  }
  reset() {
    this._dualField.reset();
  }
};

// src/model/fields/controlled/value-controlled-field.ts
var ValueControlledField = class extends AbstractField {
  constructor(field, adapter) {
    super();
    this._field = field;
    this._adapter = adapter;
    this._adapter.stream.subscribe({
      next: (next) => {
        if (next)
          this.setValue(next);
      },
      error: () => {
        this.setState({
          value: "",
          validity: 0 /* ERROR */,
          messages: [
            {
              type: "ERROR" /* ERROR */,
              text: config.globalMessages.adapterError
            }
          ]
        });
      }
    });
  }
  get stateChanges() {
    return this._field.stateChanges;
  }
  get state() {
    return this._field.state;
  }
  get interactions() {
    return this._field.interactions;
  }
  set interactions(interactions) {
    this._field.interactions = interactions;
  }
  get interactionsChanges() {
    return this._field.interactionsChanges;
  }
  set omit(omit) {
    this._field.omit = omit;
  }
  get omit() {
    return this._field.omit;
  }
  setValue(value) {
    this._field.setValue(value);
  }
  setState(state) {
    this._field.setState(state);
  }
  reset() {
    this._field.reset();
  }
};

// src/model/fields/controlled/controlled-field-factory.interface.ts
var ControlledFieldFactoryKey = "ControlledFieldFactory";

// src/model/fields/controlled/controlled-field-factory-impl.ts
var ControlledFieldFactoryImpl = class {
  constructor(adapterFactory) {
    this._adapterFactory = adapterFactory;
  }
  createStateControlledFieldWithSyncAdapter(baseField, stateControlFn, fields) {
    const adapter = this._adapterFactory.createSyncAdapterFromFnWithFields(stateControlFn, fields);
    return baseField instanceof AbstractDualField ? new StateControlledDualField(
      baseField,
      adapter
    ) : new StateControlledField(
      baseField,
      adapter
    );
  }
  createStateControlledFieldWithAsyncAdapter(baseField, stateControlFn, fields) {
    const adapter = this._adapterFactory.createAsyncAdapterFromFnWithFields(stateControlFn, fields);
    return baseField instanceof AbstractDualField ? new StateControlledDualField(
      baseField,
      adapter
    ) : new StateControlledField(
      baseField,
      adapter
    );
  }
  createValueControlledFieldWithSyncAdapter(baseField, valueControlFn, fields) {
    const adapter = this._adapterFactory.createSyncAdapterFromFnWithFields(valueControlFn, fields);
    return baseField instanceof AbstractDualField ? new ValueControlledDualField(
      baseField,
      adapter
    ) : new ValueControlledField(
      baseField,
      adapter
    );
  }
  createValueControlledFieldWithAsyncAdapter(baseField, valueControlFn, fields) {
    const adapter = this._adapterFactory.createAsyncAdapterFromFnWithFields(valueControlFn, fields);
    return baseField instanceof AbstractDualField ? new ValueControlledDualField(
      baseField,
      adapter
    ) : new ValueControlledField(
      baseField,
      adapter
    );
  }
};
var ControlledFieldFactoryService = (0, import_undecorated_di5.autowire)(ControlledFieldFactoryImpl, ControlledFieldFactoryKey, [AdapterFactoryKey]);

// src/model/finalizers/finalizer-functions/finalizer-fn-factory-impl.ts
var import_rxjs6 = require("rxjs");

// src/model/finalizers/finalizer-functions/finalizer-fn-factory.interface.ts
var FinalizerFnFactoryKey = "FinalizerFnFactory";

// src/model/finalizers/finalizer-validity-translator.interface.ts
var FinalizerValidityTranslatorKey = "FinalizerValidityTranslator";

// src/model/finalizers/finalizer-functions/finalizer-fn-factory-impl.ts
var import_undecorated_di6 = require("undecorated-di");
var FinalizerFnFactoryImpl = class {
  constructor(finalizerValidityTranslator) {
    this._finalizerValidityTranslator = finalizerValidityTranslator;
  }
  createSyncFinalizerFn(baseAdapterFn) {
    return (aggregatedStateChanges) => {
      let value;
      let error;
      try {
        value = baseAdapterFn(aggregatedStateChanges);
      } catch (e) {
        logErrorInDevMode(e);
        error = e;
      }
      if (aggregatedStateChanges.hasOmittedFields()) {
        return { finalizerValidity: 5 /* VALID_FINALIZED */ };
      }
      const overallValidity = aggregatedStateChanges.overallValidity();
      if (overallValidity < 4 /* VALID_FINALIZABLE */) {
        return {
          finalizerValidity: this._finalizerValidityTranslator.translateValidityToFinalizerValidity(
            overallValidity
          )
        };
      }
      if (error) {
        return {
          finalizerValidity: -1 /* FINALIZER_ERROR */
        };
      } else {
        return {
          value,
          finalizerValidity: 5 /* VALID_FINALIZED */
        };
      }
    };
  }
  createAsyncFinalizerFn(baseAdapterFn) {
    return (aggregatedStateChanges) => {
      return new import_rxjs6.Observable((subscriber) => {
        let promise = void 0;
        let error;
        try {
          promise = baseAdapterFn(aggregatedStateChanges);
        } catch (e) {
          error = e;
        }
        if (error) {
          logErrorInDevMode(error);
          subscriber.next({
            finalizerValidity: -1 /* FINALIZER_ERROR */
          });
          subscriber.complete();
        } else if (aggregatedStateChanges.hasOmittedFields()) {
          subscriber.next({
            finalizerValidity: 5 /* VALID_FINALIZED */
          });
          subscriber.complete();
        } else if (aggregatedStateChanges.overallValidity() < 4 /* VALID_FINALIZABLE */) {
          subscriber.next({
            finalizerValidity: this._finalizerValidityTranslator.translateValidityToFinalizerValidity(
              aggregatedStateChanges.overallValidity()
            )
          });
        } else if (promise) {
          subscriber.next({
            finalizerValidity: 4 /* VALID_FINALIZING */
          });
          promise.then((value) => {
            subscriber.next({
              value,
              finalizerValidity: 5 /* VALID_FINALIZED */
            });
            subscriber.complete();
          }).catch((e) => {
            logErrorInDevMode(e);
            subscriber.next({
              finalizerValidity: -1 /* FINALIZER_ERROR */
            });
            subscriber.complete();
          });
        } else {
          throw new Error("Async finalizer function did not return a promise.");
        }
      });
    };
  }
};
var FinalizerFnFactoryService = (0, import_undecorated_di6.autowire)(FinalizerFnFactoryImpl, FinalizerFnFactoryKey, [
  FinalizerValidityTranslatorKey
]);

// src/model/finalizers/finalizer-validity-translator-impl.ts
var import_undecorated_di7 = require("undecorated-di");
var FinalizerValidityTranslatorImpl = class {
  translateFinalizerValidityToValidity(finalizerValidity) {
    switch (finalizerValidity) {
      case -1 /* FINALIZER_ERROR */:
        return 0 /* ERROR */;
      case 0 /* FIELD_ERROR */:
        return 0 /* ERROR */;
      case 1 /* FIELD_INVALID */:
        return 1 /* INVALID */;
      case 2 /* FIELD_PENDING */:
        return 2 /* PENDING */;
      case 3 /* FIELD_VALID_UNFINALIZABLE */:
        return 3 /* VALID_UNFINALIZABLE */;
      case 4 /* VALID_FINALIZING */:
        return 4 /* VALID_FINALIZABLE */;
      case 5 /* VALID_FINALIZED */:
        return 4 /* VALID_FINALIZABLE */;
    }
  }
  translateValidityToFinalizerValidity(validity) {
    let returnValue;
    switch (validity) {
      case 0 /* ERROR */:
        returnValue = 0 /* FIELD_ERROR */;
        break;
      case 1 /* INVALID */:
        returnValue = 1 /* FIELD_INVALID */;
        break;
      case 2 /* PENDING */:
        returnValue = 2 /* FIELD_PENDING */;
        break;
      case 3 /* VALID_UNFINALIZABLE */:
        returnValue = 3 /* FIELD_VALID_UNFINALIZABLE */;
        break;
      case 4 /* VALID_FINALIZABLE */:
        returnValue = 4 /* VALID_FINALIZING */;
        break;
    }
    return returnValue;
  }
};
var FinalizerValidityTranslatorService = (0, import_undecorated_di7.autowire)(FinalizerValidityTranslatorImpl, FinalizerValidityTranslatorKey);

// src/model/proxies/aggregated-state-changes-proxy-producer-impl.ts
var AggregatedStateChangesProxyProducerImpl = class {
  constructor(fieldStateReducer) {
    this.accessedFieldNames = /* @__PURE__ */ new Set();
    this.fieldStateReducer = fieldStateReducer;
  }
  getProxy(fields) {
    const aggregatedState = {};
    for (const key in fields) {
      aggregatedState[key] = fields[key].state;
    }
    const fieldStateReducer = this.fieldStateReducer;
    const accessedFieldNames = this.accessedFieldNames;
    return new Proxy(aggregatedState, {
      get(target, prop) {
        if (prop === "overallValidity")
          return () => fieldStateReducer.validity;
        else if (prop === "hasOmittedFields")
          return () => fieldStateReducer.omit;
        else {
          const propName = prop.toString();
          if (!(prop in fields) || propName === "constructor")
            return target[propName];
          accessedFieldNames.add(propName);
          const state = target[propName];
          fieldStateReducer.updateTallies(propName, state);
          return target[propName];
        }
      }
    });
  }
};

// src/model/proxies/proxy-producer-factory-impl.ts
var import_undecorated_di8 = require("undecorated-di");
var ProxyProducerFactoryImpl = class {
  constructor(reducerFactory) {
    this._reducerFactory = reducerFactory;
  }
  createAggregatedStateChangesProxyProducer() {
    return new AggregatedStateChangesProxyProducerImpl(
      this._reducerFactory.createFieldStateReducer()
    );
  }
};
var ProxyProducerFactoryService = (0, import_undecorated_di8.autowire)(ProxyProducerFactoryImpl, ProxyProducerFactoryKey, [ReducerFactoryKey]);

// src/model/reducers/field-state/field-state-reducer-impl.ts
var FieldStateReducerImpl = class {
  constructor(validityReducer) {
    this._omittedFields = /* @__PURE__ */ new Set();
    this._validityReducer = validityReducer;
  }
  get validity() {
    return this._validityReducer.validity;
  }
  get omit() {
    return this._omittedFields.size > 0;
  }
  updateTallies(fieldName, state) {
    const { validity, omit } = state;
    this._validityReducer.updateTallies(fieldName, validity);
    if (omit)
      this._omittedFields.add(fieldName);
    else
      this._omittedFields.delete(fieldName);
  }
};

// src/model/reducers/multi-input-validator-validity/finalizer-facing-multi-input-validator-reducer.ts
var import_rxjs7 = require("rxjs");
var FinalizerFacingMultiInputValidatorReducer = class {
  constructor(validityReducer) {
    this._multiInputValidators = [];
    this._validityReducer = validityReducer;
    this.validityChanges = new import_rxjs7.BehaviorSubject(
      this._validityReducer.validity
    );
  }
  get validity() {
    return this._validityReducer.validity;
  }
  addValidator(multiFieldValidator) {
    const validatorId = String(this._multiInputValidators.length);
    this._multiInputValidators.push(multiFieldValidator);
    multiFieldValidator.overallValidityChanges.subscribe(
      (validityChange) => {
        this._validityReducer.updateTallies(validatorId, validityChange);
        this.validityChanges.next(this._validityReducer.validity);
      }
    );
  }
};

// src/model/reducers/finalizer-validity/finalizer-validity-reducer-impl.ts
var FinalizerValidityReducerImpl = class {
  constructor() {
    this._errantFinalizers = /* @__PURE__ */ new Set();
    this._fieldErrorFinalizers = /* @__PURE__ */ new Set();
    this._fieldInvalidFinalizers = /* @__PURE__ */ new Set();
    this._fieldPendingFinalizers = /* @__PURE__ */ new Set();
    this._fieldValidUnfinalizableFinalizers = /* @__PURE__ */ new Set();
    this._finalizingFinalizers = /* @__PURE__ */ new Set();
  }
  get finalizerValidity() {
    if (this._errantFinalizers.size > 0)
      return -1 /* FINALIZER_ERROR */;
    else if (this._fieldErrorFinalizers.size > 0)
      return 0 /* FIELD_ERROR */;
    else if (this._fieldInvalidFinalizers.size > 0)
      return 1 /* FIELD_INVALID */;
    else if (this._fieldPendingFinalizers.size > 0)
      return 2 /* FIELD_PENDING */;
    else if (this._fieldValidUnfinalizableFinalizers.size > 0)
      return 3 /* FIELD_VALID_UNFINALIZABLE */;
    else if (this._finalizingFinalizers.size > 0)
      return 4 /* VALID_FINALIZING */;
    return 5 /* VALID_FINALIZED */;
  }
  updateTallies(finalizerName, finalizerValidity) {
    this._updateTally(
      finalizerName,
      finalizerValidity,
      -1 /* FINALIZER_ERROR */,
      this._errantFinalizers
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      0 /* FIELD_ERROR */,
      this._fieldErrorFinalizers
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      1 /* FIELD_INVALID */,
      this._fieldInvalidFinalizers
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      2 /* FIELD_PENDING */,
      this._fieldPendingFinalizers
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      3 /* FIELD_VALID_UNFINALIZABLE */,
      this._fieldValidUnfinalizableFinalizers
    );
    this._updateTally(
      finalizerName,
      finalizerValidity,
      4 /* VALID_FINALIZING */,
      this._finalizingFinalizers
    );
  }
  _updateTally(finalizerName, actualValidity, expectedValidity, set) {
    if (actualValidity === expectedValidity)
      set.add(finalizerName);
    else
      set.delete(finalizerName);
  }
};

// src/model/reducers/multi-input-validator-validity/user-facing-multi-input-validator-reducer.ts
var import_rxjs8 = require("rxjs");
var UserFacingMultiInputValidatorReducer = class {
  constructor(validityReducer) {
    this._multiInputValidators = [];
    this._validityReducer = validityReducer;
    this.validityChanges = new import_rxjs8.BehaviorSubject(
      this._validityReducer.validity
    );
  }
  get validity() {
    return this._validityReducer.validity;
  }
  addValidator(multiFieldValidator) {
    const validatorId = String(this._multiInputValidators.length);
    this._multiInputValidators.push(multiFieldValidator);
    multiFieldValidator.calculatedValidityChanges.subscribe(
      (validityChange) => {
        this._validityReducer.updateTallies(validatorId, validityChange);
        this.validityChanges.next(this._validityReducer.validity);
      }
    );
  }
};

// src/model/reducers/validity/validity-reducer-impl.ts
var ValidityReducerImpl = class {
  constructor() {
    this._errantFields = /* @__PURE__ */ new Set();
    this._invalidFields = /* @__PURE__ */ new Set();
    this._pendingFields = /* @__PURE__ */ new Set();
    this._validUnfinalizableFields = /* @__PURE__ */ new Set();
  }
  get validity() {
    if (this._errantFields.size > 0)
      return 0 /* ERROR */;
    if (this._invalidFields.size > 0)
      return 1 /* INVALID */;
    if (this._pendingFields.size > 0)
      return 2 /* PENDING */;
    if (this._validUnfinalizableFields.size > 0)
      return 3 /* VALID_UNFINALIZABLE */;
    return 4 /* VALID_FINALIZABLE */;
  }
  updateTallies(elementId, validity) {
    this._updateTally(elementId, validity, 0 /* ERROR */, this._errantFields);
    this._updateTally(
      elementId,
      validity,
      1 /* INVALID */,
      this._invalidFields
    );
    this._updateTally(
      elementId,
      validity,
      2 /* PENDING */,
      this._pendingFields
    );
    this._updateTally(
      elementId,
      validity,
      3 /* VALID_UNFINALIZABLE */,
      this._validUnfinalizableFields
    );
  }
  _updateTally(elementId, actualValidity, expectedValidity, set) {
    if (actualValidity === expectedValidity)
      set.add(elementId);
    else
      set.delete(elementId);
  }
};

// src/model/reducers/reducer-factory-impl.ts
var import_undecorated_di9 = require("undecorated-di");
var ReducerFactoryImpl = class {
  createFieldStateReducer() {
    return new FieldStateReducerImpl(this.createValidityReducer());
  }
  createFinalizerValidityReducer() {
    return new FinalizerValidityReducerImpl();
  }
  createUserMultiInputValidatorValidityReducer() {
    return new UserFacingMultiInputValidatorReducer(
      this.createValidityReducer()
    );
  }
  createFinalizerFacingMultiInputValidatorValidityReducer() {
    return new FinalizerFacingMultiInputValidatorReducer(
      this.createValidityReducer()
    );
  }
  createValidityReducer() {
    return new ValidityReducerImpl();
  }
};
var ReducerFactoryService = (0, import_undecorated_di9.autowire)(ReducerFactoryImpl, ReducerFactoryKey);

// src/model/subjects/on-initial-subscription-handling-behavior-subject-impl.ts
var import_rxjs9 = require("rxjs");
var OnInitialSubscriptionHandlingBehaviorSubjectImpl = class extends import_rxjs9.BehaviorSubject {
  constructor(initialValue, onInitialSubscriptionEventEmitter) {
    super(initialValue);
    this._onInitialSubscriptionEventEmitter = onInitialSubscriptionEventEmitter;
  }
  subscribe(observerOrNext, error, complete) {
    let subscription;
    if (observerOrNext) {
      if (typeof observerOrNext === "function")
        subscription = super.subscribe(observerOrNext, error, complete);
      else
        subscription = super.subscribe(observerOrNext);
    } else
      subscription = super.subscribe();
    this._onInitialSubscriptionEventEmitter.triggerEvent();
    return subscription;
  }
  onInitialSubscription(cb) {
    this._onInitialSubscriptionEventEmitter.onEvent(cb);
  }
};

// src/model/subjects/subject-factory-impl.ts
var import_undecorated_di10 = require("undecorated-di");
var SubjectFactoryImpl = class {
  constructor(emitterFactory) {
    this._emitterFactory = emitterFactory;
  }
  createOnInitialSubscriptionHandlingBehaviorSubject(initialValue) {
    return new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
      initialValue,
      this._emitterFactory.createOneTimeEventEmitter()
    );
  }
};
var SubjectFactoryService = (0, import_undecorated_di10.autowire)(SubjectFactoryImpl, SubjectFactoryKey, [EmitterFactoryKey]);

// src/model/validators/single-input/async-single-input-validator-suite.ts
var import_rxjs10 = require("rxjs");
var AsyncSingleInputValidatorSuite = class {
  constructor(validators, pendingValidatorMessage) {
    this._validatorSubscriptions = {};
    this._validators = validators;
    this._pendingValidatorMessage = pendingValidatorMessage;
  }
  evaluate(value) {
    this._unsubscribeAll();
    const result = {
      syncResult: {
        value,
        validity: 2 /* PENDING */,
        messages: [
          {
            type: "PENDING" /* PENDING */,
            text: this._pendingValidatorMessage
          }
        ]
      }
    };
    result.observable = new import_rxjs10.Observable((subscriber) => {
      const observableResult = {
        value,
        validity: 4 /* VALID_FINALIZABLE */,
        messages: []
      };
      for (let validatorId = 0; validatorId < this._validators.length; validatorId++) {
        const validator = this._validators[validatorId];
        try {
          const promise = validator(value);
          const subscription = (0, import_rxjs10.from)(promise).subscribe(
            this._createValidatorObserver(
              observableResult,
              subscriber,
              validatorId
            )
          );
          this._validatorSubscriptions[validatorId] = subscription;
        } catch (e) {
          this._createValidatorObserverErrorMethod(
            observableResult,
            subscriber
          )(e);
        }
      }
    });
    return result;
  }
  _createValidatorObserver(observableResult, outerSubscriber, validatorId) {
    return {
      next: this._createValidatorObserverNextMethod(
        observableResult,
        outerSubscriber,
        validatorId
      ),
      error: this._createValidatorObserverErrorMethod(
        observableResult,
        outerSubscriber
      )
    };
  }
  _createValidatorObserverNextMethod(observableResult, outerSubscriber, validatorId) {
    const nextMethod = (next) => {
      const { isValid, message: messageTxt } = next;
      if (!isValid) {
        this._unsubscribeAll();
        observableResult.validity = 1 /* INVALID */;
        if (messageTxt) {
          observableResult.messages.push({
            type: "INVALID" /* INVALID */,
            text: messageTxt
          });
        }
        outerSubscriber.next(observableResult);
        outerSubscriber.complete();
      } else {
        if (messageTxt) {
          observableResult.messages.push({
            type: "VALID" /* VALID */,
            text: messageTxt
          });
        }
        this._unsubscribeById(validatorId);
        if (this._allValidatorsCompleted()) {
          outerSubscriber.next(observableResult);
          outerSubscriber.complete();
        }
      }
    };
    return nextMethod;
  }
  _createValidatorObserverErrorMethod(observableResult, outerSubscriber) {
    const errorMethod = (e) => {
      this._unsubscribeAll();
      logErrorInDevMode(e);
      observableResult.validity = 0 /* ERROR */;
      observableResult.messages.push({
        type: "ERROR" /* ERROR */,
        text: config.globalMessages.singleFieldValidationError
      });
      outerSubscriber.next(observableResult);
      outerSubscriber.complete();
    };
    return errorMethod;
  }
  _unsubscribeAll() {
    for (const key in this._validatorSubscriptions) {
      this._validatorSubscriptions[key].unsubscribe();
    }
    this._validatorSubscriptions = {};
  }
  _unsubscribeById(validatorId) {
    this._validatorSubscriptions[validatorId].unsubscribe();
    delete this._validatorSubscriptions[validatorId];
  }
  _allValidatorsCompleted() {
    return Object.keys(this._validatorSubscriptions).length === 0;
  }
};

// src/model/validators/single-input/hybrid-single-input-validator-suite.ts
var HybridSingleInputValidatorSuite = class {
  constructor(syncValidatorSuite, asyncValidatorSuite) {
    this._syncValidatorSuite = syncValidatorSuite;
    this._asyncValidatorSuite = asyncValidatorSuite;
  }
  evaluate(value) {
    const result = this._syncValidatorSuite.evaluate(value);
    if (result.syncResult.validity <= 1 /* INVALID */)
      return result;
    const asyncResult = this._asyncValidatorSuite.evaluate(value);
    return {
      syncResult: {
        value: asyncResult.syncResult.value,
        validity: asyncResult.syncResult.validity,
        messages: [
          ...result.syncResult.messages,
          ...asyncResult.syncResult.messages
        ]
      },
      observable: asyncResult.observable
    };
  }
};

// src/model/validators/single-input/sync-single-input-validator-suite.ts
var SyncSingleInputValidatorSuite = class {
  constructor(validators) {
    this._validators = validators;
  }
  evaluate(value) {
    return {
      syncResult: this._evaluateSync(value)
    };
  }
  _evaluateSync(value) {
    const result = {
      value,
      validity: 4 /* VALID_FINALIZABLE */,
      messages: []
    };
    try {
      for (const validator of this._validators) {
        const { isValid, message: messageTxt } = validator(value);
        if (!isValid)
          result.validity = 1 /* INVALID */;
        if (messageTxt) {
          result.messages.push({
            type: isValid ? "VALID" /* VALID */ : "INVALID" /* INVALID */,
            text: messageTxt
          });
        }
      }
    } catch (e) {
      logErrorInDevMode(e);
      result.validity = 0 /* ERROR */;
      result.messages.push({
        type: "ERROR" /* ERROR */,
        text: config.globalMessages.singleFieldValidationError
      });
    }
    return result;
  }
};

// src/model/validators/single-input/single-input-validator-suite-factory-impl.ts
var import_undecorated_di11 = require("undecorated-di");
var SingleInputValidatorSuiteFactoryImpl = class {
  createSingleInputValidatorSuite(syncValidators, asyncValidators, pendingAsyncValidatorMessage = config.globalMessages.pendingAsyncValidatorSuite) {
    const syncValidatorSuite = new SyncSingleInputValidatorSuite(
      syncValidators
    );
    if (asyncValidators.length > 0) {
      const asyncValidatorSuite = new AsyncSingleInputValidatorSuite(
        asyncValidators,
        pendingAsyncValidatorMessage
      );
      if (syncValidators.length > 0)
        return new HybridSingleInputValidatorSuite(
          syncValidatorSuite,
          asyncValidatorSuite
        );
      else
        return asyncValidatorSuite;
    } else
      return syncValidatorSuite;
  }
};
var SingleInputValidatorSuiteFactoryService = (0, import_undecorated_di11.autowire)(SingleInputValidatorSuiteFactoryImpl, SingleInputValidatorSuiteFactoryKey);

// src/model/insertion-order-heap/insertion-order-heap-factory.interface.ts
var InsertionOrderHeapFactoryKey = "InsertionOrderHeapFactory";

// src/model/insertion-order-heap/insertion-order-heap-factory-impl.ts
var import_undecorated_di12 = require("undecorated-di");

// src/model/insertion-order-heap/insertion-order-heap-impl.ts
var InsertionOrderHeapImpl = class {
  constructor() {
    this._heap = [];
    this._elementDictionary = {};
    this._currentPriorityId = 0;
  }
  get size() {
    return this._heap.length;
  }
  get topValue() {
    var _a;
    return (_a = this._heap[0]) == null ? void 0 : _a.value;
  }
  addValue(value) {
    const elementDictionaryKey = value;
    if (!(elementDictionaryKey in this._elementDictionary)) {
      this._elementDictionary[elementDictionaryKey] = {
        priorityId: this._currentPriorityId++,
        currentHeapIndex: -1
      };
    }
    const dictionaryValue = this._elementDictionary[elementDictionaryKey];
    if (dictionaryValue.currentHeapIndex >= 0)
      return;
    const heapElement = {
      priorityId: dictionaryValue.priorityId,
      value
    };
    this._addHeapElement(heapElement);
  }
  removeValue(value) {
    const heapIndex = this._elementDictionary[value].currentHeapIndex;
    this._removeHeapElementAtIndex(heapIndex);
  }
  _addHeapElement(heapElement) {
    this._heap.push(heapElement);
    const heapIndex = this.size - 1;
    this._elementDictionary[heapElement.value].currentHeapIndex = heapIndex;
    this._heapifyUp(heapIndex);
  }
  _removeHeapElementAtIndex(heapIndex) {
    if (this.size === 0 || heapIndex === -1)
      return;
    if (heapIndex === this.size - 1) {
      const removedElement = this._heap[heapIndex];
      this._heap.pop();
      this._elementDictionary[removedElement.value].currentHeapIndex = -1;
    } else {
      const removedElement = this._heap[heapIndex];
      const elevatedElement = this._heap[heapIndex] = this._heap[this.size - 1];
      this._elementDictionary[removedElement.value].currentHeapIndex = -1;
      this._elementDictionary[elevatedElement.value].currentHeapIndex = heapIndex;
      this._heapifyDown(heapIndex);
    }
  }
  _heapifyDown(heapIndex) {
    const _leftChild = this._leftChild(heapIndex);
    const _rightChild = this._rightChild(heapIndex);
    let smallest = heapIndex;
    if (_leftChild < this.size && this._compareHeapElements(this._heap[_leftChild], this._heap[smallest]) < 0) {
      smallest = _leftChild;
    }
    if (_rightChild < this.size && this._compareHeapElements(this._heap[_rightChild], this._heap[smallest]) < 0) {
      smallest = _rightChild;
    }
    if (smallest != heapIndex) {
      const element = this._heap[heapIndex];
      const smallestElement = this._heap[smallest];
      this._elementDictionary[element.value].currentHeapIndex = smallest;
      this._elementDictionary[smallestElement.value].currentHeapIndex = heapIndex;
      this._heap[heapIndex] = smallestElement;
      this._heap[smallest] = element;
      this._heapifyDown(smallest);
    }
  }
  _heapifyUp(heapIndex) {
    while (heapIndex != 0 && this._compareHeapElements(
      this._heap[this._parent(heapIndex)],
      this._heap[heapIndex]
    ) > 0) {
      const temp = this._heap[this._parent(heapIndex)];
      this._heap[this._parent(heapIndex)] = this._heap[heapIndex];
      this._heap[heapIndex] = temp;
      this._elementDictionary[this._heap[this._parent(heapIndex)].value].currentHeapIndex = this._parent(heapIndex);
      this._elementDictionary[this._heap[heapIndex].value].currentHeapIndex = heapIndex;
      heapIndex = this._parent(heapIndex);
    }
  }
  _parent(heapIndex) {
    return Math.floor((heapIndex - 1) / 2);
  }
  _leftChild(heapIndex) {
    return heapIndex * 2 + 1;
  }
  _rightChild(heapIndex) {
    return heapIndex * 2 + 2;
  }
  _compareHeapElements(a, b) {
    return a.priorityId - b.priorityId;
  }
};

// src/model/insertion-order-heap/insertion-order-heap-factory-impl.ts
var InsertionOrderHeapFactoryImpl = class {
  createInsertionOrderHeap() {
    return new InsertionOrderHeapImpl();
  }
};
var InsertionOrderHeapFactoryService = (0, import_undecorated_di12.autowire)(InsertionOrderHeapFactoryImpl, InsertionOrderHeapFactoryKey);

// src/model/trackers/tracker-factory.interface.ts
var TrackerFactoryKey = "TrackerFactory";

// src/model/trackers/first-nonvalid-form-element-tracker-impl.ts
var import_rxjs11 = require("rxjs");
var FirstNonValidFormElementTrackerImpl = class {
  constructor(nonValidFormElementHeap) {
    this._nonValidFormElementHeap = nonValidFormElementHeap;
    this.firstNonValidFormElementChanges = new import_rxjs11.BehaviorSubject(
      this.firstNonValidFormElement
    );
  }
  get firstNonValidFormElement() {
    return this._nonValidFormElementHeap.topValue;
  }
  trackFormElementValidity(formElementKey, formElement) {
    this._nonValidFormElementHeap.addValue(formElementKey);
    formElement.stateChanges.subscribe(({ validity }) => {
      if (validity < 4 /* VALID_FINALIZABLE */) {
        this._nonValidFormElementHeap.addValue(formElementKey);
      } else
        this._nonValidFormElementHeap.removeValue(formElementKey);
      this.firstNonValidFormElementChanges.next(this.firstNonValidFormElement);
    });
  }
};

// src/model/trackers/tracker-factory-impl.ts
var import_undecorated_di13 = require("undecorated-di");
var TrackerFactoryImpl = class {
  constructor(insertionOrderHeapFactory) {
    this._insertionOrderHeapFactory = insertionOrderHeapFactory;
  }
  createFirstNonValidFormElementTracker() {
    return new FirstNonValidFormElementTrackerImpl(
      this._insertionOrderHeapFactory.createInsertionOrderHeap()
    );
  }
};
var TrackerFactoryService = (0, import_undecorated_di13.autowire)(TrackerFactoryImpl, TrackerFactoryKey, [InsertionOrderHeapFactoryKey]);

// src/model/validators/multi-input/multi-input-validator-factory-impl.ts
var import_undecorated_di14 = require("undecorated-di");

// src/model/validators/multi-input/async-multi-input-validator.ts
var import_rxjs12 = require("rxjs");
var AsyncMultiInputValidator = class {
  constructor(multiFieldAggregator, validator, pendingMessage) {
    this._firstRunCompleted = false;
    this._validator = validator;
    this._multiFieldAggregator = multiFieldAggregator;
    this._pendingMessage = pendingMessage;
    this.accessedFields = multiFieldAggregator.accessedFields;
    this.calculatedValidityChanges = new import_rxjs12.ReplaySubject(1);
    this.overallValidityChanges = new import_rxjs12.ReplaySubject(1);
    this.messageChanges = new import_rxjs12.ReplaySubject(1);
    this._multiFieldAggregator.aggregateChanges.subscribe(
      (aggregateChange) => {
        this._validatorSubscription && this._validatorSubscription.unsubscribe();
        let observableResult;
        let error;
        if (!this._firstRunCompleted) {
          try {
            observableResult = (0, import_rxjs12.from)(this._validator(aggregateChange));
          } catch (e) {
            logErrorInDevMode(e);
            error = e;
          } finally {
            this._firstRunCompleted = true;
          }
        }
        if (aggregateChange.hasOmittedFields()) {
          this.calculatedValidityChanges.next(4 /* VALID_FINALIZABLE */);
          this.overallValidityChanges.next(4 /* VALID_FINALIZABLE */);
          this.messageChanges.next(null);
        } else if (aggregateChange.overallValidity() < 4 /* VALID_FINALIZABLE */) {
          this.calculatedValidityChanges.next(4 /* VALID_FINALIZABLE */);
          this.overallValidityChanges.next(aggregateChange.overallValidity());
          this.messageChanges.next(null);
        } else if (error) {
          this.calculatedValidityChanges.next(0 /* ERROR */);
          this.overallValidityChanges.next(0 /* ERROR */);
          this.messageChanges.next({
            type: "ERROR" /* ERROR */,
            text: config.globalMessages.multiFieldValidationError
          });
        } else {
          this.calculatedValidityChanges.next(2 /* PENDING */);
          this.overallValidityChanges.next(2 /* PENDING */);
          this.messageChanges.next({
            type: "PENDING" /* PENDING */,
            //
            text: this._pendingMessage
          });
          try {
            if (!observableResult)
              observableResult = (0, import_rxjs12.from)(this._validator(aggregateChange));
            this._validatorSubscription = observableResult.subscribe({
              next: (result) => {
                const validity = result.isValid ? 4 /* VALID_FINALIZABLE */ : 1 /* INVALID */;
                this.calculatedValidityChanges.next(validity);
                this.overallValidityChanges.next(validity);
                if (result.message) {
                  const message = {
                    type: result.isValid ? "VALID" /* VALID */ : "INVALID" /* INVALID */,
                    text: result.message
                  };
                  this.messageChanges.next(message);
                } else
                  this.messageChanges.next(null);
              },
              error: (e) => {
                logErrorInDevMode(e);
                this.calculatedValidityChanges.next(0 /* ERROR */);
                this.overallValidityChanges.next(0 /* ERROR */);
                this.messageChanges.next({
                  type: "ERROR" /* ERROR */,
                  text: config.globalMessages.multiFieldValidationError
                });
              }
            });
          } catch (e) {
            logErrorInDevMode(e);
            this.calculatedValidityChanges.next(0 /* ERROR */);
            this.overallValidityChanges.next(0 /* ERROR */);
            this.messageChanges.next({
              type: "ERROR" /* ERROR */,
              text: config.globalMessages.multiFieldValidationError
            });
          }
        }
      }
    );
  }
};

// src/model/validators/multi-input/multi-input-validator-factory.interface.ts
var MultiInputValidatorFactoryKey = "MultiInputValidatorFactory";

// src/model/validators/multi-input/sync-multi-input-validator.ts
var import_rxjs13 = require("rxjs");
var SyncMultiInputValidator = class {
  constructor(multiFieldAggregator, validator) {
    this._completedFirstRun = false;
    this._validator = validator;
    this._multiFieldAggregator = multiFieldAggregator;
    this.accessedFields = multiFieldAggregator.accessedFields;
    this.calculatedValidityChanges = new import_rxjs13.ReplaySubject(1);
    this.overallValidityChanges = new import_rxjs13.ReplaySubject(1);
    this.messageChanges = new import_rxjs13.ReplaySubject(1);
    this._multiFieldAggregator.aggregateChanges.subscribe(
      (aggregateChange) => {
        let result;
        if (!this._completedFirstRun) {
          result = this._runValidator(aggregateChange);
          this._completedFirstRun = true;
        }
        if (aggregateChange.hasOmittedFields()) {
          this.calculatedValidityChanges.next(4 /* VALID_FINALIZABLE */);
          this.overallValidityChanges.next(4 /* VALID_FINALIZABLE */);
          this.messageChanges.next(null);
        } else if (aggregateChange.overallValidity() < 4 /* VALID_FINALIZABLE */) {
          this.calculatedValidityChanges.next(4 /* VALID_FINALIZABLE */);
          this.overallValidityChanges.next(aggregateChange.overallValidity());
          this.messageChanges.next(null);
        } else if (result) {
          this.calculatedValidityChanges.next(result.validity);
          this.overallValidityChanges.next(result.validity);
          this.messageChanges.next(result.message);
        } else {
          result = this._runValidator(aggregateChange);
          this.calculatedValidityChanges.next(result.validity);
          this.overallValidityChanges.next(result.validity);
          this.messageChanges.next(result.message);
        }
      }
    );
  }
  _runValidator(aggregateChange) {
    try {
      let message;
      const result = this._validator(aggregateChange);
      const validity = result.isValid ? 4 /* VALID_FINALIZABLE */ : 1 /* INVALID */;
      if (result.message) {
        message = {
          type: result.isValid ? "VALID" /* VALID */ : "INVALID" /* INVALID */,
          text: result.message
        };
      } else
        message = null;
      return {
        validity,
        message
      };
    } catch (e) {
      logErrorInDevMode(e);
      return {
        validity: 0 /* ERROR */,
        message: {
          type: "ERROR" /* ERROR */,
          text: config.globalMessages.multiFieldValidationError
        }
      };
    }
  }
};

// src/model/validators/multi-input/multi-input-validator-factory-impl.ts
var MultiInputValidatorFactoryImpl = class {
  constructor(aggregatorFactory) {
    this._aggregatorFactory = aggregatorFactory;
  }
  createSyncMultiInputValidator(validator, fields) {
    const multiFieldAggregator = this._aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new SyncMultiInputValidator(multiFieldAggregator, validator);
  }
  createAsyncMultiInputValidator(validator, fields, pendingMessage = config.globalMessages.pendingAsyncMultiFieldValidator) {
    const multiFieldAggregator = this._aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new AsyncMultiInputValidator(
      multiFieldAggregator,
      validator,
      pendingMessage
    );
  }
};
var MultiInputValidatorFactoryService = (0, import_undecorated_di14.autowire)(MultiInputValidatorFactoryImpl, MultiInputValidatorFactoryKey, [
  AggregatorFactoryKey
]);

// src/model/form-elements/multi-input-validated/finalizer-facing-multi-input-validated-form-element.ts
var import_rxjs14 = require("rxjs");
var FinalizerFacingMultiInputValidatedFormElement = class {
  get state() {
    return __spreadProps(__spreadValues({}, copyObject(this._baseFormElement.state)), {
      validity: this._calculateValidity()
    });
  }
  get omit() {
    return this._baseFormElement.omit;
  }
  constructor(baseFormElement, finalizerFacingMultiInputValidityReducer) {
    this._baseFormElement = baseFormElement;
    this._multiInputValidatorReducer = finalizerFacingMultiInputValidityReducer;
    this._multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new import_rxjs14.BehaviorSubject(this.state);
  }
  addValidator(validator) {
    this._multiInputValidatorReducer.addValidator(validator);
  }
  _calculateValidity() {
    return Math.min(
      this._baseFormElement.state.validity,
      this._multiInputValidatorReducer.validity
    );
  }
};

// src/model/form-elements/multi-input-validated/multi-input-validated-form-element-factory.interface.ts
var MultiInputValidatedFormElementFactoryKey = "MultiInputValidatedFormElementFactory";

// src/model/form-elements/multi-input-validated/user-facing-multi-input-validated-dual-field.ts
var import_rxjs15 = require("rxjs");
var UserFacingMultiInputValidatedDualField = class extends AbstractDualField {
  constructor(baseField, multiInputValidityReducer) {
    super();
    this._baseField = baseField;
    this._multiInputValidatorReducer = multiInputValidityReducer;
    this._baseField.stateChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this._multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new import_rxjs15.BehaviorSubject(this.state);
  }
  get state() {
    return __spreadProps(__spreadValues({}, copyObject(this._baseField.state)), {
      validity: this._calculateValidity()
    });
  }
  get omit() {
    return this._baseField.omit;
  }
  set omit(omit) {
    this._baseField.omit = omit;
  }
  get interactions() {
    return this._baseField.interactions;
  }
  get interactionsChanges() {
    return this._baseField.interactionsChanges;
  }
  get primaryField() {
    return this._baseField.primaryField;
  }
  get secondaryField() {
    return this._baseField.secondaryField;
  }
  set useSecondaryField(useSecondaryField) {
    this._baseField.useSecondaryField = useSecondaryField;
  }
  get useSecondaryField() {
    return this._baseField.useSecondaryField;
  }
  setValue(value) {
    this._baseField.setValue(value);
  }
  setState(state) {
    this._baseField.setState(state);
  }
  reset() {
    this._baseField.reset();
  }
  addValidator(validator) {
    this._multiInputValidatorReducer.addValidator(validator);
  }
  _calculateValidity() {
    return Math.min(
      this._baseField.state.validity,
      this._multiInputValidatorReducer.validity
    );
  }
};

// src/model/form-elements/multi-input-validated/user-facing-multi-input-validated-field.ts
var import_rxjs16 = require("rxjs");
var UserFacingMultiInputValidatedField = class extends AbstractField {
  constructor(baseField, userFacingMultiInputValidityReducer) {
    super();
    this._baseField = baseField;
    this._multiInputValidatorReducer = userFacingMultiInputValidityReducer;
    this._multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new import_rxjs16.BehaviorSubject(this.state);
  }
  get state() {
    return __spreadProps(__spreadValues({}, copyObject(this._baseField.state)), {
      validity: this._calculateValidity()
    });
  }
  get interactions() {
    return this._baseField.interactions;
  }
  set interactions(interactions) {
    this._baseField.interactions = interactions;
  }
  get interactionsChanges() {
    return this._baseField.interactionsChanges;
  }
  get omit() {
    return this._baseField.omit;
  }
  set omit(omit) {
    this._baseField.omit = omit;
  }
  setState(state) {
    this._baseField.setState(state);
  }
  setValue(value) {
    this._baseField.setValue(value);
  }
  reset() {
    this._baseField.reset();
  }
  addValidator(validator) {
    this._multiInputValidatorReducer.addValidator(validator);
  }
  _calculateValidity() {
    return Math.min(
      this._baseField.state.validity,
      this._multiInputValidatorReducer.validity
    );
  }
};

// src/model/form-elements/multi-input-validated/user-facing-multi-input-validated-nested-form.ts
var import_rxjs17 = require("rxjs");

// src/model/forms/abstract-nested-form.ts
var AbstractNestedForm = class {
};

// src/model/form-elements/multi-input-validated/user-facing-multi-input-validated-nested-form.ts
var UserFacingMultiInputValidatedNestedForm = class extends AbstractNestedForm {
  constructor(baseNestedForm, userFacingMultiInputValidityReducer) {
    super();
    this._baseNestedForm = baseNestedForm;
    this._multiInputValidatorReducer = userFacingMultiInputValidityReducer;
    this._baseNestedForm.stateChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this._multiInputValidatorReducer.validityChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new import_rxjs17.BehaviorSubject(this.state);
  }
  get userFacingFields() {
    return this._baseNestedForm.userFacingFields;
  }
  get state() {
    return __spreadProps(__spreadValues({}, copyObject(this._baseNestedForm.state)), {
      validity: this._calculateValidity()
    });
  }
  set omit(omit) {
    this._baseNestedForm.omit = omit;
  }
  get omit() {
    return this._baseNestedForm.omit;
  }
  get firstNonValidFormElement() {
    return this._baseNestedForm.firstNonValidFormElement;
  }
  get firstNonValidFormElementChanges() {
    return this._baseNestedForm.firstNonValidFormElementChanges;
  }
  reset() {
    throw new Error("Method not implemented.");
  }
  addValidator(validator) {
    this._multiInputValidatorReducer.addValidator(validator);
  }
  _calculateValidity() {
    return Math.min(
      this._baseNestedForm.state.validity,
      this._multiInputValidatorReducer.validity
    );
  }
};

// src/model/form-elements/multi-input-validated/multi-input-validated-form-element-factory-impl.ts
var import_undecorated_di15 = require("undecorated-di");
var MultiInputValidatedFormElementFactoryImpl = class {
  constructor(reducerFactory) {
    this._reducerFactory = reducerFactory;
  }
  createUserAndFinalizerFacingMultiInputValidatedFormElement(baseField) {
    const userFacingReducer = this._reducerFactory.createUserMultiInputValidatorValidityReducer();
    const finalizerFacingReducer = this._reducerFactory.createFinalizerFacingMultiInputValidatorValidityReducer();
    const finalizerFacingFormElement = new FinalizerFacingMultiInputValidatedFormElement(
      baseField,
      finalizerFacingReducer
    );
    if (baseField instanceof AbstractNestedForm) {
      const userFacingNestedForm = new UserFacingMultiInputValidatedNestedForm(
        baseField,
        userFacingReducer
      );
      return [userFacingNestedForm, finalizerFacingFormElement];
    } else if (baseField instanceof AbstractDualField) {
      const userFacingDualField = new UserFacingMultiInputValidatedDualField(
        baseField,
        userFacingReducer
      );
      return [userFacingDualField, finalizerFacingFormElement];
    } else {
      const userFacingField = new UserFacingMultiInputValidatedField(
        baseField,
        userFacingReducer
      );
      return [userFacingField, finalizerFacingFormElement];
    }
  }
};
var MultiInputValidatedFormElementFactoryService = (0, import_undecorated_di15.autowire)(
  MultiInputValidatedFormElementFactoryImpl,
  MultiInputValidatedFormElementFactoryKey,
  [ReducerFactoryKey]
);

// src/model/templates/multi-field-validators/multi-field-validators-template-parser-impl.ts
var import_undecorated_di16 = require("undecorated-di");

// src/model/templates/multi-field-validators/multi-field-validators-template-parser.interface.ts
var MultiFieldValidatorsTemplateParserKey = "MultiFieldValidatorsTemplateParser";

// src/model/fields/auto-transformed/auto-transformed-field-factory.interface.ts
var AutoTransformedFieldFactoryKey = "AutoTransformedFieldFactory";

// src/model/templates/multi-field-validators/multi-field-validators-template-parser-impl.ts
var MultiFieldValidatorsTemplateParserImpl = class {
  constructor(multiInputValidatorFactory, multiInputValidatedFormElementFactory, aggregatorFactory, autoTransformedFieldFactory) {
    this._multiInputValidatorFactory = multiInputValidatorFactory;
    this._multiInputValidatedFormElementFactory = multiInputValidatedFormElementFactory;
    this._aggregatorFactory = aggregatorFactory;
    this._autoTransformedFieldFactory = autoTransformedFieldFactory;
  }
  parseTemplate(template, formElementDictionary) {
    var _a, _b;
    const userFacingMultiInputValidatedFormElementDictionary = {};
    const finalizerFacingMultiInputValidatedFormElementDictionary = {};
    const validators = [];
    (_a = template.sync) == null ? void 0 : _a.forEach((validatorFn) => {
      const multiInputValidator = this._multiInputValidatorFactory.createSyncMultiInputValidator(
        validatorFn,
        formElementDictionary
      );
      multiInputValidator.accessedFields.onValue(
        this._onAccessedFields(
          userFacingMultiInputValidatedFormElementDictionary,
          finalizerFacingMultiInputValidatedFormElementDictionary,
          formElementDictionary,
          multiInputValidator
        )
      );
      validators.push(multiInputValidator);
    });
    (_b = template.async) == null ? void 0 : _b.forEach((validatorTemplate) => {
      var _a2;
      const multiInputValidator = this._multiInputValidatorFactory.createAsyncMultiInputValidator(
        validatorTemplate.validatorFn,
        formElementDictionary,
        (_a2 = validatorTemplate.pendingValidatorMessage) != null ? _a2 : config.globalMessages.pendingAsyncMultiFieldValidator
      );
      multiInputValidator.accessedFields.onValue(
        this._onAccessedFields(
          userFacingMultiInputValidatedFormElementDictionary,
          finalizerFacingMultiInputValidatedFormElementDictionary,
          formElementDictionary,
          multiInputValidator
        )
      );
      validators.push(multiInputValidator);
    });
    const userFacingFormElementDictionary = userFacingMultiInputValidatedFormElementDictionary;
    const finalizerFacingFormElementDictionary = finalizerFacingMultiInputValidatedFormElementDictionary;
    for (const [fieldName, field] of Object.entries(formElementDictionary)) {
      if (!(fieldName in userFacingFormElementDictionary)) {
        userFacingFormElementDictionary[fieldName] = field;
        finalizerFacingFormElementDictionary[fieldName] = field;
      }
    }
    for (const [fieldName, field] of Object.entries(
      finalizerFacingFormElementDictionary
    )) {
      if (userFacingFormElementDictionary[fieldName] instanceof AbstractField) {
        finalizerFacingFormElementDictionary[fieldName] = this._autoTransformedFieldFactory.createAutoTransformedField(
          field
        );
      }
    }
    const multiInputValidatorMessagesAggregator = this._aggregatorFactory.createMultiInputValidatorMessagesAggregatorFromValidators(
      validators
    );
    return [
      userFacingFormElementDictionary,
      finalizerFacingFormElementDictionary,
      multiInputValidatorMessagesAggregator
    ];
  }
  _onAccessedFields(userFacingFormElementDictionary, finalizerFacingFormElementDictionary, formElementDictionary, validator) {
    return (accessedFields) => {
      accessedFields.forEach((fieldName) => {
        if (!(fieldName in userFacingFormElementDictionary)) {
          const baseField = formElementDictionary[fieldName];
          const [userFacingField, finalizerFacingField] = this._multiInputValidatedFormElementFactory.createUserAndFinalizerFacingMultiInputValidatedFormElement(
            baseField
          );
          userFacingFormElementDictionary[fieldName] = userFacingField;
          finalizerFacingFormElementDictionary[fieldName] = finalizerFacingField;
        }
        userFacingFormElementDictionary[fieldName].addValidator(validator);
        finalizerFacingFormElementDictionary[fieldName].addValidator(validator);
      });
    };
  }
};
var MultiFieldValidatorsTemplateParserService = (0, import_undecorated_di16.autowire)(
  MultiFieldValidatorsTemplateParserImpl,
  MultiFieldValidatorsTemplateParserKey,
  [
    MultiInputValidatorFactoryKey,
    MultiInputValidatedFormElementFactoryKey,
    AggregatorFactoryKey,
    AutoTransformedFieldFactoryKey
  ]
);

// src/model/finalizers/finalizer-manager-factory-impl.ts
var import_undecorated_di17 = require("undecorated-di");

// src/model/finalizers/finalizer-manager-factory.interface.ts
var FinalizerManagerFactoryKey = "FinalizerManager";

// src/model/finalizers/finalizer-manager-impl.ts
var import_rxjs18 = require("rxjs");
var FinalizerManagerImpl = class {
  constructor(finalizerMap, finalizerValidityReducer, finalizerValidityTranslator) {
    this._value = {};
    this._finalizerMap = finalizerMap;
    this._finalizerValidityReducer = finalizerValidityReducer;
    this._finalizerValidityTranslator = finalizerValidityTranslator;
    for (const finalizerName in this._finalizerMap) {
      const finalizer = this._finalizerMap[finalizerName];
      finalizer.stream.subscribe((finalizerStateChange) => {
        this._finalizerValidityReducer.updateTallies(
          finalizerName,
          finalizerStateChange.finalizerValidity
        );
        delete this._value[finalizerName];
        if (finalizerStateChange.value)
          this._value[finalizerName] = finalizerStateChange.value;
        if (this.stateChanges)
          this.stateChanges.next(this.state);
      });
    }
    this.stateChanges = new import_rxjs18.BehaviorSubject(this.state);
  }
  get state() {
    return {
      value: copyObject(this._value),
      validity: this._getValidity(),
      messages: this._getMessages()
    };
  }
  _getValidity() {
    const reducedFinalizerValidity = this._finalizerValidityReducer.finalizerValidity;
    return this._finalizerValidityTranslator.translateFinalizerValidityToValidity(
      reducedFinalizerValidity
    );
  }
  _getMessages() {
    const messages = [];
    const reducedFinalizerValidity = this._finalizerValidityReducer.finalizerValidity;
    if (reducedFinalizerValidity === -1 /* FINALIZER_ERROR */) {
      messages.push({
        type: "ERROR" /* ERROR */,
        text: config.globalMessages.finalizerError
      });
    } else if (reducedFinalizerValidity === 4 /* VALID_FINALIZING */) {
      messages.push({
        type: "PENDING" /* PENDING */,
        text: config.globalMessages.finalizerPending
      });
    }
    return messages;
  }
};

// src/model/finalizers/finalizer-manager-factory-impl.ts
var FinalizerManagerFactoryImpl = class {
  constructor(reducerFactory, finalizerValidityTranslator) {
    this._reducerFactory = reducerFactory;
    this._finalizerValidityTranslator = finalizerValidityTranslator;
  }
  createFinalizerManager(finalizerDictionary) {
    const finalizerValidityReducer = this._reducerFactory.createFinalizerValidityReducer();
    return new FinalizerManagerImpl(
      finalizerDictionary,
      finalizerValidityReducer,
      this._finalizerValidityTranslator
    );
  }
};
var FinalizerManagerFactoryService = (0, import_undecorated_di17.autowire)(FinalizerManagerFactoryImpl, FinalizerManagerFactoryKey, [
  ReducerFactoryKey,
  FinalizerValidityTranslatorKey
]);

// src/model/finalizers/finalizer-factory-impl.ts
var import_undecorated_di18 = require("undecorated-di");

// src/model/finalizers/async-finalizer.ts
var AsyncFinalizer = class extends AsyncAdapter {
  constructor(finalizerFn, aggregator) {
    super(finalizerFn, aggregator);
    this.accessedFields = aggregator.accessedFields;
  }
};

// src/model/finalizers/default-finalizer.ts
var import_rxjs19 = require("rxjs");
var DefaultFinalizer = class {
  constructor(field, finalizerValidityTranslator) {
    this._field = field;
    this._finalizerValidityTranslator = finalizerValidityTranslator;
    this._field.stateChanges.subscribe((stateChange) => {
      var _a;
      (_a = this.stream) == null ? void 0 : _a.next(this._getFinalizerState(stateChange));
    });
    this.stream = new import_rxjs19.BehaviorSubject(
      this._getFinalizerState(this._field.state)
    );
  }
  _getFinalizerState(fieldState) {
    if (fieldState.validity < 4 /* VALID_FINALIZABLE */)
      return {
        finalizerValidity: this._finalizerValidityTranslator.translateValidityToFinalizerValidity(
          fieldState.validity
        )
      };
    return {
      finalizerValidity: 5 /* VALID_FINALIZED */,
      value: fieldState.value
    };
  }
};

// src/model/finalizers/finalizer-factory.interface.ts
var FinalizerFactoryKey = "FinalizerFactory";

// src/model/finalizers/sync-finalizer.ts
var SyncFinalizer = class extends SyncAdapter {
  constructor(finalizerFn, aggregator) {
    super(finalizerFn, aggregator);
    this.accessedFields = aggregator.accessedFields;
  }
};

// src/model/finalizers/finalizer-factory-impl.ts
var FinalizerFactoryImpl = class {
  constructor(aggregatorFactory, finalizerValidityTranslator) {
    this._aggregatorFactory = aggregatorFactory;
    this._finalizerValidityTranslator = finalizerValidityTranslator;
  }
  createSyncFinalizer(finalizerFn, fields) {
    const aggregator = this._aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new SyncFinalizer(finalizerFn, aggregator);
  }
  createAsyncFinalizer(finalizerFn, fields) {
    const aggregator = this._aggregatorFactory.createMultiFieldAggregatorFromFields(fields);
    return new AsyncFinalizer(finalizerFn, aggregator);
  }
  createDefaultFinalizer(baseField) {
    return new DefaultFinalizer(baseField, this._finalizerValidityTranslator);
  }
};
var FinalizerFactoryService = (0, import_undecorated_di18.autowire)(FinalizerFactoryImpl, FinalizerFactoryKey, [
  AggregatorFactoryKey,
  FinalizerValidityTranslatorKey
]);

// src/model/submission/submission-manager-factory-impl.ts
var import_undecorated_di19 = require("undecorated-di");

// src/model/submission/submission-manager-factory.interface.ts
var SubmissionManagerFactoryKey = "SubmissionManagerFactory";

// src/model/submission/submission-manager-impl.ts
var import_rxjs20 = require("rxjs");
var SubmissionManagerImpl = class {
  constructor(submitFn) {
    this._submissionState = {
      submissionAttempted: false
    };
    this.submissionStateChanges = new import_rxjs20.BehaviorSubject(this.submissionState);
    this._submitFn = submitFn;
  }
  set submissionState(submissionState) {
    this._submissionState = submissionState;
    this.submissionStateChanges.next(this.submissionState);
  }
  get submissionState() {
    return copyObject(this._submissionState);
  }
  submit(state) {
    this.submissionState = {
      submissionAttempted: true
    };
    return new Promise((resolve, reject) => {
      if (state.validity < 4 /* VALID_FINALIZABLE */) {
        this.submissionState = __spreadProps(__spreadValues({}, this._submissionState), {
          message: {
            type: "INVALID" /* INVALID */,
            text: config.globalMessages.submissionFailed
          }
        });
        reject(new Error(config.globalMessages.submissionFailed));
      } else {
        this._submitFn(state).then((res) => {
          resolve(res);
        }).catch((e) => {
          if (e.message)
            this.submissionState = __spreadProps(__spreadValues({}, this._submissionState), {
              message: {
                type: "ERROR" /* ERROR */,
                text: e.message
              }
            });
          reject(e);
        });
      }
    });
  }
  clearMessage() {
    this.submissionState = {
      submissionAttempted: this.submissionState.submissionAttempted
    };
  }
  reset() {
    this.submissionState = {
      submissionAttempted: false
    };
  }
};

// src/model/submission/submission-manager-factory-impl.ts
var SubmissionManagerFactoryImpl = class {
  createSubmissionManager(submitFn) {
    return new SubmissionManagerImpl(submitFn);
  }
};
var SubmissionManagerFactoryService = (0, import_undecorated_di19.autowire)(SubmissionManagerFactoryImpl, SubmissionManagerFactoryKey);

// src/model/templates/forms/nested-form-template-parser-impl.ts
var import_undecorated_di20 = require("undecorated-di");

// src/model/forms/nested-form.ts
var import_rxjs21 = require("rxjs");
var NestedForm = class extends AbstractNestedForm {
  constructor(userFacingFields, firstNonValidFormElementTracker, finalizerManager, multiFieldValidatorMessagesAggregator, omitByDefault) {
    super();
    this.userFacingFields = userFacingFields;
    this._firstNonValidFormElementTracker = firstNonValidFormElementTracker;
    this._finalizerManager = finalizerManager;
    this._multiFieldValidatorMessagesAggregator = multiFieldValidatorMessagesAggregator;
    this._omitByDefault = omitByDefault;
    this._omit = this._omitByDefault;
    this._multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(
      () => {
        var _a;
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
      }
    );
    this._finalizerManager.stateChanges.subscribe(() => {
      var _a;
      if (this.stateChanges)
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
    });
    this.stateChanges = new import_rxjs21.BehaviorSubject(this.state);
  }
  get state() {
    return copyObject(__spreadProps(__spreadValues({}, this._finalizerManager.state), {
      messages: [
        ...this._multiFieldValidatorMessagesAggregator.messages,
        ...this._finalizerManager.state.messages
      ],
      omit: this._omit
    }));
  }
  get firstNonValidFormElement() {
    return this._firstNonValidFormElementTracker.firstNonValidFormElement;
  }
  get firstNonValidFormElementChanges() {
    return this._firstNonValidFormElementTracker.firstNonValidFormElementChanges;
  }
  set omit(omit) {
    this._omit = omit;
    if (this.stateChanges)
      this.stateChanges.next(this.state);
  }
  get omit() {
    return this._omit;
  }
  reset() {
    this._omit = this._omitByDefault;
    for (const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }
};

// src/model/templates/finalizers/finalizer-template-dictionary-parser.interface.ts
var FinalizerTemplateDictionaryParserKey = "FinalizerTemplateDictionaryParser";

// src/model/templates/form-elements/form-element-template-dictionary-parser.interface.ts
var FormElementTemplateDictionaryParserKey = "FormElementTemplateDictionaryParser";

// src/model/templates/forms/nested-form-template-parser.interface.ts
var NestedFormTemplateParserKey = "NestedFormTemplateParser";

// src/model/templates/forms/nested-form-template-parser-impl.ts
var NestedFormTemplateParserImpl = class {
  constructor(formElementTemplateDictionaryParser, multiFieldValidatorsTemplateParser, finalizerTemplateDictionaryParser) {
    this._formElementTemplateDictionaryParser = formElementTemplateDictionaryParser;
    this._multiFieldValidatorsTemplateParser = multiFieldValidatorsTemplateParser;
    this._finalizerTemplateDictionaryParser = finalizerTemplateDictionaryParser;
  }
  parseTemplate(template) {
    var _a, _b, _c;
    const [baseFields, firstNonValidFormElementTracker] = this._formElementTemplateDictionaryParser.parseTemplate(template.fields);
    const multiFieldValidatorsTemplate = (_a = template.multiFieldValidators) != null ? _a : {};
    const [
      userFacingFields,
      finalizerFacingFields,
      multiInputValidatorMessagesAggregator
    ] = this._multiFieldValidatorsTemplateParser.parseTemplate(
      multiFieldValidatorsTemplate,
      baseFields
    );
    const finalizedFields = (_b = template.finalizedFields) != null ? _b : {};
    const finalizerManager = this._finalizerTemplateDictionaryParser.parseTemplate(
      finalizedFields,
      finalizerFacingFields
    );
    const form = new NestedForm(
      userFacingFields,
      firstNonValidFormElementTracker,
      finalizerManager,
      multiInputValidatorMessagesAggregator,
      (_c = template.omitByDefault) != null ? _c : false
    );
    return form;
  }
};
var NestedFormTemplateParserService = (0, import_undecorated_di20.autowire)(NestedFormTemplateParserImpl, NestedFormTemplateParserKey, [
  FormElementTemplateDictionaryParserKey,
  MultiFieldValidatorsTemplateParserKey,
  FinalizerTemplateDictionaryParserKey
]);

// src/model/templates/forms/root-form-template-parser-impl.ts
var import_undecorated_di21 = require("undecorated-di");

// src/model/forms/root-form.ts
var import_rxjs22 = require("rxjs");

// src/model/forms/abstract-root-form.ts
var AbstractRootForm = class {
};

// src/model/forms/root-form.ts
var RootForm = class extends AbstractRootForm {
  constructor(userFacingFields, firstNonValidFormElementTracker, finalizerManager, multiFieldValidatorMessagesAggregator, submissionManager) {
    super();
    this.userFacingFields = userFacingFields;
    this._firstNonValidFormElementTracker = firstNonValidFormElementTracker;
    this._finalizerManager = finalizerManager;
    this._multiFieldValidatorMessagesAggregator = multiFieldValidatorMessagesAggregator;
    this._submissionManager = submissionManager;
    this._multiFieldValidatorMessagesAggregator.messagesChanges.subscribe(
      () => {
        var _a;
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
      }
    );
    this._finalizerManager.stateChanges.subscribe(() => {
      var _a;
      this._submissionManager.clearMessage();
      (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
    });
    this._submissionManager.submissionStateChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
      if (this.submissionStateChanges)
        this.submissionStateChanges.next(this.submissionState);
    });
    this.submissionStateChanges = new import_rxjs22.BehaviorSubject(this.submissionState);
    this.stateChanges = new import_rxjs22.BehaviorSubject(this.state);
  }
  get state() {
    const messages = this._aggregateMessages();
    return copyObject(__spreadProps(__spreadValues({}, this._finalizerManager.state), {
      messages
    }));
  }
  get firstNonValidFormElement() {
    return this._firstNonValidFormElementTracker.firstNonValidFormElement;
  }
  get firstNonValidFormElementChanges() {
    return this._firstNonValidFormElementTracker.firstNonValidFormElementChanges;
  }
  get submissionState() {
    return {
      submissionAttempted: this._submissionManager.submissionState.submissionAttempted
    };
  }
  submit() {
    return this._submissionManager.submit(this.state);
  }
  reset() {
    this._submissionManager.reset();
    for (const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }
  _aggregateMessages() {
    const messages = [
      ...this._multiFieldValidatorMessagesAggregator.messages,
      ...this._finalizerManager.state.messages
    ];
    if (this._submissionManager.submissionState.message)
      messages.push(this._submissionManager.submissionState.message);
    return messages;
  }
};

// src/model/templates/forms/root-form-template-parser.interface.ts
var RootFormTemplateParserKey = "RootFormTemplateParser";

// src/model/templates/forms/root-form-template-parser-impl.ts
var RootFormTemplateParserImpl = class {
  constructor(formElementTemplateDictionaryParser, multiFieldValidatorsTemplateParser, finalizerTemplateDictionaryParser, submissionManagerFactory) {
    this._formElementTemplateDictionaryParser = formElementTemplateDictionaryParser;
    this._multiFieldValidatorsTemplateParser = multiFieldValidatorsTemplateParser;
    this._finalizerTemplateDictionaryParser = finalizerTemplateDictionaryParser;
    this._submissionManagerFactory = submissionManagerFactory;
  }
  parseTemplate(template) {
    var _a, _b;
    const [baseFields, firstNonValidFormElementTracker] = this._formElementTemplateDictionaryParser.parseTemplate(template.fields);
    const multiFieldValidatorsTemplate = (_a = template.multiFieldValidators) != null ? _a : {};
    const [
      userFacingFields,
      finalizerFacingFields,
      multiInputValidatorMessagesAggregator
    ] = this._multiFieldValidatorsTemplateParser.parseTemplate(
      multiFieldValidatorsTemplate,
      baseFields
    );
    const finalizedFields = (_b = template.finalizedFields) != null ? _b : {};
    const finalizerManager = this._finalizerTemplateDictionaryParser.parseTemplate(
      finalizedFields,
      finalizerFacingFields
    );
    const submissionManager = this._submissionManagerFactory.createSubmissionManager(template.submitFn);
    const form = new RootForm(
      userFacingFields,
      firstNonValidFormElementTracker,
      finalizerManager,
      multiInputValidatorMessagesAggregator,
      submissionManager
    );
    return form;
  }
};
var RootFormTemplateParserService = (0, import_undecorated_di21.autowire)(RootFormTemplateParserImpl, RootFormTemplateParserKey, [
  FormElementTemplateDictionaryParserKey,
  MultiFieldValidatorsTemplateParserKey,
  FinalizerTemplateDictionaryParserKey,
  SubmissionManagerFactoryKey
]);

// src/model/templates/fields/base/base-field-template-parser.interface.ts
var BaseFieldTemplateParserKey = "BaseFieldTemplateParser";

// src/model/templates/fields/controlled/controlled-field-template-parser.interface.ts
var ControlledFieldTemplateParserKey = "ControlledFieldTemplateParser";

// src/model/templates/form-elements/form-element-template-dictionary-parser-impl.ts
var import_undecorated_di22 = require("undecorated-di");
var FormElementDictionaryParserImpl = class {
  constructor(baseFieldTemplateParser, controlledFieldTemplateParser, nestedFormTemplateParser, trackerFactory) {
    this._baseFieldTemplateParser = baseFieldTemplateParser;
    this._controlledFieldTemplateParser = controlledFieldTemplateParser;
    this._nestedFormTemplateParser = nestedFormTemplateParser;
    this._trackerFactory = trackerFactory;
  }
  parseTemplate(template) {
    const formElementDictionary = {};
    const firstNonValidFormElementTracker = this._trackerFactory.createFirstNonValidFormElementTracker();
    const controlledFields = /* @__PURE__ */ new Set();
    for (const [fieldName, formElementTemplate] of Object.entries(template)) {
      const formElement = this._isNestedForm(formElementTemplate) ? this._nestedFormTemplateParser.parseTemplate(formElementTemplate) : this._baseFieldTemplateParser.parseTemplate(formElementTemplate);
      formElementDictionary[fieldName] = formElement;
      firstNonValidFormElementTracker.trackFormElementValidity(
        fieldName,
        formElement
      );
      if (this._isControlledField(formElementTemplate))
        controlledFields.add(fieldName);
    }
    for (const fieldName of controlledFields) {
      const formElementTemplate = template instanceof Map ? template.get(fieldName) : template[fieldName];
      formElementDictionary[fieldName] = this._controlledFieldTemplateParser.parseTemplateAndDecorateField(
        formElementDictionary[fieldName],
        formElementTemplate,
        formElementDictionary
      );
    }
    return [formElementDictionary, firstNonValidFormElementTracker];
  }
  _isNestedForm(template) {
    return typeof template === "object" && "fields" in template;
  }
  _isControlledField(template) {
    return typeof template === "object" && ("asyncStateControlFn" in template || "syncStateControlFn" in template || "asyncValueControlFn" in template || "syncValueControlFn" in template);
  }
};
var FormElementTemplateDictionaryParserService = (0, import_undecorated_di22.autowire)(FormElementDictionaryParserImpl, FormElementTemplateDictionaryParserKey, [
  BaseFieldTemplateParserKey,
  ControlledFieldTemplateParserKey,
  NestedFormTemplateParserKey,
  TrackerFactoryKey
]);

// src/model/templates/fields/base/base-field-template-parser-impl.ts
var import_undecorated_di23 = require("undecorated-di");

// src/model/templates/fields/base/base-field-parsing-error.ts
var BaseFieldParsingError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "BaseFieldParsingError";
  }
};

// src/model/templates/fields/base/base-field-template-parser-impl.ts
var BaseFieldTemplateParserImpl = class {
  constructor(baseFieldFactory) {
    this._baseFieldFactory = baseFieldFactory;
  }
  parseTemplate(template) {
    if (typeof template === "string")
      return this._parseString(template);
    else {
      const templateType = this._determineTemplateType(template);
      if (templateType === "DUAL_FIELD" /* DUAL_FIELD */) {
        return this._parseDualFieldTemplate(template);
      } else
        return this._parseFieldTemplate(template);
    }
  }
  _parseString(template) {
    return this._baseFieldFactory.createField(template, false, [], []);
  }
  _determineTemplateType(template) {
    if (typeof template !== "object")
      throw new BaseFieldParsingError(
        "Field template was not a string or an object."
      );
    const isField = "defaultValue" in template && typeof template.defaultValue === "string";
    const isDualField = "primaryDefaultValue" in template && typeof template.primaryDefaultValue === "string" || "secondaryDefaultValue" in template && typeof template.primaryDefaultValue === "string";
    if (isField && isDualField)
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received ambiguous field template: template contains both defaultValue and primaryDefaultValue/secondaryDefaultValue fields."
      );
    if (!isField && !isDualField)
      throw new BaseFieldParsingError(
        "Field template did not include a defaultValue or a primaryDefaultValue property."
      );
    return isDualField ? "DUAL_FIELD" /* DUAL_FIELD */ : "FIELD" /* FIELD */;
  }
  //at this point, we know the field has a defaultValue property and lacks primaryDefaultValue/secondaryDefaultValue
  _parseFieldTemplate(template) {
    if (typeof template.defaultValue !== "string") {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object whose defaultValue was not of type 'string'"
      );
    }
    this._validateBaseFieldTemplate(template);
    const baseFieldProps = this._extractBaseFieldProperties(template);
    return this._baseFieldFactory.createField(
      template.defaultValue,
      ...baseFieldProps,
      template.pendingAsyncValidatorMessage
    );
  }
  _parseDualFieldTemplate(template) {
    if (!("primaryDefaultValue" in template)) {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object containing a secondaryDefaultValue property, but not a primaryDefaultValue property. If you wish to create a dual field, ensure that both properties are included in the template."
      );
    }
    if (!("secondaryDefaultValue" in template)) {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object containing a primaryDefaultValue property, but not a secondaryDefaultValue property. If you wish to create a dual field, ensure that both properties are included in the template."
      );
    }
    if (typeof template.primaryDefaultValue !== "string") {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object whose primaryDefaultValue was not of type string."
      );
    }
    if (typeof template.secondaryDefaultValue !== "string") {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object whose secondaryDefaultValue was not of type string."
      );
    }
    this._validateBaseFieldTemplate(template);
    const _extractBaseFieldProperties = this._extractBaseFieldProperties(template);
    return this._baseFieldFactory.createDualField(
      template.primaryDefaultValue,
      template.secondaryDefaultValue,
      ..._extractBaseFieldProperties,
      template.pendingAsyncValidatorMessage
    );
  }
  _validateBaseFieldTemplate(template) {
    if ("omitByDefault" in template && typeof template.omitByDefault !== "boolean") {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object whose omitByDefault property was not of type 'boolean.'"
      );
    }
    if ("syncValidators" in template && !Array.isArray(template.syncValidators)) {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object whose syncValidators property was set and was not an array. Either omit the property or set it to an array."
      );
    }
    if ("asyncValidators" in template && !Array.isArray(template.asyncValidators)) {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object whose asyncValidators property was set and was not an array. Either omit the property or set it to an array."
      );
    }
    if ("pendingAsyncValidatorMessage" in template && typeof template.pendingAsyncValidatorMessage !== "string") {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object whose pendingAsyncValidatorMessage property was set and was not a string. Either omit the property or set it to a string."
      );
    }
  }
  _extractBaseFieldProperties(template) {
    var _a, _b, _c;
    const omitByDefault = (_a = template.omitByDefault) != null ? _a : false;
    const syncValidators = (_b = template.syncValidators) != null ? _b : [];
    const asyncValidators = (_c = template.asyncValidators) != null ? _c : [];
    return [omitByDefault, syncValidators, asyncValidators];
  }
};
var BaseFieldTemplateParserService = (0, import_undecorated_di23.autowire)(BaseFieldTemplateParserImpl, BaseFieldTemplateParserKey, [
  BaseFieldFactoryKey
]);

// src/model/templates/fields/controlled/controlled-field-template-parser-impl.ts
var import_undecorated_di24 = require("undecorated-di");

// src/model/templates/fields/controlled/controlled-field-template-parsing-error.ts
var ControlledFieldTemplateParsingError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ControlledFieldTemplateParsingError";
  }
};

// src/model/templates/fields/controlled/controlled-field-template-parser-impl.ts
var ControlType = /* @__PURE__ */ ((ControlType2) => {
  ControlType2["SYNC_STATE_CONTROL_FN"] = "syncStateControlFn";
  ControlType2["ASYNC_STATE_CONTROL_FN"] = "asyncStateControlFn";
  ControlType2["SYNC_VALUE_CONTROL_FN"] = "syncValueControlFn";
  ControlType2["ASYNC_VALUE_CONTROL_FN"] = "asyncValueControlFn";
  return ControlType2;
})(ControlType || {});
var ControlledFieldTemplateParserImpl = class {
  constructor(controlledFieldFactory) {
    this._controlledFieldFactory = controlledFieldFactory;
  }
  parseTemplateAndDecorateField(baseField, template, fields) {
    if (!(baseField instanceof AbstractField)) {
      throw new ControlledFieldTemplateParsingError(
        "ControlledFieldTemplateParser expected instanceof AbstractField."
      );
    }
    const controlFnType = this._getControlFnType(template);
    switch (controlFnType) {
      case "syncStateControlFn" /* SYNC_STATE_CONTROL_FN */:
        return this._controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
          baseField,
          template.syncStateControlFn,
          fields
        );
      case "asyncStateControlFn" /* ASYNC_STATE_CONTROL_FN */:
        return this._controlledFieldFactory.createStateControlledFieldWithAsyncAdapter(
          baseField,
          template.asyncStateControlFn,
          fields
        );
      case "syncValueControlFn" /* SYNC_VALUE_CONTROL_FN */:
        return this._controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
          baseField,
          template.syncValueControlFn,
          fields
        );
      case "asyncValueControlFn" /* ASYNC_VALUE_CONTROL_FN */:
        return this._controlledFieldFactory.createValueControlledFieldWithAsyncAdapter(
          baseField,
          template.asyncValueControlFn,
          fields
        );
    }
  }
  _getControlFnType(template) {
    const controlTypes = Object.values(ControlType);
    let controlFnType = null;
    for (const controlType of controlTypes) {
      if (controlType in template && template[controlType]) {
        if (controlFnType) {
          throw new ControlledFieldTemplateParsingError(
            "ControlledFieldTemplateParser received template containing multiple control functions. Please include only one control function type."
          );
        }
        controlFnType = controlType;
      }
    }
    if (!controlFnType)
      throw new ControlledFieldTemplateParsingError(
        "The template passed to ControlledFieldTemplateParser lacked a control function."
      );
    return controlFnType;
  }
};
var ControlledFieldTemplateParserService = (0, import_undecorated_di24.autowire)(ControlledFieldTemplateParserImpl, ControlledFieldTemplateParserKey, [
  ControlledFieldFactoryKey
]);

// src/model/templates/finalizers/finalizer-template-dictionary-parser-impl.ts
var import_undecorated_di25 = require("undecorated-di");
var FinalizerTemplateDictionaryParserImpl = class {
  constructor(finalizerFnFactory, finalizerFactory, finalizerManagerFactory) {
    this._finalizerFnFactory = finalizerFnFactory;
    this._finalizerFactory = finalizerFactory;
    this._finalizerManagerFactory = finalizerManagerFactory;
  }
  parseTemplate(template, finalizerFacingFields) {
    const finalizers = {};
    let originalFieldsToPreserve = /* @__PURE__ */ new Set();
    for (const [finalizerName, finalizerTemplate] of Object.entries(template)) {
      if (finalizerTemplate.syncFinalizerFn) {
        const finalizerFn = this._finalizerFnFactory.createSyncFinalizerFn(
          finalizerTemplate.syncFinalizerFn
        );
        const finalizer = this._finalizerFactory.createSyncFinalizer(
          finalizerFn,
          finalizerFacingFields
        );
        finalizers[finalizerName] = finalizer;
        finalizer.accessedFields.onValue((accessedFields) => {
          if (finalizerTemplate.preserveOriginalFields) {
            originalFieldsToPreserve = /* @__PURE__ */ new Set([
              ...originalFieldsToPreserve,
              ...accessedFields
            ]);
          }
        });
      } else if (finalizerTemplate.asyncFinalizerFn) {
        const finalizerFn = this._finalizerFnFactory.createAsyncFinalizerFn(
          finalizerTemplate.asyncFinalizerFn
        );
        const finalizer = this._finalizerFactory.createAsyncFinalizer(
          finalizerFn,
          finalizerFacingFields
        );
        finalizers[finalizerName] = finalizer;
        finalizer.accessedFields.onValue((accessedFields) => {
          if (finalizerTemplate.preserveOriginalFields) {
            originalFieldsToPreserve = /* @__PURE__ */ new Set([
              ...originalFieldsToPreserve,
              ...accessedFields
            ]);
          }
        });
      }
    }
    for (const [fieldName, field] of Object.entries(finalizerFacingFields)) {
      if (originalFieldsToPreserve.has(fieldName) || !(fieldName in finalizers)) {
        finalizers[fieldName] = this._finalizerFactory.createDefaultFinalizer(field);
      }
    }
    return this._finalizerManagerFactory.createFinalizerManager(finalizers);
  }
};
var FinalizerTemplateDictionaryParserService = (0, import_undecorated_di25.autowire)(FinalizerTemplateDictionaryParserImpl, FinalizerTemplateDictionaryParserKey, [
  FinalizerFnFactoryKey,
  FinalizerFactoryKey,
  FinalizerManagerFactoryKey
]);

// src/model/auto-transforms/auto-transformer-impl.ts
var import_undecorated_di26 = require("undecorated-di");

// src/model/auto-transforms/auto-transformer.interface.ts
var AutoTransformerKey = "AutoTransformer";

// src/model/auto-transforms/auto-transformer-impl.ts
var AutoTransformerImpl = class {
  transform(value) {
    if (config.autoTrim)
      value = value.trim();
    return value;
  }
};
var AutoTransformerService = (0, import_undecorated_di26.autowire)(AutoTransformerImpl, AutoTransformerKey);

// src/model/fields/auto-transformed/auto-transformed-field-factory-impl.ts
var import_undecorated_di27 = require("undecorated-di");

// src/model/fields/auto-transformed/auto-transformed-field.ts
var import_rxjs23 = require("rxjs");
var AutoTransformedField = class extends AbstractField {
  constructor(baseField, autoTransformer17) {
    super();
    this._baseField = baseField;
    this._autoTransformer = autoTransformer17;
    this._baseField.stateChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new import_rxjs23.BehaviorSubject(this.state);
  }
  get omit() {
    return this._baseField.omit;
  }
  set omit(omit) {
    this._baseField.omit = omit;
  }
  get state() {
    return __spreadProps(__spreadValues({}, this._baseField.state), {
      value: this._autoTransformer.transform(this._baseField.state.value)
    });
  }
  setState(state) {
    this._baseField.setState(state);
  }
  setValue(value) {
    this._baseField.setValue(value);
  }
  reset() {
    this._baseField.reset();
  }
};

// src/model/fields/auto-transformed/auto-transformed-field-factory-impl.ts
var AutoTransformedFieldFactoryImpl = class {
  constructor(autoTransformer17) {
    this._autoTransformer = autoTransformer17;
  }
  createAutoTransformedField(baseField) {
    return new AutoTransformedField(baseField, this._autoTransformer);
  }
};
var AutoTransformedFieldFactoryService = (0, import_undecorated_di27.autowire)(AutoTransformedFieldFactoryImpl, AutoTransformedFieldFactoryKey, [
  AutoTransformerKey
]);

// src/model/container.ts
var container = import_undecorated_di28.ContainerBuilder.createContainerBuilder().registerSingletonService(AdapterFactoryService).registerSingletonService(AggregatorFactoryService).registerSingletonService(EmitterFactoryService).registerSingletonService(BaseFieldFactoryService).registerSingletonService(BaseFieldTemplateParserService).registerSingletonService(ControlledFieldTemplateParserService).registerSingletonService(ControlledFieldFactoryService).registerSingletonService(ProxyProducerFactoryService).registerSingletonService(ReducerFactoryService).registerSingletonService(SubjectFactoryService).registerSingletonService(SingleInputValidatorSuiteFactoryService).registerSingletonService(InsertionOrderHeapFactoryService).registerSingletonService(TrackerFactoryService).registerSingletonService(MultiInputValidatorFactoryService).registerSingletonService(MultiInputValidatedFormElementFactoryService).registerSingletonService(MultiFieldValidatorsTemplateParserService).registerSingletonService(FinalizerFnFactoryService).registerSingletonService(FinalizerValidityTranslatorService).registerSingletonService(FinalizerFactoryService).registerSingletonService(FinalizerManagerFactoryService).registerSingletonService(FinalizerTemplateDictionaryParserService).registerSingletonService(SubmissionManagerFactoryService).registerSingletonService(FormElementTemplateDictionaryParserService).registerSingletonService(NestedFormTemplateParserService).registerSingletonService(RootFormTemplateParserService).registerSingletonService(AutoTransformerService).registerSingletonService(AutoTransformedFieldFactoryService).build();

// src/model/validators/util/email.ts
var autoTransformer = container.services.AutoTransformer;
function email(errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer.transform(value);
    const result = {
      isValid: value.length > 0 && config.emailRegex.test(value)
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/in-date-range.ts
var autoTransformer2 = container.services.AutoTransformer;
function inDateRange(min, max, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer2.transform(value);
    const millis = new Date(value).getTime();
    const result = {
      isValid: !Number.isNaN(millis) && millis >= min.getTime() && millis <= max.getTime()
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/in-length-range.ts
var autoTransformer3 = container.services.AutoTransformer;
function inLengthRange(minLength2, maxLength2, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer3.transform(value);
    const result = {
      isValid: value.length >= minLength2 && value.length <= maxLength2
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/in-num-range.ts
var autoTransformer4 = container.services.AutoTransformer;
function inNumRange(min, max, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer4.transform(value);
    const numericValue = Number(value);
    const result = {
      isValid: !Number.isNaN(numericValue) && numericValue >= min && numericValue <= max
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/includes-digit.ts
var autoTransformer5 = container.services.AutoTransformer;
function includesDigit(errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer5.transform(value);
    const result = {
      isValid: /\d/.test(value)
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/includes-lower.ts
var autoTransformer6 = container.services.AutoTransformer;
function includesLower(errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer6.transform(value);
    const result = {
      isValid: /[a-z]/.test(value)
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/includes-symbol.ts
var autoTransformer7 = container.services.AutoTransformer;
function includesSymbol(errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer7.transform(value);
    const result = {
      isValid: config.symbolRegex.test(value)
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/includes-upper.ts
var autoTransformer8 = container.services.AutoTransformer;
function includesUpper(errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer8.transform(value);
    const result = {
      isValid: /[A-Z]/.test(value)
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/max-date.ts
var autoTransformer9 = container.services.AutoTransformer;
function maxDate(max, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer9.transform(value);
    const millis = new Date(value).getTime();
    const result = {
      isValid: !Number.isNaN(millis) && millis <= max.getTime()
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/max-length.ts
var autoTransformer10 = container.services.AutoTransformer;
function maxLength(maxLength2, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer10.transform(value);
    const result = {
      isValid: value.length <= maxLength2
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/max-num.ts
var autoTransformer11 = container.services.AutoTransformer;
function maxNum(max, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer11.transform(value);
    const numericValue = Number(value);
    const result = {
      isValid: !Number.isNaN(numericValue) && numericValue <= max
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/min-date.ts
var autoTransformer12 = container.services.AutoTransformer;
function minDate(min, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer12.transform(value);
    const millis = new Date(value).getTime();
    const result = {
      isValid: !Number.isNaN(millis) && millis >= min.getTime()
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/min-length.ts
var autoTransformer13 = container.services.AutoTransformer;
function minLength(minLength2, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer13.transform(value);
    const result = {
      isValid: value.length >= minLength2
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/min-num.ts
var autoTransformer14 = container.services.AutoTransformer;
function minNum(min, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer14.transform(value);
    const numericValue = Number(value);
    const result = {
      isValid: !Number.isNaN(numericValue) && numericValue >= min
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/pattern.ts
var autoTransformer15 = container.services.AutoTransformer;
function pattern(pattern2, errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer15.transform(value);
    const result = {
      isValid: pattern2.test(value)
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/model/validators/util/required.ts
var autoTransformer16 = container.services.AutoTransformer;
function required(errorMessage, successMessage) {
  return (value) => {
    value = autoTransformer16.transform(value);
    const result = {
      isValid: value.length > 0
    };
    if (!result.isValid) {
      result.message = errorMessage;
    } else if (successMessage) {
      result.message = successMessage;
    }
    return result;
  };
}

// src/hooks/use-root-form.ts
var import_react7 = require("react");

// src/hooks/use-form-state.ts
var import_react = require("react");
function useFormState(form) {
  const [value, setValue] = (0, import_react.useState)(form.state.value);
  const [validity, setValidity] = (0, import_react.useState)(form.state.validity);
  const [messages, setMessages] = (0, import_react.useState)(form.state.messages);
  const subRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    subRef.current = form.stateChanges.subscribe((stateChange) => {
      setValue(stateChange.value);
      setValidity(stateChange.validity);
      setMessages(stateChange.messages);
    });
    return () => {
      var _a;
      return (_a = subRef.current) == null ? void 0 : _a.unsubscribe();
    };
  }, []);
  return {
    value,
    validity,
    messages
  };
}

// src/hooks/use-first-non-valid-form-element.ts
var import_react2 = require("react");
function useFirstNonValidFormElement(form) {
  const [firstNonValidFormElement, setFirstNonValidFormElement] = (0, import_react2.useState)(
    form.firstNonValidFormElement
  );
  const subRef = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    subRef.current = form.firstNonValidFormElementChanges.subscribe((change) => {
      setFirstNonValidFormElement(change);
    });
    return () => {
      var _a;
      return (_a = subRef.current) == null ? void 0 : _a.unsubscribe();
    };
  }, []);
  return {
    firstNonValidFormElement
  };
}

// src/hooks/use-field.ts
var import_react3 = require("react");
function useField(field) {
  const [value, setValue] = (0, import_react3.useState)(field.state.value);
  const [validity, setValidity] = (0, import_react3.useState)(field.state.validity);
  const [messages, setMessages] = (0, import_react3.useState)(field.state.messages);
  const [interactions, setInteractions] = (0, import_react3.useState)(field.interactions);
  const stateChangesSubRef = (0, import_react3.useRef)(null);
  const interactionsChangesSubRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    stateChangesSubRef.current = field.stateChanges.subscribe((change) => {
      setValue(change.value);
      setValidity(change.validity);
      setMessages(change.messages);
    });
    interactionsChangesSubRef.current = field.interactionsChanges.subscribe((change) => {
      setInteractions(change);
    });
    return () => {
      var _a, _b;
      (_a = stateChangesSubRef.current) == null ? void 0 : _a.unsubscribe();
      (_b = interactionsChangesSubRef.current) == null ? void 0 : _b.unsubscribe();
    };
  }, []);
  const updateValue = (value2) => {
    field.setValue(value2);
  };
  const visit = () => {
    field.interactions = __spreadProps(__spreadValues({}, field.interactions), {
      visited: true
    });
  };
  const reset = () => field.reset();
  return {
    value,
    validity,
    messages,
    updateValue,
    interactions,
    visit,
    reset
  };
}

// src/hooks/use-switch-to-secondary-field.ts
var import_react4 = require("react");
function useSwitchToSecondaryField(dualField) {
  const [useSecondaryField, _setUseSecondaryField] = (0, import_react4.useState)(dualField.useSecondaryField);
  const stateChangesSubRef = (0, import_react4.useRef)(null);
  (0, import_react4.useEffect)(() => {
    stateChangesSubRef.current = dualField.stateChanges.subscribe((change) => {
      _setUseSecondaryField(change.useSecondaryField ? true : false);
    });
    return () => {
      var _a;
      return (_a = stateChangesSubRef.current) == null ? void 0 : _a.unsubscribe();
    };
  }, []);
  const setUseSecondaryField = (useSecondaryField2) => {
    dualField.useSecondaryField = useSecondaryField2;
  };
  return {
    useSecondaryField,
    setUseSecondaryField
  };
}

// src/hooks/use-dual-field.ts
function useDualField(dualField) {
  const usePrimaryField = () => useField(dualField.primaryField);
  const useSecondaryField = () => useField(dualField.secondaryField);
  const useSwitchToSecondaryField2 = () => useSwitchToSecondaryField(dualField);
  const reset = () => dualField.reset();
  return {
    usePrimaryField,
    useSecondaryField,
    useSwitchToSecondaryField: useSwitchToSecondaryField2,
    reset
  };
}

// src/hooks/use-omittable-form-element.ts
var import_react5 = require("react");
function useOmittableFormElement(formElement) {
  const [omitFormElement, _setOmitFormElement] = (0, import_react5.useState)(formElement.omit);
  const subRef = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    subRef.current = formElement.stateChanges.subscribe((change) => {
      _setOmitFormElement(change.omit ? true : false);
    });
    return () => {
      var _a;
      return (_a = subRef.current) == null ? void 0 : _a.unsubscribe();
    };
  }, []);
  const setOmitFormElement = (omit) => {
    formElement.omit = omit;
  };
  return {
    omitFormElement,
    setOmitFormElement
  };
}

// src/hooks/use-form.ts
function useForm(form) {
  const useFormState2 = () => useFormState(form);
  const useFirstNonValidFormElement2 = () => useFirstNonValidFormElement(form);
  const reset = () => form.reset();
  const useField2 = (fieldName) => {
    if (!(fieldName in form.userFacingFields)) {
      throw new Error(
        "No field with field name " + fieldName + " found in form fields."
      );
    }
    if (!(form.userFacingFields[fieldName] instanceof AbstractField)) {
      throw new Error(
        "Field " + fieldName + " exists but is not an instance of AbstractField. Use useNestedForm instead."
      );
    }
    return useField(form.userFacingFields[fieldName]);
  };
  const useDualField2 = (fieldName) => {
    if (!(fieldName in form.userFacingFields)) {
      throw new Error(
        "No field with field name " + fieldName + " found in form fields."
      );
    }
    if (!(form.userFacingFields[fieldName] instanceof AbstractDualField)) {
      throw new Error(
        "Field " + fieldName + " exists but is not an instance of AbstractDualField. Use useField or useNestedForm instead."
      );
    }
    return useDualField(
      form.userFacingFields[fieldName]
    );
  };
  const useNestedForm = (fieldName) => {
    if (!(fieldName in form.userFacingFields)) {
      throw new Error(
        "No field with field name " + fieldName + " found in form fields."
      );
    }
    if (!(form.userFacingFields[fieldName] instanceof AbstractNestedForm)) {
      throw new Error(
        "Field " + fieldName + " exists but is not an instance of AbstractNestedForm."
      );
    }
    return useForm(form.userFacingFields[fieldName]);
  };
  const useOmittableFormElement2 = (fieldName) => {
    if (!(fieldName in form.userFacingFields)) {
      throw new Error(
        "No field with field name " + fieldName + " found in form fields."
      );
    }
    return useOmittableFormElement(form.userFacingFields[fieldName]);
  };
  return {
    useFormState: useFormState2,
    useFirstNonValidFormElement: useFirstNonValidFormElement2,
    reset,
    useField: useField2,
    useDualField: useDualField2,
    useNestedForm,
    useOmittableFormElement: useOmittableFormElement2
  };
}

// src/hooks/use-submission-attempted.ts
var import_react6 = require("react");
function useSubmissionAttempted(form) {
  const [submissionAttempted, setSubmissionAttempted] = (0, import_react6.useState)(
    form.submissionState.submissionAttempted
  );
  const subRef = (0, import_react6.useRef)(null);
  (0, import_react6.useEffect)(() => {
    subRef.current = form.submissionStateChanges.subscribe((change) => {
      setSubmissionAttempted(change.submissionAttempted);
    });
    return () => {
      var _a;
      return (_a = subRef.current) == null ? void 0 : _a.unsubscribe();
    };
  }, []);
  return {
    submissionAttempted
  };
}

// src/hooks/use-root-form.ts
var rootFormTemplateParser = container.services.RootFormTemplateParser;
function useRootForm(template) {
  const form = (0, import_react7.useMemo)(() => rootFormTemplateParser.parseTemplate(template), [template]);
  const formRef = (0, import_react7.useRef)(form);
  const useSubmissionAttempted2 = () => useSubmissionAttempted(formRef.current);
  const submit = () => formRef.current.submit();
  return __spreadProps(__spreadValues({}, useForm(formRef.current)), {
    useSubmissionAttempted: useSubmissionAttempted2,
    submit
  });
}

// src/components/field-messages.component.tsx
var import_react12 = __toESM(require("react"), 1);

// src/components/form-context.ts
var import_react8 = require("react");
var FormContext = (0, import_react8.createContext)(null);

// src/components/messages.component.tsx
var import_react10 = __toESM(require("react"), 1);

// src/components/default-message.component.tsx
var import_react9 = __toESM(require("react"), 1);
var DefaultMessage = ({ className, validity, text, id }) => {
  return /* @__PURE__ */ import_react9.default.createElement("span", { className, "data-validity": validity, id }, text);
};

// src/components/messages.component.tsx
function Messages({
  messages,
  messagesContainerClassName = "messages",
  messageClassName = "message",
  MessageComponent = DefaultMessage,
  idPrefix
}) {
  const [statefulMessages, setStatefulMessages] = (0, import_react10.useState)(messages);
  (0, import_react10.useEffect)(() => {
    setStatefulMessages(messages);
  }, [messages]);
  return /* @__PURE__ */ import_react10.default.createElement("div", { className: messagesContainerClassName, "aria-live": "polite" }, statefulMessages.map((message, index) => {
    return /* @__PURE__ */ import_react10.default.createElement(MessageComponent, { validity: message.type, text: message.text, className: messageClassName, key: index.toString(), id: `${idPrefix}-${index.toString()}` });
  }));
}

// src/components/util/get-field-message-id-prefix.ts
function getFieldMessageIdPrefix(fieldName) {
  return `${fieldName}-messages`;
}

// src/components/root-form-provider.component.tsx
var import_react11 = __toESM(require("react"), 1);
var RootFormContext = (0, import_react11.createContext)(null);
function RootFormProvider({ template, children }) {
  const rootForm = useRootForm(template);
  const rootFormCtxValue = {
    useSubmissionAttempted: rootForm.useSubmissionAttempted,
    submit: rootForm.submit
  };
  const formCtxValue = {
    useFormState: rootForm.useFormState,
    useFirstNonValidFormElement: rootForm.useFirstNonValidFormElement,
    useField: rootForm.useField,
    useDualField: rootForm.useDualField,
    useNestedForm: rootForm.useNestedForm,
    useOmittableFormElement: rootForm.useOmittableFormElement,
    reset: rootForm.reset
  };
  return /* @__PURE__ */ import_react11.default.createElement(RootFormContext.Provider, { value: rootFormCtxValue }, /* @__PURE__ */ import_react11.default.createElement(FormContext.Provider, { value: formCtxValue }, children));
}

// src/components/field-messages.component.tsx
function FieldMessages({
  fieldName,
  messagesContainerClassName,
  messageClassName,
  MessageComponent
}) {
  const rootFormCtx = (0, import_react12.useContext)(RootFormContext);
  const formCtx = (0, import_react12.useContext)(FormContext);
  if (!rootFormCtx)
    throw new Error("FieldMessages cannot access properties of null or undefined RootFormContext.");
  if (!formCtx)
    throw new Error("FieldMessages cannot access properties of null or undefined FormContext.");
  else {
    const { useField: useField2 } = formCtx;
    const { messages, interactions } = useField2(fieldName);
    const { useSubmissionAttempted: useSubmissionAttempted2 } = rootFormCtx;
    const { submissionAttempted } = useSubmissionAttempted2();
    return /* @__PURE__ */ import_react12.default.createElement(Messages, { messages: submissionAttempted || interactions.visited || interactions.modified ? messages : [], messagesContainerClassName, messageClassName, MessageComponent, idPrefix: getFieldMessageIdPrefix(fieldName) });
  }
}

// src/components/form-messages.component.tsx
var import_react13 = __toESM(require("react"), 1);
function FormMessages({
  messagesContainerClassName,
  messageClassName,
  MessageComponent,
  idPrefix
}) {
  const formCtx = (0, import_react13.useContext)(FormContext);
  if (formCtx === null)
    throw new Error("FieldMessages cannot access useField property of null FormContext");
  else {
    const { messages } = formCtx.useFormState();
    return /* @__PURE__ */ import_react13.default.createElement(Messages, { messages, messagesContainerClassName, messageClassName, MessageComponent, idPrefix });
  }
}

// src/components/input-group.component.tsx
var import_react16 = __toESM(require("react"), 1);

// src/components/label.component.tsx
var import_react14 = __toESM(require("react"), 1);

// src/components/util/validity-to-string.ts
function validityToString(validity) {
  switch (validity) {
    case 0 /* ERROR */:
      return "ERROR";
    case 1 /* INVALID */:
      return "INVALID";
    case 2 /* PENDING */:
      return "PENDING";
    case 3 /* VALID_UNFINALIZABLE */:
    case 4 /* VALID_FINALIZABLE */:
      return "VALID";
  }
}

// src/components/label.component.tsx
function Label({ fieldName, labelText, labelClassName = "label" }) {
  const formCtx = (0, import_react14.useContext)(FormContext);
  if (formCtx === null)
    throw new Error("Input cannot access property useField of null FormContext");
  else {
    const { useField: useField2 } = formCtx;
    const { validity } = useField2(fieldName);
    return /* @__PURE__ */ import_react14.default.createElement("label", { htmlFor: fieldName, className: labelClassName, "data-validity": validityToString(validity) }, labelText);
  }
}

// src/components/input.component.tsx
var import_react15 = __toESM(require("react"), 1);

// src/components/util/get-field-aria-described-by.ts
function getFieldAriaDescribedBy(fieldName, messageCount) {
  const describedBy = [];
  for (let i = 0; i < messageCount; i++) {
    describedBy.push(`${getFieldMessageIdPrefix(fieldName)}-${i}`);
  }
  return describedBy.join(" ");
}

// src/components/input.component.tsx
function Input({ fieldName, inputType, inputClassName, readOnly = false, autoComplete, placeholder, list, autoFocus, step, max, min, maxLength: maxLength2, size }) {
  const rootFormCtx = (0, import_react15.useContext)(RootFormContext);
  const formCtx = (0, import_react15.useContext)(FormContext);
  if (!rootFormCtx)
    throw new Error("Input cannot access properties of null or undefined RootFormContext");
  if (!formCtx)
    throw new Error("Input cannot access properties of null or undefined FormContext");
  else {
    const { useField: useField2 } = formCtx;
    const { value, validity, messages, updateValue, interactions, visit } = useField2(fieldName);
    const { useSubmissionAttempted: useSubmissionAttempted2 } = rootFormCtx;
    const { submissionAttempted } = useSubmissionAttempted2();
    return /* @__PURE__ */ import_react15.default.createElement(
      "input",
      {
        id: fieldName,
        name: fieldName,
        type: inputType,
        className: inputClassName,
        "data-validity": submissionAttempted || interactions.visited || interactions.modified ? validityToString(validity) : validityToString(4 /* VALID_FINALIZABLE */),
        "aria-invalid": (submissionAttempted || interactions.visited || interactions.modified) && validity <= 1 /* INVALID */,
        value,
        onChange: (e) => {
          updateValue(e.target.value);
        },
        readOnly,
        "aria-readonly": readOnly,
        "aria-describedby": submissionAttempted || interactions.visited || interactions.modified ? getFieldAriaDescribedBy(fieldName, messages.length) : "",
        autoComplete,
        placeholder,
        list,
        autoFocus,
        step,
        max,
        min,
        maxLength: maxLength2,
        size,
        onBlur: visit
      }
    );
  }
}

// src/components/input-group.component.tsx
function InputGroup({
  fieldName,
  inputGroupClassName,
  inputClassName,
  inputType,
  readOnly,
  autoComplete,
  placeholder,
  list,
  autoFocus,
  step,
  max,
  min,
  maxLength: maxLength2,
  size,
  labelText,
  labelClassName,
  messageClassName,
  messagesContainerClassName,
  MessageComponent
}) {
  return /* @__PURE__ */ import_react16.default.createElement("div", { className: inputGroupClassName }, /* @__PURE__ */ import_react16.default.createElement(Label, { fieldName, labelText, labelClassName }), /* @__PURE__ */ import_react16.default.createElement(
    Input,
    {
      fieldName,
      inputClassName,
      inputType,
      readOnly,
      autoComplete,
      placeholder,
      list,
      autoFocus,
      step,
      max,
      min,
      maxLength: maxLength2,
      size
    }
  ), /* @__PURE__ */ import_react16.default.createElement(FieldMessages, { fieldName, messagesContainerClassName, messageClassName, MessageComponent }));
}

// src/components/nested-form-provider.component.tsx
var import_react17 = __toESM(require("react"), 1);
function NestedFormProvider({ fieldName, children }) {
  const formCtx = (0, import_react17.useContext)(FormContext);
  if (formCtx === null)
    throw new Error("NestedFormProvider cannot access useNestedForm property of null context.");
  else {
    const { useNestedForm } = formCtx;
    const nestedForm = useNestedForm(fieldName);
    return /* @__PURE__ */ import_react17.default.createElement(FormContext.Provider, { value: nestedForm }, children);
  }
}

// src/components/reset-button.component.tsx
var import_react18 = __toESM(require("react"), 1);
function ResetButton(props) {
  const [disabled, setDisabled] = (0, import_react18.useState)(props.disabled);
  const formCtx = (0, import_react18.useContext)(FormContext);
  (0, import_react18.useEffect)(() => {
    setDisabled(props.disabled);
  }, [props.disabled]);
  if (formCtx === null)
    throw new Error("Reset button cannot read property reset of null FormContext");
  else {
    const { reset } = formCtx;
    return /* @__PURE__ */ import_react18.default.createElement("button", { onClick: reset, className: props.className, disabled }, "Reset");
  }
}

// src/components/submit-button.component.tsx
var import_react19 = __toESM(require("react"), 1);
function SubmitButton({ className }) {
  const rootFormCtx = (0, import_react19.useContext)(RootFormContext);
  const formCtx = (0, import_react19.useContext)(FormContext);
  if (rootFormCtx === null)
    throw new Error("Cannot render SubmitButton inside null RootFormContext");
  if (formCtx === null)
    throw new Error("Cannot Render SubmitButton inside null FormContext");
  const { submit } = rootFormCtx;
  const { validity } = formCtx.useFormState();
  return /* @__PURE__ */ import_react19.default.createElement("button", { className, onClick: submit, disabled: validity < 4 /* VALID_FINALIZABLE */ }, "Submit");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FieldMessages,
  FormContext,
  FormMessages,
  Input,
  InputGroup,
  Label,
  MessageType,
  NestedFormProvider,
  ResetButton,
  RootFormProvider,
  SubmitButton,
  Validity,
  email,
  inDateRange,
  inLengthRange,
  inNumRange,
  includesDigit,
  includesLower,
  includesSymbol,
  includesUpper,
  maxDate,
  maxLength,
  maxNum,
  minDate,
  minLength,
  minNum,
  pattern,
  required,
  useRootForm,
  validityToString
});
//# sourceMappingURL=index.cjs.map