var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

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
import rc from "rc";
var config = rc("modeledformsreact", {
  autoTrim: true,
  emailRegex: /^[A-Z0-9]+(?:[_%+.-][A-Z0-9]+)*@[A-Z0-9]+(?:[.-][A-Z0-9]+)\.[A-Z]{2,}$/i,
  symbolRegex: / !"#\$%&'\(\)\*\+,-.\/\\:;<=>\?@\[\]\^_`{\|}~/,
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
import { ContainerBuilder } from "undecorated-di";

// src/model/adapters/adapter-factory-impl.ts
import { autowire } from "undecorated-di";

// src/model/adapters/adapter-factory.interface.ts
var AdapterFactoryKey = "AdapterFactory";

// src/model/aggregators/aggregator-factory.interface.ts
var AggregatorFactoryKey = "AggregatorFactory";

// src/model/adapters/async-adapter.ts
import { ReplaySubject, from } from "rxjs";

// src/model/util/log-error-in-dev-mode.ts
function logErrorInDevMode(e) {
  process.env.NODE_ENV === "development" && console.error(e);
}

// src/model/adapters/async-adapter.ts
var _aggregator, _adapterFnSubscription;
var AsyncAdapter = class {
  constructor(adapterFn, aggregator) {
    __privateAdd(this, _aggregator, void 0);
    __privateAdd(this, _adapterFnSubscription, void 0);
    __privateSet(this, _aggregator, aggregator);
    this.stream = new ReplaySubject(1), __privateGet(this, _aggregator).aggregateChanges.subscribe(
      (aggregateChange) => {
        var _a;
        (_a = __privateGet(this, _adapterFnSubscription)) == null ? void 0 : _a.unsubscribe();
        try {
          const promiseOrObservable = adapterFn(aggregateChange);
          __privateSet(this, _adapterFnSubscription, from(promiseOrObservable).subscribe({
            next: (next) => this.stream.next(next),
            error: (e) => {
              logErrorInDevMode(e);
              this.stream.error(e);
            }
          }));
        } catch (e) {
          logErrorInDevMode(e);
          this.stream.error(e);
        }
      }
    );
  }
};
_aggregator = new WeakMap();
_adapterFnSubscription = new WeakMap();

// src/model/adapters/sync-adapter.ts
import { ReplaySubject as ReplaySubject2 } from "rxjs";
var _aggregator2;
var SyncAdapter = class {
  constructor(adapterFn, aggregator) {
    __privateAdd(this, _aggregator2, void 0);
    __privateSet(this, _aggregator2, aggregator);
    this.stream = new ReplaySubject2(1);
    __privateGet(this, _aggregator2).aggregateChanges.subscribe(
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
_aggregator2 = new WeakMap();

// src/model/adapters/adapter-factory-impl.ts
var _aggregatorFactory;
var AdapterFactoryImpl = class {
  constructor(aggregatorFactory) {
    __privateAdd(this, _aggregatorFactory, void 0);
    __privateSet(this, _aggregatorFactory, aggregatorFactory);
  }
  createSyncAdapterFromFnWithFields(syncAdapterFn, fields) {
    const multiFieldAggregator = __privateGet(this, _aggregatorFactory).createMultiFieldAggregatorFromFields(fields);
    return new SyncAdapter(syncAdapterFn, multiFieldAggregator);
  }
  createAsyncAdapterFromFnWithFields(asyncAdapterFn, fields) {
    const multiFieldAggregator = __privateGet(this, _aggregatorFactory).createMultiFieldAggregatorFromFields(fields);
    return new AsyncAdapter(asyncAdapterFn, multiFieldAggregator);
  }
};
_aggregatorFactory = new WeakMap();
var AdapterFactoryService = autowire(AdapterFactoryImpl, AdapterFactoryKey, [AggregatorFactoryKey]);

// src/model/emitters/emitter-factory.interface.ts
var EmitterFactoryKey = "EmitterFactory";

// src/model/proxies/proxy-producer-factory.interface.ts
var ProxyProducerFactoryKey = "ProxyProducerFactory";

// src/model/reducers/reducer-factory.interface.ts
var ReducerFactoryKey = "ReducerFactory";

// src/model/subjects/subject-factory.interface.ts
var SubjectFactoryKey = "SubjectFactory";

// src/model/aggregators/multi-field-aggregator-impl.ts
var _fields, _fieldStateReducer, _aggregatedFieldState, _aggregatedStateChangesProxyProducer, _accessedFieldsSubscriptionProcessCompleted;
var MultiFieldAggregatorImpl = class {
  constructor(fields, aggregatedStateChangesProxyProducer, fieldStateReducer, accessedFields, subjectFactory) {
    __privateAdd(this, _fields, void 0);
    __privateAdd(this, _fieldStateReducer, void 0);
    __privateAdd(this, _aggregatedFieldState, {});
    __privateAdd(this, _aggregatedStateChangesProxyProducer, void 0);
    __privateAdd(this, _accessedFieldsSubscriptionProcessCompleted, false);
    this.subscribeToAccessedFields = () => {
      if (!__privateGet(this, _accessedFieldsSubscriptionProcessCompleted) && __privateGet(this, _aggregatedStateChangesProxyProducer)) {
        const accessedFieldNames = __privateGet(this, _aggregatedStateChangesProxyProducer).accessedFieldNames;
        for (const fieldName of accessedFieldNames) {
          __privateGet(this, _fields)[fieldName].stateChanges.subscribe(
            (stateChange) => {
              __privateGet(this, _aggregatedFieldState)[fieldName] = stateChange;
              __privateGet(this, _fieldStateReducer).updateTallies(fieldName, stateChange);
              if (__privateGet(this, _accessedFieldsSubscriptionProcessCompleted)) {
                this.aggregateChanges.next(this.aggregatedStateChanges);
              }
            }
          );
        }
        this.accessedFields.setValue(accessedFieldNames);
        __privateSet(this, _aggregatedStateChangesProxyProducer, null);
        __privateSet(this, _accessedFieldsSubscriptionProcessCompleted, true);
      }
    };
    __privateSet(this, _fields, fields);
    __privateSet(this, _aggregatedStateChangesProxyProducer, aggregatedStateChangesProxyProducer);
    __privateSet(this, _fieldStateReducer, fieldStateReducer);
    this.aggregateChanges = subjectFactory.createOnInitialSubscriptionHandlingBehaviorSubject(
      __privateGet(this, _aggregatedStateChangesProxyProducer).getProxy(__privateGet(this, _fields))
    );
    this.accessedFields = accessedFields;
    this.aggregateChanges.onInitialSubscription(this.subscribeToAccessedFields);
  }
  get aggregatedStateChanges() {
    return __spreadProps(__spreadValues({}, __privateGet(this, _aggregatedFieldState)), {
      overallValidity: () => __privateGet(this, _fieldStateReducer).validity,
      hasOmittedFields: () => __privateGet(this, _fieldStateReducer).omit
    });
  }
};
_fields = new WeakMap();
_fieldStateReducer = new WeakMap();
_aggregatedFieldState = new WeakMap();
_aggregatedStateChangesProxyProducer = new WeakMap();
_accessedFieldsSubscriptionProcessCompleted = new WeakMap();

// src/model/aggregators/multi-input-validator-messages-aggregator-impl.ts
import { BehaviorSubject } from "rxjs";

// src/model/util/copy-object.ts
function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}

// src/model/aggregators/multi-input-validator-messages-aggregator-impl.ts
var _messages;
var MultiInputValidatorMessagesAggregatorImpl = class {
  constructor(validators) {
    __privateAdd(this, _messages, {});
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      validator.messageChanges.subscribe((next) => {
        if (next)
          __privateGet(this, _messages)[i] = next;
        else
          delete __privateGet(this, _messages)[i];
        if (this.messagesChanges)
          this.messagesChanges.next(this.messages);
      });
    }
    this.messagesChanges = new BehaviorSubject(this.messages);
  }
  get messages() {
    return [...this.generateMessages()];
  }
  *generateMessages() {
    for (const key in __privateGet(this, _messages))
      yield copyObject(__privateGet(this, _messages)[key]);
  }
};
_messages = new WeakMap();

// src/model/aggregators/aggregator-factory-impl.ts
import { autowire as autowire2 } from "undecorated-di";
var _proxyProducerFactory, _reducerFactory, _emitterFactory, _subjectFactory;
var AggregatorFactoryImpl = class {
  constructor(proxyProducerFactory, reducerFactory, emitterFactory, subjectFactory) {
    __privateAdd(this, _proxyProducerFactory, void 0);
    __privateAdd(this, _reducerFactory, void 0);
    __privateAdd(this, _emitterFactory, void 0);
    __privateAdd(this, _subjectFactory, void 0);
    __privateSet(this, _proxyProducerFactory, proxyProducerFactory);
    __privateSet(this, _reducerFactory, reducerFactory);
    __privateSet(this, _emitterFactory, emitterFactory);
    __privateSet(this, _subjectFactory, subjectFactory);
  }
  createMultiFieldAggregatorFromFields(fields) {
    return new MultiFieldAggregatorImpl(
      fields,
      __privateGet(this, _proxyProducerFactory).createAggregatedStateChangesProxyProducer(),
      __privateGet(this, _reducerFactory).createFieldStateReducer(),
      __privateGet(this, _emitterFactory).createOneTimeValueEmitter(),
      __privateGet(this, _subjectFactory)
    );
  }
  createMultiInputValidatorMessagesAggregatorFromValidators(validators) {
    return new MultiInputValidatorMessagesAggregatorImpl(validators);
  }
};
_proxyProducerFactory = new WeakMap();
_reducerFactory = new WeakMap();
_emitterFactory = new WeakMap();
_subjectFactory = new WeakMap();
var AggregatorFactoryService = autowire2(AggregatorFactoryImpl, AggregatorFactoryKey, [
  ProxyProducerFactoryKey,
  ReducerFactoryKey,
  EmitterFactoryKey,
  SubjectFactoryKey
]);

// src/model/emitters/one-time-event-emitter-impl.ts
var _eventOccurred, _callbacks;
var OneTimeEventEmitterImpl = class {
  constructor() {
    __privateAdd(this, _eventOccurred, false);
    __privateAdd(this, _callbacks, []);
  }
  onEvent(cb) {
    if (__privateGet(this, _eventOccurred))
      cb();
    else
      __privateGet(this, _callbacks).push(cb);
  }
  triggerEvent() {
    if (!__privateGet(this, _eventOccurred)) {
      __privateSet(this, _eventOccurred, true);
      for (const cb of __privateGet(this, _callbacks)) {
        cb();
      }
    }
  }
};
_eventOccurred = new WeakMap();
_callbacks = new WeakMap();

// src/model/emitters/one-time-value-emitter-impl.ts
var _value, _callbacks2;
var OneTimeValueEmitterImpl = class {
  constructor() {
    __privateAdd(this, _value, void 0);
    __privateAdd(this, _callbacks2, []);
  }
  onValue(cb) {
    if (__privateGet(this, _value))
      cb(__privateGet(this, _value));
    else
      __privateGet(this, _callbacks2).push(cb);
  }
  setValue(value) {
    if (!__privateGet(this, _value)) {
      __privateSet(this, _value, value);
      for (const cb of __privateGet(this, _callbacks2)) {
        cb(__privateGet(this, _value));
      }
    }
  }
};
_value = new WeakMap();
_callbacks2 = new WeakMap();

// src/model/emitters/emitter-factory-impl.ts
import { autowire as autowire3 } from "undecorated-di";
var EmitterFactoryImpl = class {
  createOneTimeEventEmitter() {
    return new OneTimeEventEmitterImpl();
  }
  createOneTimeValueEmitter() {
    return new OneTimeValueEmitterImpl();
  }
};
var EmitterFactoryService = autowire3(EmitterFactoryImpl, EmitterFactoryKey);

// src/model/fields/base/base-field-factory.interface.ts
var BaseFieldFactoryKey = "BaseFieldFactory";

// src/model/validators/single-input/single-input-validator-suite-factory.interface.ts
var SingleInputValidatorSuiteFactoryKey = "SingleInputValidatorSuiteFactory";

// src/model/fields/base/dual-field.ts
import { BehaviorSubject as BehaviorSubject2 } from "rxjs";

// src/model/fields/base/abstract-field.ts
var AbstractField = class {
};

// src/model/fields/base/abstract-dual-field.ts
var AbstractDualField = class extends AbstractField {
};

// src/model/fields/base/dual-field.ts
var _useSecondaryField, _omit, _omitByDefault;
var DualField = class extends AbstractDualField {
  constructor(primaryField, secondaryField, omitByDefault) {
    super();
    __privateAdd(this, _useSecondaryField, false);
    __privateAdd(this, _omit, void 0);
    __privateAdd(this, _omitByDefault, void 0);
    this.primaryField = primaryField;
    this.secondaryField = secondaryField;
    __privateSet(this, _omitByDefault, omitByDefault);
    __privateSet(this, _omit, __privateGet(this, _omitByDefault));
    this.primaryField.stateChanges.subscribe(() => {
      var _a;
      if (!__privateGet(this, _useSecondaryField))
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
    });
    this.secondaryField.stateChanges.subscribe(() => {
      var _a;
      if (__privateGet(this, _useSecondaryField))
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
    });
    this.stateChanges = new BehaviorSubject2(this.state);
  }
  get state() {
    const state = !__privateGet(this, _useSecondaryField) ? this.primaryField.state : this.secondaryField.state;
    state.useSecondaryField = __privateGet(this, _useSecondaryField);
    state.omit = __privateGet(this, _omit);
    return state;
  }
  set useSecondaryField(useSecondaryField) {
    const changeDetected = this.useSecondaryField !== useSecondaryField;
    __privateSet(this, _useSecondaryField, useSecondaryField);
    if (this.stateChanges && changeDetected)
      this.stateChanges.next(this.state);
  }
  get useSecondaryField() {
    return __privateGet(this, _useSecondaryField);
  }
  set omit(omit) {
    var _a;
    __privateSet(this, _omit, omit);
    (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
  }
  get omit() {
    return __privateGet(this, _omit);
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
    __privateSet(this, _omit, __privateGet(this, _omitByDefault));
    this.primaryField.reset();
    this.secondaryField.reset();
    this.useSecondaryField = false;
  }
};
_useSecondaryField = new WeakMap();
_omit = new WeakMap();
_omitByDefault = new WeakMap();

// src/model/fields/base/field.ts
import {
  BehaviorSubject as BehaviorSubject3
} from "rxjs";
var _validatorSuite, _defaultValue, _omitByDefault2, _state, _validatorSuiteSubscription;
var Field = class extends AbstractField {
  constructor(validatorSuite, defaultValue, omitByDefault) {
    super();
    __privateAdd(this, _validatorSuite, void 0);
    __privateAdd(this, _defaultValue, void 0);
    __privateAdd(this, _omitByDefault2, void 0);
    __privateAdd(this, _state, void 0);
    __privateAdd(this, _validatorSuiteSubscription, void 0);
    __privateSet(this, _validatorSuite, validatorSuite);
    __privateSet(this, _defaultValue, defaultValue);
    __privateSet(this, _omitByDefault2, omitByDefault);
    const initialState = __privateGet(this, _validatorSuite).evaluate(__privateGet(this, _defaultValue));
    __privateSet(this, _state, __spreadProps(__spreadValues({}, initialState.syncResult), {
      omit: __privateGet(this, _omitByDefault2)
    }));
    this.stateChanges = new BehaviorSubject3(this.state);
    if (initialState.observable)
      this.handleValidityObservable(initialState.observable);
  }
  get state() {
    return copyObject(__privateGet(this, _state));
  }
  set omit(omit) {
    this.setState(__spreadProps(__spreadValues({}, this.state), {
      omit
    }));
  }
  get omit() {
    return this.state.omit;
  }
  setValue(value) {
    if (__privateGet(this, _validatorSuiteSubscription))
      __privateGet(this, _validatorSuiteSubscription).unsubscribe();
    const validityResult = __privateGet(this, _validatorSuite).evaluate(value);
    this.setState(__spreadProps(__spreadValues({}, validityResult.syncResult), {
      omit: this.state.omit
    }));
    if (validityResult.observable)
      this.handleValidityObservable(validityResult.observable);
  }
  setState(state) {
    __privateSet(this, _state, copyObject(state));
    this.stateChanges.next(this.state);
  }
  reset() {
    __privateGet(this, _state).omit = __privateGet(this, _omitByDefault2);
    this.setValue(__privateGet(this, _defaultValue));
  }
  handleValidityObservable(observable) {
    var _a;
    (_a = __privateGet(this, _validatorSuiteSubscription)) == null ? void 0 : _a.unsubscribe();
    __privateSet(this, _validatorSuiteSubscription, observable.subscribe((result) => {
      this.setState(__spreadProps(__spreadValues({}, result), {
        messages: [
          ...this.state.messages.filter(
            (message) => message.type !== "PENDING" /* PENDING */
          ),
          ...result.messages
        ],
        omit: this.state.omit
      }));
    }));
  }
};
_validatorSuite = new WeakMap();
_defaultValue = new WeakMap();
_omitByDefault2 = new WeakMap();
_state = new WeakMap();
_validatorSuiteSubscription = new WeakMap();

// src/model/fields/base/base-field-factory-impl.ts
import { autowire as autowire4 } from "undecorated-di";
var _singleInputValidatorSuiteFactory;
var BaseFieldFactoryImpl = class {
  constructor(singleInputValidatorSuiteFactory) {
    __privateAdd(this, _singleInputValidatorSuiteFactory, void 0);
    __privateSet(this, _singleInputValidatorSuiteFactory, singleInputValidatorSuiteFactory);
  }
  createField(defaultValue, omitByDefault, syncValidators, asyncValidators, pendingAsyncValidatorMessage) {
    const validatorSuite = __privateGet(this, _singleInputValidatorSuiteFactory).createSingleInputValidatorSuite(
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
_singleInputValidatorSuiteFactory = new WeakMap();
var BaseFieldFactoryService = autowire4(BaseFieldFactoryImpl, BaseFieldFactoryKey, [
  SingleInputValidatorSuiteFactoryKey
]);

// src/model/fields/controlled/controlled-field-factory-impl.ts
import { autowire as autowire5 } from "undecorated-di";

// src/model/fields/controlled/state-controlled-dual-field.ts
var _field, _adapter;
var StateControlledDualField = class extends AbstractDualField {
  constructor(field, adapter) {
    super();
    __privateAdd(this, _field, void 0);
    __privateAdd(this, _adapter, void 0);
    __privateSet(this, _field, field);
    __privateSet(this, _adapter, adapter);
    __privateGet(this, _adapter).stream.subscribe({
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
        const setStateArg = this.dualField.useSecondaryField ? {
          secondaryFieldState: errorState
        } : {
          primaryFieldState: errorState
        };
        this.setState(setStateArg);
      }
    });
  }
  get stateChanges() {
    return __privateGet(this, _field).stateChanges;
  }
  get state() {
    return __privateGet(this, _field).state;
  }
  set omit(omit) {
    __privateGet(this, _field).omit = omit;
  }
  get omit() {
    return __privateGet(this, _field).omit;
  }
  get primaryField() {
    return this.dualField.primaryField;
  }
  get secondaryField() {
    return this.dualField.secondaryField;
  }
  set useSecondaryField(useSecondaryField) {
    this.dualField.useSecondaryField = useSecondaryField;
  }
  get useSecondaryField() {
    return this.dualField.useSecondaryField;
  }
  get dualField() {
    return __privateGet(this, _field);
  }
  setValue(value) {
    this.dualField.setValue(value);
  }
  setState(state) {
    this.dualField.setState(state);
  }
  reset() {
    this.dualField.reset();
  }
};
_field = new WeakMap();
_adapter = new WeakMap();

// src/model/fields/controlled/state-controlled-field.ts
var _field2, _adapter2;
var StateControlledField = class extends AbstractField {
  constructor(field, adapter) {
    super();
    __privateAdd(this, _field2, void 0);
    __privateAdd(this, _adapter2, void 0);
    __privateSet(this, _field2, field);
    __privateSet(this, _adapter2, adapter);
    __privateGet(this, _adapter2).stream.subscribe({
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
    return __privateGet(this, _field2).stateChanges;
  }
  get state() {
    return __privateGet(this, _field2).state;
  }
  set omit(omit) {
    __privateGet(this, _field2).omit = omit;
  }
  get omit() {
    return __privateGet(this, _field2).omit;
  }
  setValue(value) {
    __privateGet(this, _field2).setValue(value);
  }
  setState(state) {
    __privateGet(this, _field2).setState(state);
  }
  reset() {
    __privateGet(this, _field2).reset();
  }
};
_field2 = new WeakMap();
_adapter2 = new WeakMap();

// src/model/fields/controlled/value-controlled-dual-field.ts
var _field3, _adapter3;
var ValueControlledDualField = class extends AbstractDualField {
  constructor(field, adapter) {
    super();
    __privateAdd(this, _field3, void 0);
    __privateAdd(this, _adapter3, void 0);
    __privateSet(this, _field3, field);
    __privateSet(this, _adapter3, adapter);
    __privateGet(this, _adapter3).stream.subscribe({
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
        const setStateArg = this.dualField.useSecondaryField ? {
          secondaryFieldState: errorState
        } : {
          primaryFieldState: errorState
        };
        this.setState(setStateArg);
      }
    });
  }
  get stateChanges() {
    return __privateGet(this, _field3).stateChanges;
  }
  get state() {
    return __privateGet(this, _field3).state;
  }
  set omit(omit) {
    __privateGet(this, _field3).omit = omit;
  }
  get omit() {
    return __privateGet(this, _field3).omit;
  }
  get primaryField() {
    return this.dualField.primaryField;
  }
  get secondaryField() {
    return this.dualField.secondaryField;
  }
  set useSecondaryField(useSecondaryField) {
    this.dualField.useSecondaryField = useSecondaryField;
  }
  get useSecondaryField() {
    return this.dualField.useSecondaryField;
  }
  get dualField() {
    return __privateGet(this, _field3);
  }
  setValue(value) {
    this.dualField.setValue(value);
  }
  setState(state) {
    this.dualField.setState(state);
  }
  reset() {
    this.dualField.reset();
  }
};
_field3 = new WeakMap();
_adapter3 = new WeakMap();

// src/model/fields/controlled/value-controlled-field.ts
var _field4, _adapter4;
var ValueControlledField = class extends AbstractField {
  constructor(field, adapter) {
    super();
    __privateAdd(this, _field4, void 0);
    __privateAdd(this, _adapter4, void 0);
    __privateSet(this, _field4, field);
    __privateSet(this, _adapter4, adapter);
    __privateGet(this, _adapter4).stream.subscribe({
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
    return __privateGet(this, _field4).stateChanges;
  }
  get state() {
    return __privateGet(this, _field4).state;
  }
  set omit(omit) {
    __privateGet(this, _field4).omit = omit;
  }
  get omit() {
    return __privateGet(this, _field4).omit;
  }
  setValue(value) {
    __privateGet(this, _field4).setValue(value);
  }
  setState(state) {
    __privateGet(this, _field4).setState(state);
  }
  reset() {
    __privateGet(this, _field4).reset();
  }
};
_field4 = new WeakMap();
_adapter4 = new WeakMap();

// src/model/fields/controlled/controlled-field-factory.interface.ts
var ControlledFieldFactoryKey = "ControlledFieldFactory";

// src/model/fields/controlled/controlled-field-factory-impl.ts
var _adapterFactory;
var ControlledFieldFactoryImpl = class {
  constructor(adapterFactory) {
    __privateAdd(this, _adapterFactory, void 0);
    __privateSet(this, _adapterFactory, adapterFactory);
  }
  createStateControlledFieldWithSyncAdapter(baseField, stateControlFn, fields) {
    const adapter = __privateGet(this, _adapterFactory).createSyncAdapterFromFnWithFields(stateControlFn, fields);
    return baseField instanceof AbstractDualField ? new StateControlledDualField(
      baseField,
      adapter
    ) : new StateControlledField(
      baseField,
      adapter
    );
  }
  createStateControlledFieldWithAsyncAdapter(baseField, stateControlFn, fields) {
    const adapter = __privateGet(this, _adapterFactory).createAsyncAdapterFromFnWithFields(stateControlFn, fields);
    return baseField instanceof AbstractDualField ? new StateControlledDualField(
      baseField,
      adapter
    ) : new StateControlledField(
      baseField,
      adapter
    );
  }
  createValueControlledFieldWithSyncAdapter(baseField, valueControlFn, fields) {
    const adapter = __privateGet(this, _adapterFactory).createSyncAdapterFromFnWithFields(valueControlFn, fields);
    return baseField instanceof AbstractDualField ? new ValueControlledDualField(
      baseField,
      adapter
    ) : new ValueControlledField(
      baseField,
      adapter
    );
  }
  createValueControlledFieldWithAsyncAdapter(baseField, valueControlFn, fields) {
    const adapter = __privateGet(this, _adapterFactory).createAsyncAdapterFromFnWithFields(valueControlFn, fields);
    return baseField instanceof AbstractDualField ? new ValueControlledDualField(
      baseField,
      adapter
    ) : new ValueControlledField(
      baseField,
      adapter
    );
  }
};
_adapterFactory = new WeakMap();
var ControlledFieldFactoryService = autowire5(ControlledFieldFactoryImpl, ControlledFieldFactoryKey, [AdapterFactoryKey]);

// src/model/finalizers/finalizer-functions/finalizer-fn-factory-impl.ts
import { Observable as Observable2 } from "rxjs";

// src/model/finalizers/finalizer-functions/finalizer-fn-factory.interface.ts
var FinalizerFnFactoryKey = "FinalizerFnFactory";

// src/model/finalizers/finalizer-validity-translator.interface.ts
var FinalizerValidityTranslatorKey = "FinalizerValidityTranslator";

// src/model/finalizers/finalizer-functions/finalizer-fn-factory-impl.ts
import { autowire as autowire6 } from "undecorated-di";
var _finalizerValidityTranslator;
var FinalizerFnFactoryImpl = class {
  constructor(finalizerValidityTranslator) {
    __privateAdd(this, _finalizerValidityTranslator, void 0);
    __privateSet(this, _finalizerValidityTranslator, finalizerValidityTranslator);
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
          finalizerValidity: __privateGet(this, _finalizerValidityTranslator).translateValidityToFinalizerValidity(
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
      return new Observable2((subscriber) => {
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
            finalizerValidity: __privateGet(this, _finalizerValidityTranslator).translateValidityToFinalizerValidity(
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
_finalizerValidityTranslator = new WeakMap();
var FinalizerFnFactoryService = autowire6(FinalizerFnFactoryImpl, FinalizerFnFactoryKey, [
  FinalizerValidityTranslatorKey
]);

// src/model/finalizers/finalizer-validity-translator-impl.ts
import { autowire as autowire7 } from "undecorated-di";
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
var FinalizerValidityTranslatorService = autowire7(FinalizerValidityTranslatorImpl, FinalizerValidityTranslatorKey);

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
import { autowire as autowire8 } from "undecorated-di";
var _reducerFactory2;
var ProxyProducerFactoryImpl = class {
  constructor(reducerFactory) {
    __privateAdd(this, _reducerFactory2, void 0);
    __privateSet(this, _reducerFactory2, reducerFactory);
  }
  createAggregatedStateChangesProxyProducer() {
    return new AggregatedStateChangesProxyProducerImpl(
      __privateGet(this, _reducerFactory2).createFieldStateReducer()
    );
  }
};
_reducerFactory2 = new WeakMap();
var ProxyProducerFactoryService = autowire8(ProxyProducerFactoryImpl, ProxyProducerFactoryKey, [ReducerFactoryKey]);

// src/model/reducers/field-state/field-state-reducer-impl.ts
var _validityReducer, _omittedFields;
var FieldStateReducerImpl = class {
  constructor(validityReducer) {
    __privateAdd(this, _validityReducer, void 0);
    __privateAdd(this, _omittedFields, /* @__PURE__ */ new Set());
    __privateSet(this, _validityReducer, validityReducer);
  }
  get validity() {
    return __privateGet(this, _validityReducer).validity;
  }
  get omit() {
    return __privateGet(this, _omittedFields).size > 0;
  }
  updateTallies(fieldName, state) {
    const { validity, omit } = state;
    __privateGet(this, _validityReducer).updateTallies(fieldName, validity);
    if (omit)
      __privateGet(this, _omittedFields).add(fieldName);
    else
      __privateGet(this, _omittedFields).delete(fieldName);
  }
};
_validityReducer = new WeakMap();
_omittedFields = new WeakMap();

// src/model/reducers/multi-input-validator-validity/finalizer-facing-multi-input-validator-reducer.ts
import { BehaviorSubject as BehaviorSubject4 } from "rxjs";
var _validityReducer2, _multiInputValidators;
var FinalizerFacingMultiInputValidatorReducer = class {
  constructor(validityReducer) {
    __privateAdd(this, _validityReducer2, void 0);
    __privateAdd(this, _multiInputValidators, []);
    __privateSet(this, _validityReducer2, validityReducer);
    this.validityChanges = new BehaviorSubject4(
      __privateGet(this, _validityReducer2).validity
    );
  }
  get validity() {
    return __privateGet(this, _validityReducer2).validity;
  }
  addValidator(multiFieldValidator) {
    const validatorId = String(__privateGet(this, _multiInputValidators).length);
    __privateGet(this, _multiInputValidators).push(multiFieldValidator);
    multiFieldValidator.overallValidityChanges.subscribe(
      (validityChange) => {
        __privateGet(this, _validityReducer2).updateTallies(validatorId, validityChange);
        this.validityChanges.next(__privateGet(this, _validityReducer2).validity);
      }
    );
  }
};
_validityReducer2 = new WeakMap();
_multiInputValidators = new WeakMap();

// src/model/reducers/finalizer-validity/finalizer-validity-reducer-impl.ts
var _errantFinalizers, _fieldErrorFinalizers, _fieldInvalidFinalizers, _fieldPendingFinalizers, _fieldValidUnfinalizableFinalizers, _finalizingFinalizers;
var FinalizerValidityReducerImpl = class {
  constructor() {
    __privateAdd(this, _errantFinalizers, /* @__PURE__ */ new Set());
    __privateAdd(this, _fieldErrorFinalizers, /* @__PURE__ */ new Set());
    __privateAdd(this, _fieldInvalidFinalizers, /* @__PURE__ */ new Set());
    __privateAdd(this, _fieldPendingFinalizers, /* @__PURE__ */ new Set());
    __privateAdd(this, _fieldValidUnfinalizableFinalizers, /* @__PURE__ */ new Set());
    __privateAdd(this, _finalizingFinalizers, /* @__PURE__ */ new Set());
  }
  get finalizerValidity() {
    if (__privateGet(this, _errantFinalizers).size > 0)
      return -1 /* FINALIZER_ERROR */;
    else if (__privateGet(this, _fieldErrorFinalizers).size > 0)
      return 0 /* FIELD_ERROR */;
    else if (__privateGet(this, _fieldInvalidFinalizers).size > 0)
      return 1 /* FIELD_INVALID */;
    else if (__privateGet(this, _fieldPendingFinalizers).size > 0)
      return 2 /* FIELD_PENDING */;
    else if (__privateGet(this, _fieldValidUnfinalizableFinalizers).size > 0)
      return 3 /* FIELD_VALID_UNFINALIZABLE */;
    else if (__privateGet(this, _finalizingFinalizers).size > 0)
      return 4 /* VALID_FINALIZING */;
    return 5 /* VALID_FINALIZED */;
  }
  updateTallies(finalizerName, finalizerValidity) {
    this.updateTally(
      finalizerName,
      finalizerValidity,
      -1 /* FINALIZER_ERROR */,
      __privateGet(this, _errantFinalizers)
    );
    this.updateTally(
      finalizerName,
      finalizerValidity,
      0 /* FIELD_ERROR */,
      __privateGet(this, _fieldErrorFinalizers)
    );
    this.updateTally(
      finalizerName,
      finalizerValidity,
      1 /* FIELD_INVALID */,
      __privateGet(this, _fieldInvalidFinalizers)
    );
    this.updateTally(
      finalizerName,
      finalizerValidity,
      2 /* FIELD_PENDING */,
      __privateGet(this, _fieldPendingFinalizers)
    );
    this.updateTally(
      finalizerName,
      finalizerValidity,
      3 /* FIELD_VALID_UNFINALIZABLE */,
      __privateGet(this, _fieldValidUnfinalizableFinalizers)
    );
    this.updateTally(
      finalizerName,
      finalizerValidity,
      4 /* VALID_FINALIZING */,
      __privateGet(this, _finalizingFinalizers)
    );
  }
  updateTally(finalizerName, actualValidity, expectedValidity, set) {
    if (actualValidity === expectedValidity)
      set.add(finalizerName);
    else
      set.delete(finalizerName);
  }
};
_errantFinalizers = new WeakMap();
_fieldErrorFinalizers = new WeakMap();
_fieldInvalidFinalizers = new WeakMap();
_fieldPendingFinalizers = new WeakMap();
_fieldValidUnfinalizableFinalizers = new WeakMap();
_finalizingFinalizers = new WeakMap();

// src/model/reducers/multi-input-validator-validity/user-facing-multi-input-validator-reducer.ts
import { BehaviorSubject as BehaviorSubject5 } from "rxjs";
var _validityReducer3, _multiInputValidators2;
var UserFacingMultiInputValidatorReducer = class {
  constructor(validityReducer) {
    __privateAdd(this, _validityReducer3, void 0);
    __privateAdd(this, _multiInputValidators2, []);
    __privateSet(this, _validityReducer3, validityReducer);
    this.validityChanges = new BehaviorSubject5(
      __privateGet(this, _validityReducer3).validity
    );
  }
  get validity() {
    return __privateGet(this, _validityReducer3).validity;
  }
  addValidator(multiFieldValidator) {
    const validatorId = String(__privateGet(this, _multiInputValidators2).length);
    __privateGet(this, _multiInputValidators2).push(multiFieldValidator);
    multiFieldValidator.calculatedValidityChanges.subscribe(
      (validityChange) => {
        __privateGet(this, _validityReducer3).updateTallies(validatorId, validityChange);
        this.validityChanges.next(__privateGet(this, _validityReducer3).validity);
      }
    );
  }
};
_validityReducer3 = new WeakMap();
_multiInputValidators2 = new WeakMap();

// src/model/reducers/validity/validity-reducer-impl.ts
var _errantFields, _invalidFields, _pendingFields, _validUnfinalizableFields;
var ValidityReducerImpl = class {
  constructor() {
    __privateAdd(this, _errantFields, /* @__PURE__ */ new Set());
    __privateAdd(this, _invalidFields, /* @__PURE__ */ new Set());
    __privateAdd(this, _pendingFields, /* @__PURE__ */ new Set());
    __privateAdd(this, _validUnfinalizableFields, /* @__PURE__ */ new Set());
  }
  get validity() {
    if (__privateGet(this, _errantFields).size > 0)
      return 0 /* ERROR */;
    if (__privateGet(this, _invalidFields).size > 0)
      return 1 /* INVALID */;
    if (__privateGet(this, _pendingFields).size > 0)
      return 2 /* PENDING */;
    if (__privateGet(this, _validUnfinalizableFields).size > 0)
      return 3 /* VALID_UNFINALIZABLE */;
    return 4 /* VALID_FINALIZABLE */;
  }
  updateTallies(elementId, validity) {
    this.updateTally(elementId, validity, 0 /* ERROR */, __privateGet(this, _errantFields));
    this.updateTally(
      elementId,
      validity,
      1 /* INVALID */,
      __privateGet(this, _invalidFields)
    );
    this.updateTally(
      elementId,
      validity,
      2 /* PENDING */,
      __privateGet(this, _pendingFields)
    );
    this.updateTally(
      elementId,
      validity,
      3 /* VALID_UNFINALIZABLE */,
      __privateGet(this, _validUnfinalizableFields)
    );
  }
  updateTally(elementId, actualValidity, expectedValidity, set) {
    if (actualValidity === expectedValidity)
      set.add(elementId);
    else
      set.delete(elementId);
  }
};
_errantFields = new WeakMap();
_invalidFields = new WeakMap();
_pendingFields = new WeakMap();
_validUnfinalizableFields = new WeakMap();

// src/model/reducers/reducer-factory-impl.ts
import { autowire as autowire9 } from "undecorated-di";
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
var ReducerFactoryService = autowire9(ReducerFactoryImpl, ReducerFactoryKey);

// src/model/subjects/on-initial-subscription-handling-behavior-subject-impl.ts
import { BehaviorSubject as BehaviorSubject6 } from "rxjs";
var _onInitialSubscriptionEventEmitter;
var OnInitialSubscriptionHandlingBehaviorSubjectImpl = class extends BehaviorSubject6 {
  constructor(initialValue, onInitialSubscriptionEventEmitter) {
    super(initialValue);
    __privateAdd(this, _onInitialSubscriptionEventEmitter, void 0);
    __privateSet(this, _onInitialSubscriptionEventEmitter, onInitialSubscriptionEventEmitter);
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
    __privateGet(this, _onInitialSubscriptionEventEmitter).triggerEvent();
    return subscription;
  }
  onInitialSubscription(cb) {
    __privateGet(this, _onInitialSubscriptionEventEmitter).onEvent(cb);
  }
};
_onInitialSubscriptionEventEmitter = new WeakMap();

// src/model/subjects/subject-factory-impl.ts
import { autowire as autowire10 } from "undecorated-di";
var _emitterFactory2;
var SubjectFactoryImpl = class {
  constructor(emitterFactory) {
    __privateAdd(this, _emitterFactory2, void 0);
    __privateSet(this, _emitterFactory2, emitterFactory);
  }
  createOnInitialSubscriptionHandlingBehaviorSubject(initialValue) {
    return new OnInitialSubscriptionHandlingBehaviorSubjectImpl(
      initialValue,
      __privateGet(this, _emitterFactory2).createOneTimeEventEmitter()
    );
  }
};
_emitterFactory2 = new WeakMap();
var SubjectFactoryService = autowire10(SubjectFactoryImpl, SubjectFactoryKey, [EmitterFactoryKey]);

// src/model/validators/single-input/async-single-input-validator-suite.ts
import { Observable as Observable3, from as from2 } from "rxjs";
var _validators, _pendingValidatorMessage, _validatorSubscriptions;
var AsyncSingleInputValidatorSuite = class {
  constructor(validators, pendingValidatorMessage) {
    __privateAdd(this, _validators, void 0);
    __privateAdd(this, _pendingValidatorMessage, void 0);
    __privateAdd(this, _validatorSubscriptions, {});
    __privateSet(this, _validators, validators);
    __privateSet(this, _pendingValidatorMessage, pendingValidatorMessage);
  }
  evaluate(value) {
    this.unsubscribeAll();
    const result = {
      syncResult: {
        value,
        validity: 2 /* PENDING */,
        messages: [
          {
            type: "PENDING" /* PENDING */,
            text: __privateGet(this, _pendingValidatorMessage)
          }
        ]
      }
    };
    result.observable = new Observable3((subscriber) => {
      const observableResult = {
        value,
        validity: 4 /* VALID_FINALIZABLE */,
        messages: []
      };
      for (let validatorId = 0; validatorId < __privateGet(this, _validators).length; validatorId++) {
        const validator = __privateGet(this, _validators)[validatorId];
        try {
          const promise = validator(value);
          const subscription = from2(promise).subscribe(
            this.createValidatorObserver(
              observableResult,
              subscriber,
              validatorId
            )
          );
          __privateGet(this, _validatorSubscriptions)[validatorId] = subscription;
        } catch (e) {
          this.createValidatorObserverErrorMethod(
            observableResult,
            subscriber
          )(e);
        }
      }
    });
    return result;
  }
  createValidatorObserver(observableResult, outerSubscriber, validatorId) {
    return {
      next: this.createValidatorObserverNextMethod(
        observableResult,
        outerSubscriber,
        validatorId
      ),
      error: this.createValidatorObserverErrorMethod(
        observableResult,
        outerSubscriber
      )
    };
  }
  createValidatorObserverNextMethod(observableResult, outerSubscriber, validatorId) {
    const nextMethod = (next) => {
      const { isValid, message: messageTxt } = next;
      if (!isValid) {
        this.unsubscribeAll();
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
        this.unsubscribeById(validatorId);
        if (this.allValidatorsCompleted()) {
          outerSubscriber.next(observableResult);
          outerSubscriber.complete();
        }
      }
    };
    return nextMethod;
  }
  createValidatorObserverErrorMethod(observableResult, outerSubscriber) {
    const errorMethod = (e) => {
      this.unsubscribeAll();
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
  unsubscribeAll() {
    for (const key in __privateGet(this, _validatorSubscriptions)) {
      __privateGet(this, _validatorSubscriptions)[key].unsubscribe();
    }
    __privateSet(this, _validatorSubscriptions, {});
  }
  unsubscribeById(validatorId) {
    __privateGet(this, _validatorSubscriptions)[validatorId].unsubscribe();
    delete __privateGet(this, _validatorSubscriptions)[validatorId];
  }
  allValidatorsCompleted() {
    return Object.keys(__privateGet(this, _validatorSubscriptions)).length === 0;
  }
};
_validators = new WeakMap();
_pendingValidatorMessage = new WeakMap();
_validatorSubscriptions = new WeakMap();

// src/model/validators/single-input/hybrid-single-input-validator-suite.ts
var _syncValidatorSuite, _asyncValidatorSuite;
var HybridSingleInputValidatorSuite = class {
  constructor(syncValidatorSuite, asyncValidatorSuite) {
    __privateAdd(this, _syncValidatorSuite, void 0);
    __privateAdd(this, _asyncValidatorSuite, void 0);
    __privateSet(this, _syncValidatorSuite, syncValidatorSuite);
    __privateSet(this, _asyncValidatorSuite, asyncValidatorSuite);
  }
  evaluate(value) {
    const result = __privateGet(this, _syncValidatorSuite).evaluate(value);
    if (result.syncResult.validity <= 1 /* INVALID */)
      return result;
    const asyncResult = __privateGet(this, _asyncValidatorSuite).evaluate(value);
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
_syncValidatorSuite = new WeakMap();
_asyncValidatorSuite = new WeakMap();

// src/model/validators/single-input/sync-single-input-validator-suite.ts
var _validators2;
var SyncSingleInputValidatorSuite = class {
  constructor(validators) {
    __privateAdd(this, _validators2, void 0);
    __privateSet(this, _validators2, validators);
  }
  evaluate(value) {
    return {
      syncResult: this.evaluateSync(value)
    };
  }
  evaluateSync(value) {
    const result = {
      value,
      validity: 4 /* VALID_FINALIZABLE */,
      messages: []
    };
    try {
      for (const validator of __privateGet(this, _validators2)) {
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
_validators2 = new WeakMap();

// src/model/validators/single-input/single-input-validator-suite-factory-impl.ts
import { autowire as autowire11 } from "undecorated-di";
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
var SingleInputValidatorSuiteFactoryService = autowire11(SingleInputValidatorSuiteFactoryImpl, SingleInputValidatorSuiteFactoryKey);

// src/model/insertion-order-heap/insertion-order-heap-factory.interface.ts
var InsertionOrderHeapFactoryKey = "InsertionOrderHeapFactory";

// src/model/insertion-order-heap/insertion-order-heap-factory-impl.ts
import { autowire as autowire12 } from "undecorated-di";

// src/model/insertion-order-heap/insertion-order-heap-impl.ts
var _heap, _elementDictionary, _currentPriorityId;
var InsertionOrderHeapImpl = class {
  constructor() {
    __privateAdd(this, _heap, []);
    __privateAdd(this, _elementDictionary, {});
    __privateAdd(this, _currentPriorityId, 0);
  }
  get size() {
    return __privateGet(this, _heap).length;
  }
  get topValue() {
    var _a;
    return (_a = __privateGet(this, _heap)[0]) == null ? void 0 : _a.value;
  }
  addValue(value) {
    const elementDictionaryKey = value;
    if (!(elementDictionaryKey in __privateGet(this, _elementDictionary))) {
      __privateGet(this, _elementDictionary)[elementDictionaryKey] = {
        priorityId: __privateWrapper(this, _currentPriorityId)._++,
        currentHeapIndex: -1
      };
    }
    const dictionaryValue = __privateGet(this, _elementDictionary)[elementDictionaryKey];
    if (dictionaryValue.currentHeapIndex >= 0)
      return;
    const heapElement = {
      priorityId: dictionaryValue.priorityId,
      value
    };
    this.addHeapElement(heapElement);
  }
  removeValue(value) {
    const heapIndex = __privateGet(this, _elementDictionary)[value].currentHeapIndex;
    this.removeHeapElementAtIndex(heapIndex);
  }
  addHeapElement(heapElement) {
    __privateGet(this, _heap).push(heapElement);
    const heapIndex = this.size - 1;
    __privateGet(this, _elementDictionary)[heapElement.value].currentHeapIndex = heapIndex;
    this.heapifyUp(heapIndex);
  }
  removeHeapElementAtIndex(heapIndex) {
    if (this.size === 0 || heapIndex === -1)
      return;
    if (heapIndex === this.size - 1) {
      const removedElement = __privateGet(this, _heap)[heapIndex];
      __privateGet(this, _heap).pop();
      __privateGet(this, _elementDictionary)[removedElement.value].currentHeapIndex = -1;
    } else {
      const removedElement = __privateGet(this, _heap)[heapIndex];
      const elevatedElement = __privateGet(this, _heap)[heapIndex] = __privateGet(this, _heap)[this.size - 1];
      __privateGet(this, _elementDictionary)[removedElement.value].currentHeapIndex = -1;
      __privateGet(this, _elementDictionary)[elevatedElement.value].currentHeapIndex = heapIndex;
      this.heapifyDown(heapIndex);
    }
  }
  heapifyDown(heapIndex) {
    const leftChild = this.leftChild(heapIndex);
    const rightChild = this.rightChild(heapIndex);
    let smallest = heapIndex;
    if (leftChild < this.size && this.compareHeapElements(__privateGet(this, _heap)[leftChild], __privateGet(this, _heap)[smallest]) < 0) {
      smallest = leftChild;
    }
    if (rightChild < this.size && this.compareHeapElements(__privateGet(this, _heap)[rightChild], __privateGet(this, _heap)[smallest]) < 0) {
      smallest = rightChild;
    }
    if (smallest != heapIndex) {
      const element = __privateGet(this, _heap)[heapIndex];
      const smallestElement = __privateGet(this, _heap)[smallest];
      __privateGet(this, _elementDictionary)[element.value].currentHeapIndex = smallest;
      __privateGet(this, _elementDictionary)[smallestElement.value].currentHeapIndex = heapIndex;
      __privateGet(this, _heap)[heapIndex] = smallestElement;
      __privateGet(this, _heap)[smallest] = element;
      this.heapifyDown(smallest);
    }
  }
  heapifyUp(heapIndex) {
    while (heapIndex != 0 && this.compareHeapElements(
      __privateGet(this, _heap)[this.parent(heapIndex)],
      __privateGet(this, _heap)[heapIndex]
    ) > 0) {
      const temp = __privateGet(this, _heap)[this.parent(heapIndex)];
      __privateGet(this, _heap)[this.parent(heapIndex)] = __privateGet(this, _heap)[heapIndex];
      __privateGet(this, _heap)[heapIndex] = temp;
      __privateGet(this, _elementDictionary)[__privateGet(this, _heap)[this.parent(heapIndex)].value].currentHeapIndex = this.parent(heapIndex);
      __privateGet(this, _elementDictionary)[__privateGet(this, _heap)[heapIndex].value].currentHeapIndex = heapIndex;
      heapIndex = this.parent(heapIndex);
    }
  }
  parent(heapIndex) {
    return Math.floor((heapIndex - 1) / 2);
  }
  leftChild(heapIndex) {
    return heapIndex * 2 + 1;
  }
  rightChild(heapIndex) {
    return heapIndex * 2 + 2;
  }
  compareHeapElements(a, b) {
    return a.priorityId - b.priorityId;
  }
};
_heap = new WeakMap();
_elementDictionary = new WeakMap();
_currentPriorityId = new WeakMap();

// src/model/insertion-order-heap/insertion-order-heap-factory-impl.ts
var InsertionOrderHeapFactoryImpl = class {
  createInsertionOrderHeap() {
    return new InsertionOrderHeapImpl();
  }
};
var InsertionOrderHeapFactoryService = autowire12(InsertionOrderHeapFactoryImpl, InsertionOrderHeapFactoryKey);

// src/model/trackers/tracker-factory.interface.ts
var TrackerFactoryKey = "TrackerFactory";

// src/model/trackers/first-nonvalid-form-element-tracker-impl.ts
import { BehaviorSubject as BehaviorSubject7 } from "rxjs";
var _nonValidFormElementHeap;
var FirstNonValidFormElementTrackerImpl = class {
  constructor(nonValidFormElementHeap) {
    __privateAdd(this, _nonValidFormElementHeap, void 0);
    __privateSet(this, _nonValidFormElementHeap, nonValidFormElementHeap);
    this.firstNonValidFormElementChanges = new BehaviorSubject7(
      this.firstNonValidFormElement
    );
  }
  get firstNonValidFormElement() {
    return __privateGet(this, _nonValidFormElementHeap).topValue;
  }
  trackFormElementValidity(formElementKey, formElement) {
    __privateGet(this, _nonValidFormElementHeap).addValue(formElementKey);
    formElement.stateChanges.subscribe(({ validity }) => {
      if (validity < 4 /* VALID_FINALIZABLE */) {
        __privateGet(this, _nonValidFormElementHeap).addValue(formElementKey);
      } else
        __privateGet(this, _nonValidFormElementHeap).removeValue(formElementKey);
      this.firstNonValidFormElementChanges.next(this.firstNonValidFormElement);
    });
  }
};
_nonValidFormElementHeap = new WeakMap();

// src/model/trackers/tracker-factory-impl.ts
import { autowire as autowire13 } from "undecorated-di";
var _insertionOrderHeapFactory;
var TrackerFactoryImpl = class {
  constructor(insertionOrderHeapFactory) {
    __privateAdd(this, _insertionOrderHeapFactory, void 0);
    __privateSet(this, _insertionOrderHeapFactory, insertionOrderHeapFactory);
  }
  createFirstNonValidFormElementTracker() {
    return new FirstNonValidFormElementTrackerImpl(
      __privateGet(this, _insertionOrderHeapFactory).createInsertionOrderHeap()
    );
  }
};
_insertionOrderHeapFactory = new WeakMap();
var TrackerFactoryService = autowire13(TrackerFactoryImpl, TrackerFactoryKey, [InsertionOrderHeapFactoryKey]);

// src/model/validators/multi-input/multi-input-validator-factory-impl.ts
import { autowire as autowire14 } from "undecorated-di";

// src/model/validators/multi-input/async-multi-input-validator.ts
import { ReplaySubject as ReplaySubject3, from as from3 } from "rxjs";
var _pendingMessage, _multiFieldAggregator, _validator, _validatorSubscription, _firstRunCompleted;
var AsyncMultiInputValidator = class {
  constructor(multiFieldAggregator, validator, pendingMessage) {
    __privateAdd(this, _pendingMessage, void 0);
    __privateAdd(this, _multiFieldAggregator, void 0);
    __privateAdd(this, _validator, void 0);
    __privateAdd(this, _validatorSubscription, void 0);
    __privateAdd(this, _firstRunCompleted, false);
    __privateSet(this, _validator, validator);
    __privateSet(this, _multiFieldAggregator, multiFieldAggregator);
    __privateSet(this, _pendingMessage, pendingMessage);
    this.accessedFields = multiFieldAggregator.accessedFields;
    this.calculatedValidityChanges = new ReplaySubject3(1);
    this.overallValidityChanges = new ReplaySubject3(1);
    this.messageChanges = new ReplaySubject3(1);
    __privateGet(this, _multiFieldAggregator).aggregateChanges.subscribe(
      (aggregateChange) => {
        __privateGet(this, _validatorSubscription) && __privateGet(this, _validatorSubscription).unsubscribe();
        let observableResult;
        let error;
        if (!__privateGet(this, _firstRunCompleted)) {
          try {
            observableResult = from3(__privateGet(this, _validator).call(this, aggregateChange));
          } catch (e) {
            logErrorInDevMode(e);
            error = e;
          } finally {
            __privateSet(this, _firstRunCompleted, true);
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
            text: __privateGet(this, _pendingMessage)
          });
          try {
            if (!observableResult)
              observableResult = from3(__privateGet(this, _validator).call(this, aggregateChange));
            __privateSet(this, _validatorSubscription, observableResult.subscribe({
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
            }));
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
_pendingMessage = new WeakMap();
_multiFieldAggregator = new WeakMap();
_validator = new WeakMap();
_validatorSubscription = new WeakMap();
_firstRunCompleted = new WeakMap();

// src/model/validators/multi-input/multi-input-validator-factory.interface.ts
var MultiInputValidatorFactoryKey = "MultiInputValidatorFactory";

// src/model/validators/multi-input/sync-multi-input-validator.ts
import { ReplaySubject as ReplaySubject4 } from "rxjs";
var _multiFieldAggregator2, _validator2, _completedFirstRun;
var SyncMultiInputValidator = class {
  constructor(multiFieldAggregator, validator) {
    __privateAdd(this, _multiFieldAggregator2, void 0);
    __privateAdd(this, _validator2, void 0);
    __privateAdd(this, _completedFirstRun, false);
    __privateSet(this, _validator2, validator);
    __privateSet(this, _multiFieldAggregator2, multiFieldAggregator);
    this.accessedFields = multiFieldAggregator.accessedFields;
    this.calculatedValidityChanges = new ReplaySubject4(1);
    this.overallValidityChanges = new ReplaySubject4(1);
    this.messageChanges = new ReplaySubject4(1);
    __privateGet(this, _multiFieldAggregator2).aggregateChanges.subscribe(
      (aggregateChange) => {
        let result;
        if (!__privateGet(this, _completedFirstRun)) {
          result = this.runValidator(aggregateChange);
          __privateSet(this, _completedFirstRun, true);
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
          result = this.runValidator(aggregateChange);
          this.calculatedValidityChanges.next(result.validity);
          this.overallValidityChanges.next(result.validity);
          this.messageChanges.next(result.message);
        }
      }
    );
  }
  runValidator(aggregateChange) {
    try {
      let message;
      const result = __privateGet(this, _validator2).call(this, aggregateChange);
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
_multiFieldAggregator2 = new WeakMap();
_validator2 = new WeakMap();
_completedFirstRun = new WeakMap();

// src/model/validators/multi-input/multi-input-validator-factory-impl.ts
var _aggregatorFactory2;
var MultiInputValidatorFactoryImpl = class {
  constructor(aggregatorFactory) {
    __privateAdd(this, _aggregatorFactory2, void 0);
    __privateSet(this, _aggregatorFactory2, aggregatorFactory);
  }
  createSyncMultiInputValidator(validator, fields) {
    const multiFieldAggregator = __privateGet(this, _aggregatorFactory2).createMultiFieldAggregatorFromFields(fields);
    return new SyncMultiInputValidator(multiFieldAggregator, validator);
  }
  createAsyncMultiInputValidator(validator, fields, pendingMessage = config.globalMessages.pendingAsyncMultiFieldValidator) {
    const multiFieldAggregator = __privateGet(this, _aggregatorFactory2).createMultiFieldAggregatorFromFields(fields);
    return new AsyncMultiInputValidator(
      multiFieldAggregator,
      validator,
      pendingMessage
    );
  }
};
_aggregatorFactory2 = new WeakMap();
var MultiInputValidatorFactoryService = autowire14(MultiInputValidatorFactoryImpl, MultiInputValidatorFactoryKey, [
  AggregatorFactoryKey
]);

// src/model/form-elements/multi-input-validated/finalizer-facing-multi-input-validated-form-element.ts
import { BehaviorSubject as BehaviorSubject8 } from "rxjs";
var _baseFormElement, _multiInputValidatorReducer;
var FinalizerFacingMultiInputValidatedFormElement = class {
  constructor(baseFormElement, finalizerFacingMultiInputValidityReducer) {
    __privateAdd(this, _baseFormElement, void 0);
    __privateAdd(this, _multiInputValidatorReducer, void 0);
    __privateSet(this, _baseFormElement, baseFormElement);
    __privateSet(this, _multiInputValidatorReducer, finalizerFacingMultiInputValidityReducer);
    __privateGet(this, _multiInputValidatorReducer).validityChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject8(this.state);
  }
  get state() {
    return __spreadProps(__spreadValues({}, copyObject(__privateGet(this, _baseFormElement).state)), {
      validity: this.calculateValidity()
    });
  }
  get omit() {
    return __privateGet(this, _baseFormElement).omit;
  }
  addValidator(validator) {
    __privateGet(this, _multiInputValidatorReducer).addValidator(validator);
  }
  calculateValidity() {
    return Math.min(
      __privateGet(this, _baseFormElement).state.validity,
      __privateGet(this, _multiInputValidatorReducer).validity
    );
  }
};
_baseFormElement = new WeakMap();
_multiInputValidatorReducer = new WeakMap();

// src/model/form-elements/multi-input-validated/multi-input-validated-form-element-factory.interface.ts
var MultiInputValidatedFormElementFactoryKey = "MultiInputValidatedFormElementFactory";

// src/model/form-elements/multi-input-validated/user-facing-multi-input-validated-dual-field.ts
import { BehaviorSubject as BehaviorSubject9 } from "rxjs";
var _baseField, _multiInputValidatorReducer2;
var UserFacingMultiInputValidatedDualField = class extends AbstractDualField {
  constructor(baseField, multiInputValidityReducer) {
    super();
    __privateAdd(this, _baseField, void 0);
    __privateAdd(this, _multiInputValidatorReducer2, void 0);
    __privateSet(this, _baseField, baseField);
    __privateSet(this, _multiInputValidatorReducer2, multiInputValidityReducer);
    __privateGet(this, _baseField).stateChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    __privateGet(this, _multiInputValidatorReducer2).validityChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject9(this.state);
  }
  get state() {
    return __spreadProps(__spreadValues({}, copyObject(__privateGet(this, _baseField).state)), {
      validity: this.calculateValidity()
    });
  }
  get omit() {
    return __privateGet(this, _baseField).omit;
  }
  set omit(omit) {
    __privateGet(this, _baseField).omit = omit;
  }
  get primaryField() {
    return __privateGet(this, _baseField).primaryField;
  }
  get secondaryField() {
    return __privateGet(this, _baseField).secondaryField;
  }
  set useSecondaryField(useSecondaryField) {
    __privateGet(this, _baseField).useSecondaryField = useSecondaryField;
  }
  get useSecondaryField() {
    return __privateGet(this, _baseField).useSecondaryField;
  }
  setValue(value) {
    __privateGet(this, _baseField).setValue(value);
  }
  setState(state) {
    __privateGet(this, _baseField).setState(state);
  }
  reset() {
    __privateGet(this, _baseField).reset();
  }
  addValidator(validator) {
    __privateGet(this, _multiInputValidatorReducer2).addValidator(validator);
  }
  calculateValidity() {
    return Math.min(
      __privateGet(this, _baseField).state.validity,
      __privateGet(this, _multiInputValidatorReducer2).validity
    );
  }
};
_baseField = new WeakMap();
_multiInputValidatorReducer2 = new WeakMap();

// src/model/form-elements/multi-input-validated/user-facing-multi-input-validated-field.ts
import { BehaviorSubject as BehaviorSubject10 } from "rxjs";
var _baseField2, _multiInputValidatorReducer3;
var UserFacingMultiInputValidatedField = class extends AbstractField {
  constructor(baseField, userFacingMultiInputValidityReducer) {
    super();
    __privateAdd(this, _baseField2, void 0);
    __privateAdd(this, _multiInputValidatorReducer3, void 0);
    __privateSet(this, _baseField2, baseField);
    __privateSet(this, _multiInputValidatorReducer3, userFacingMultiInputValidityReducer);
    __privateGet(this, _multiInputValidatorReducer3).validityChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject10(this.state);
  }
  get state() {
    return __spreadProps(__spreadValues({}, copyObject(__privateGet(this, _baseField2).state)), {
      validity: this.calculateValidity()
    });
  }
  get omit() {
    return __privateGet(this, _baseField2).omit;
  }
  set omit(omit) {
    __privateGet(this, _baseField2).omit = omit;
  }
  setState(state) {
    __privateGet(this, _baseField2).setState(state);
  }
  setValue(value) {
    __privateGet(this, _baseField2).setValue(value);
  }
  reset() {
    __privateGet(this, _baseField2).reset();
  }
  addValidator(validator) {
    __privateGet(this, _multiInputValidatorReducer3).addValidator(validator);
  }
  calculateValidity() {
    return Math.min(
      __privateGet(this, _baseField2).state.validity,
      __privateGet(this, _multiInputValidatorReducer3).validity
    );
  }
};
_baseField2 = new WeakMap();
_multiInputValidatorReducer3 = new WeakMap();

// src/model/form-elements/multi-input-validated/user-facing-multi-input-validated-nested-form.ts
import { BehaviorSubject as BehaviorSubject11 } from "rxjs";

// src/model/forms/abstract-nested-form.ts
var AbstractNestedForm = class {
};

// src/model/form-elements/multi-input-validated/user-facing-multi-input-validated-nested-form.ts
var _baseNestedForm, _multiInputValidatorReducer4;
var UserFacingMultiInputValidatedNestedForm = class extends AbstractNestedForm {
  constructor(baseNestedForm, userFacingMultiInputValidityReducer) {
    super();
    __privateAdd(this, _baseNestedForm, void 0);
    __privateAdd(this, _multiInputValidatorReducer4, void 0);
    __privateSet(this, _baseNestedForm, baseNestedForm);
    __privateSet(this, _multiInputValidatorReducer4, userFacingMultiInputValidityReducer);
    __privateGet(this, _baseNestedForm).stateChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    __privateGet(this, _multiInputValidatorReducer4).validityChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject11(this.state);
  }
  get userFacingFields() {
    return __privateGet(this, _baseNestedForm).userFacingFields;
  }
  get state() {
    return __spreadProps(__spreadValues({}, copyObject(__privateGet(this, _baseNestedForm).state)), {
      validity: this.calculateValidity()
    });
  }
  set omit(omit) {
    __privateGet(this, _baseNestedForm).omit = omit;
  }
  get omit() {
    return __privateGet(this, _baseNestedForm).omit;
  }
  get firstNonValidFormElement() {
    return __privateGet(this, _baseNestedForm).firstNonValidFormElement;
  }
  reset() {
    throw new Error("Method not implemented.");
  }
  addValidator(validator) {
    __privateGet(this, _multiInputValidatorReducer4).addValidator(validator);
  }
  calculateValidity() {
    return Math.min(
      __privateGet(this, _baseNestedForm).state.validity,
      __privateGet(this, _multiInputValidatorReducer4).validity
    );
  }
};
_baseNestedForm = new WeakMap();
_multiInputValidatorReducer4 = new WeakMap();

// src/model/form-elements/multi-input-validated/multi-input-validated-form-element-factory-impl.ts
import { autowire as autowire15 } from "undecorated-di";
var _reducerFactory3;
var MultiInputValidatedFormElementFactoryImpl = class {
  constructor(reducerFactory) {
    __privateAdd(this, _reducerFactory3, void 0);
    __privateSet(this, _reducerFactory3, reducerFactory);
  }
  createUserAndFinalizerFacingMultiInputValidatedFormElement(baseField) {
    const userFacingReducer = __privateGet(this, _reducerFactory3).createUserMultiInputValidatorValidityReducer();
    const finalizerFacingReducer = __privateGet(this, _reducerFactory3).createFinalizerFacingMultiInputValidatorValidityReducer();
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
_reducerFactory3 = new WeakMap();
var MultiInputValidatedFormElementFactoryService = autowire15(
  MultiInputValidatedFormElementFactoryImpl,
  MultiInputValidatedFormElementFactoryKey,
  [ReducerFactoryKey]
);

// src/model/templates/multi-field-validators/multi-field-validators-template-parser-impl.ts
import { autowire as autowire16 } from "undecorated-di";

// src/model/templates/multi-field-validators/multi-field-validators-template-parser.interface.ts
var MultiFieldValidatorsTemplateParserKey = "MultiFieldValidatorsTemplateParser";

// src/model/fields/auto-transformed/auto-transformed-field-factory.interface.ts
var AutoTransformedFieldFactoryKey = "AutoTransformedFieldFactory";

// src/model/templates/multi-field-validators/multi-field-validators-template-parser-impl.ts
var _multiInputValidatorFactory, _multiInputValidatedFormElementFactory, _aggregatorFactory3, _autoTransformedFieldFactory;
var MultiFieldValidatorsTemplateParserImpl = class {
  constructor(multiInputValidatorFactory, multiInputValidatedFormElementFactory, aggregatorFactory, autoTransformedFieldFactory) {
    __privateAdd(this, _multiInputValidatorFactory, void 0);
    __privateAdd(this, _multiInputValidatedFormElementFactory, void 0);
    __privateAdd(this, _aggregatorFactory3, void 0);
    __privateAdd(this, _autoTransformedFieldFactory, void 0);
    __privateSet(this, _multiInputValidatorFactory, multiInputValidatorFactory);
    __privateSet(this, _multiInputValidatedFormElementFactory, multiInputValidatedFormElementFactory);
    __privateSet(this, _aggregatorFactory3, aggregatorFactory);
    __privateSet(this, _autoTransformedFieldFactory, autoTransformedFieldFactory);
  }
  parseTemplate(template, formElementDictionary) {
    var _a, _b;
    const userFacingMultiInputValidatedFormElementDictionary = {};
    const finalizerFacingMultiInputValidatedFormElementDictionary = {};
    const validators = [];
    (_a = template.sync) == null ? void 0 : _a.forEach((validatorFn) => {
      const multiInputValidator = __privateGet(this, _multiInputValidatorFactory).createSyncMultiInputValidator(
        validatorFn,
        formElementDictionary
      );
      multiInputValidator.accessedFields.onValue(
        this.onAccessedFields(
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
      const multiInputValidator = __privateGet(this, _multiInputValidatorFactory).createAsyncMultiInputValidator(
        validatorTemplate.validatorFn,
        formElementDictionary,
        (_a2 = validatorTemplate.pendingValidatorMessage) != null ? _a2 : config.globalMessages.pendingAsyncMultiFieldValidator
      );
      multiInputValidator.accessedFields.onValue(
        this.onAccessedFields(
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
        finalizerFacingFormElementDictionary[fieldName] = __privateGet(this, _autoTransformedFieldFactory).createAutoTransformedField(
          field
        );
      }
    }
    const multiInputValidatorMessagesAggregator = __privateGet(this, _aggregatorFactory3).createMultiInputValidatorMessagesAggregatorFromValidators(
      validators
    );
    return [
      userFacingFormElementDictionary,
      finalizerFacingFormElementDictionary,
      multiInputValidatorMessagesAggregator
    ];
  }
  onAccessedFields(userFacingFormElementDictionary, finalizerFacingFormElementDictionary, formElementDictionary, validator) {
    return (accessedFields) => {
      accessedFields.forEach((fieldName) => {
        if (!(fieldName in userFacingFormElementDictionary)) {
          const baseField = formElementDictionary[fieldName];
          const [userFacingField, finalizerFacingField] = __privateGet(this, _multiInputValidatedFormElementFactory).createUserAndFinalizerFacingMultiInputValidatedFormElement(
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
_multiInputValidatorFactory = new WeakMap();
_multiInputValidatedFormElementFactory = new WeakMap();
_aggregatorFactory3 = new WeakMap();
_autoTransformedFieldFactory = new WeakMap();
var MultiFieldValidatorsTemplateParserService = autowire16(
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
import { autowire as autowire17 } from "undecorated-di";

// src/model/finalizers/finalizer-manager-factory.interface.ts
var FinalizerManagerFactoryKey = "FinalizerManager";

// src/model/finalizers/finalizer-manager-impl.ts
import { BehaviorSubject as BehaviorSubject12 } from "rxjs";
var _value2, _finalizerMap, _finalizerValidityReducer, _finalizerValidityTranslator2;
var FinalizerManagerImpl = class {
  constructor(finalizerMap, finalizerValidityReducer, finalizerValidityTranslator) {
    __privateAdd(this, _value2, {});
    __privateAdd(this, _finalizerMap, void 0);
    __privateAdd(this, _finalizerValidityReducer, void 0);
    __privateAdd(this, _finalizerValidityTranslator2, void 0);
    __privateSet(this, _finalizerMap, finalizerMap);
    __privateSet(this, _finalizerValidityReducer, finalizerValidityReducer);
    __privateSet(this, _finalizerValidityTranslator2, finalizerValidityTranslator);
    for (const finalizerName in __privateGet(this, _finalizerMap)) {
      const finalizer = __privateGet(this, _finalizerMap)[finalizerName];
      finalizer.stream.subscribe((finalizerStateChange) => {
        __privateGet(this, _finalizerValidityReducer).updateTallies(
          finalizerName,
          finalizerStateChange.finalizerValidity
        );
        delete __privateGet(this, _value2)[finalizerName];
        if (finalizerStateChange.value)
          __privateGet(this, _value2)[finalizerName] = finalizerStateChange.value;
        if (this.stateChanges)
          this.stateChanges.next(this.state);
      });
    }
    this.stateChanges = new BehaviorSubject12(this.state);
  }
  get state() {
    return {
      value: copyObject(__privateGet(this, _value2)),
      validity: this.getValidity(),
      messages: this.getMessages()
    };
  }
  getValidity() {
    const reducedFinalizerValidity = __privateGet(this, _finalizerValidityReducer).finalizerValidity;
    return __privateGet(this, _finalizerValidityTranslator2).translateFinalizerValidityToValidity(
      reducedFinalizerValidity
    );
  }
  getMessages() {
    const messages = [];
    const reducedFinalizerValidity = __privateGet(this, _finalizerValidityReducer).finalizerValidity;
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
_value2 = new WeakMap();
_finalizerMap = new WeakMap();
_finalizerValidityReducer = new WeakMap();
_finalizerValidityTranslator2 = new WeakMap();

// src/model/finalizers/finalizer-manager-factory-impl.ts
var _reducerFactory4, _finalizerValidityTranslator3;
var FinalizerManagerFactoryImpl = class {
  constructor(reducerFactory, finalizerValidityTranslator) {
    __privateAdd(this, _reducerFactory4, void 0);
    __privateAdd(this, _finalizerValidityTranslator3, void 0);
    __privateSet(this, _reducerFactory4, reducerFactory);
    __privateSet(this, _finalizerValidityTranslator3, finalizerValidityTranslator);
  }
  createFinalizerManager(finalizerDictionary) {
    const finalizerValidityReducer = __privateGet(this, _reducerFactory4).createFinalizerValidityReducer();
    return new FinalizerManagerImpl(
      finalizerDictionary,
      finalizerValidityReducer,
      __privateGet(this, _finalizerValidityTranslator3)
    );
  }
};
_reducerFactory4 = new WeakMap();
_finalizerValidityTranslator3 = new WeakMap();
var FinalizerManagerFactoryService = autowire17(FinalizerManagerFactoryImpl, FinalizerManagerFactoryKey, [
  ReducerFactoryKey,
  FinalizerValidityTranslatorKey
]);

// src/model/finalizers/finalizer-factory-impl.ts
import { autowire as autowire18 } from "undecorated-di";

// src/model/finalizers/async-finalizer.ts
var AsyncFinalizer = class extends AsyncAdapter {
  constructor(finalizerFn, aggregator) {
    super(finalizerFn, aggregator);
    this.accessedFields = aggregator.accessedFields;
  }
};

// src/model/finalizers/default-finalizer.ts
import { BehaviorSubject as BehaviorSubject13 } from "rxjs";
var _field5, _finalizerValidityTranslator4;
var DefaultFinalizer = class {
  constructor(field, finalizerValidityTranslator) {
    __privateAdd(this, _field5, void 0);
    __privateAdd(this, _finalizerValidityTranslator4, void 0);
    __privateSet(this, _field5, field);
    __privateSet(this, _finalizerValidityTranslator4, finalizerValidityTranslator);
    __privateGet(this, _field5).stateChanges.subscribe((stateChange) => {
      var _a;
      (_a = this.stream) == null ? void 0 : _a.next(this.getFinalizerState(stateChange));
    });
    this.stream = new BehaviorSubject13(
      this.getFinalizerState(__privateGet(this, _field5).state)
    );
  }
  getFinalizerState(fieldState) {
    if (fieldState.validity < 4 /* VALID_FINALIZABLE */)
      return {
        finalizerValidity: __privateGet(this, _finalizerValidityTranslator4).translateValidityToFinalizerValidity(
          fieldState.validity
        )
      };
    return {
      finalizerValidity: 5 /* VALID_FINALIZED */,
      value: fieldState.value
    };
  }
};
_field5 = new WeakMap();
_finalizerValidityTranslator4 = new WeakMap();

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
var _aggregatorFactory4, _finalizerValidityTranslator5;
var FinalizerFactoryImpl = class {
  constructor(aggregatorFactory, finalizerValidityTranslator) {
    __privateAdd(this, _aggregatorFactory4, void 0);
    __privateAdd(this, _finalizerValidityTranslator5, void 0);
    __privateSet(this, _aggregatorFactory4, aggregatorFactory);
    __privateSet(this, _finalizerValidityTranslator5, finalizerValidityTranslator);
  }
  createSyncFinalizer(finalizerFn, fields) {
    const aggregator = __privateGet(this, _aggregatorFactory4).createMultiFieldAggregatorFromFields(fields);
    return new SyncFinalizer(finalizerFn, aggregator);
  }
  createAsyncFinalizer(finalizerFn, fields) {
    const aggregator = __privateGet(this, _aggregatorFactory4).createMultiFieldAggregatorFromFields(fields);
    return new AsyncFinalizer(finalizerFn, aggregator);
  }
  createDefaultFinalizer(baseField) {
    return new DefaultFinalizer(baseField, __privateGet(this, _finalizerValidityTranslator5));
  }
};
_aggregatorFactory4 = new WeakMap();
_finalizerValidityTranslator5 = new WeakMap();
var FinalizerFactoryService = autowire18(FinalizerFactoryImpl, FinalizerFactoryKey, [
  AggregatorFactoryKey,
  FinalizerValidityTranslatorKey
]);

// src/model/submission/submission-manager-factory-impl.ts
import { autowire as autowire19 } from "undecorated-di";

// src/model/submission/submission-manager-factory.interface.ts
var SubmissionManagerFactoryKey = "SubmissionManagerFactory";

// src/model/submission/submission-manager-impl.ts
import { BehaviorSubject as BehaviorSubject14 } from "rxjs";
var _submitFn, _submissionState;
var SubmissionManagerImpl = class {
  constructor(submitFn) {
    __privateAdd(this, _submitFn, void 0);
    __privateAdd(this, _submissionState, {
      submissionAttempted: false
    });
    this.submissionStateChanges = new BehaviorSubject14(this.submissionState);
    __privateSet(this, _submitFn, submitFn);
  }
  set submissionState(submissionState) {
    __privateSet(this, _submissionState, submissionState);
    this.submissionStateChanges.next(this.submissionState);
  }
  get submissionState() {
    return copyObject(__privateGet(this, _submissionState));
  }
  submit(state) {
    this.submissionState = {
      submissionAttempted: true
    };
    return new Promise((resolve, reject) => {
      if (state.validity < 4 /* VALID_FINALIZABLE */) {
        this.submissionState = __spreadProps(__spreadValues({}, __privateGet(this, _submissionState)), {
          message: {
            type: "INVALID" /* INVALID */,
            text: config.globalMessages.submissionFailed
          }
        });
        reject(new Error(config.globalMessages.submissionFailed));
      } else {
        __privateGet(this, _submitFn).call(this, state).then((res) => {
          resolve(res);
        }).catch((e) => {
          if (e.message)
            this.submissionState = __spreadProps(__spreadValues({}, __privateGet(this, _submissionState)), {
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
_submitFn = new WeakMap();
_submissionState = new WeakMap();

// src/model/submission/submission-manager-factory-impl.ts
var SubmissionManagerFactoryImpl = class {
  createSubmissionManager(submitFn) {
    return new SubmissionManagerImpl(submitFn);
  }
};
var SubmissionManagerFactoryService = autowire19(SubmissionManagerFactoryImpl, SubmissionManagerFactoryKey);

// src/model/templates/forms/nested-form-template-parser-impl.ts
import { autowire as autowire20 } from "undecorated-di";

// src/model/forms/nested-form.ts
import { BehaviorSubject as BehaviorSubject15 } from "rxjs";
var _firstNonValidFormElementTracker, _finalizerManager, _multiFieldValidatorMessagesAggregator, _omitByDefault3, _omit2;
var NestedForm = class extends AbstractNestedForm {
  constructor(userFacingFields, firstNonValidFormElementTracker, finalizerManager, multiFieldValidatorMessagesAggregator, omitByDefault) {
    super();
    __privateAdd(this, _firstNonValidFormElementTracker, void 0);
    __privateAdd(this, _finalizerManager, void 0);
    __privateAdd(this, _multiFieldValidatorMessagesAggregator, void 0);
    __privateAdd(this, _omitByDefault3, void 0);
    __privateAdd(this, _omit2, void 0);
    this.userFacingFields = userFacingFields;
    __privateSet(this, _firstNonValidFormElementTracker, firstNonValidFormElementTracker);
    __privateSet(this, _finalizerManager, finalizerManager);
    __privateSet(this, _multiFieldValidatorMessagesAggregator, multiFieldValidatorMessagesAggregator);
    __privateSet(this, _omitByDefault3, omitByDefault);
    __privateSet(this, _omit2, __privateGet(this, _omitByDefault3));
    __privateGet(this, _multiFieldValidatorMessagesAggregator).messagesChanges.subscribe(
      () => {
        var _a;
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
      }
    );
    __privateGet(this, _finalizerManager).stateChanges.subscribe(() => {
      var _a;
      if (this.stateChanges)
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
    });
    this.stateChanges = new BehaviorSubject15(this.state);
  }
  get state() {
    return copyObject(__spreadProps(__spreadValues({}, __privateGet(this, _finalizerManager).state), {
      messages: [
        ...__privateGet(this, _multiFieldValidatorMessagesAggregator).messages,
        ...__privateGet(this, _finalizerManager).state.messages
      ],
      omit: __privateGet(this, _omit2)
    }));
  }
  get firstNonValidFormElement() {
    return __privateGet(this, _firstNonValidFormElementTracker).firstNonValidFormElement;
  }
  get firstNonValidFormElementChanges() {
    return __privateGet(this, _firstNonValidFormElementTracker).firstNonValidFormElementChanges;
  }
  set omit(omit) {
    __privateSet(this, _omit2, omit);
    if (this.stateChanges)
      this.stateChanges.next(this.state);
  }
  get omit() {
    return __privateGet(this, _omit2);
  }
  reset() {
    __privateSet(this, _omit2, __privateGet(this, _omitByDefault3));
    for (const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }
};
_firstNonValidFormElementTracker = new WeakMap();
_finalizerManager = new WeakMap();
_multiFieldValidatorMessagesAggregator = new WeakMap();
_omitByDefault3 = new WeakMap();
_omit2 = new WeakMap();

// src/model/templates/finalizers/finalizer-template-dictionary-parser.interface.ts
var FinalizerTemplateDictionaryParserKey = "FinalizerTemplateDictionaryParser";

// src/model/templates/form-elements/form-element-template-dictionary-parser.interface.ts
var FormElementTemplateDictionaryParserKey = "FormElementTemplateDictionaryParser";

// src/model/templates/forms/nested-form-template-parser.interface.ts
var NestedFormTemplateParserKey = "NestedFormTemplateParser";

// src/model/templates/forms/nested-form-template-parser-impl.ts
var _formElementTemplateDictionaryParser, _multiFieldValidatorsTemplateParser, _finalizerTemplateDictionaryParser;
var NestedFormTemplateParserImpl = class {
  constructor(formElementTemplateDictionaryParser, multiFieldValidatorsTemplateParser, finalizerTemplateDictionaryParser) {
    __privateAdd(this, _formElementTemplateDictionaryParser, void 0);
    __privateAdd(this, _multiFieldValidatorsTemplateParser, void 0);
    __privateAdd(this, _finalizerTemplateDictionaryParser, void 0);
    __privateSet(this, _formElementTemplateDictionaryParser, formElementTemplateDictionaryParser);
    __privateSet(this, _multiFieldValidatorsTemplateParser, multiFieldValidatorsTemplateParser);
    __privateSet(this, _finalizerTemplateDictionaryParser, finalizerTemplateDictionaryParser);
  }
  parseTemplate(template) {
    var _a, _b, _c;
    const [baseFields, firstNonValidFormElementTracker] = __privateGet(this, _formElementTemplateDictionaryParser).parseTemplate(template.fields);
    const multiFieldValidatorsTemplate = (_a = template.multiFieldValidators) != null ? _a : {};
    const [
      userFacingFields,
      finalizerFacingFields,
      multiInputValidatorMessagesAggregator
    ] = __privateGet(this, _multiFieldValidatorsTemplateParser).parseTemplate(
      multiFieldValidatorsTemplate,
      baseFields
    );
    const finalizedFields = (_b = template.finalizedFields) != null ? _b : {};
    const finalizerManager = __privateGet(this, _finalizerTemplateDictionaryParser).parseTemplate(
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
_formElementTemplateDictionaryParser = new WeakMap();
_multiFieldValidatorsTemplateParser = new WeakMap();
_finalizerTemplateDictionaryParser = new WeakMap();
var NestedFormTemplateParserService = autowire20(NestedFormTemplateParserImpl, NestedFormTemplateParserKey, [
  FormElementTemplateDictionaryParserKey,
  MultiFieldValidatorsTemplateParserKey,
  FinalizerTemplateDictionaryParserKey
]);

// src/model/templates/forms/root-form-template-parser-impl.ts
import { autowire as autowire21 } from "undecorated-di";

// src/model/forms/root-form.ts
import { BehaviorSubject as BehaviorSubject16 } from "rxjs";

// src/model/forms/abstract-root-form.ts
var AbstractRootForm = class {
};

// src/model/forms/root-form.ts
var _firstNonValidFormElementTracker2, _finalizerManager2, _multiFieldValidatorMessagesAggregator2, _submissionManager;
var RootForm = class extends AbstractRootForm {
  constructor(userFacingFields, firstNonValidFormElementTracker, finalizerManager, multiFieldValidatorMessagesAggregator, submissionManager) {
    super();
    __privateAdd(this, _firstNonValidFormElementTracker2, void 0);
    __privateAdd(this, _finalizerManager2, void 0);
    __privateAdd(this, _multiFieldValidatorMessagesAggregator2, void 0);
    __privateAdd(this, _submissionManager, void 0);
    this.userFacingFields = userFacingFields;
    __privateSet(this, _firstNonValidFormElementTracker2, firstNonValidFormElementTracker);
    __privateSet(this, _finalizerManager2, finalizerManager);
    __privateSet(this, _multiFieldValidatorMessagesAggregator2, multiFieldValidatorMessagesAggregator);
    __privateSet(this, _submissionManager, submissionManager);
    __privateGet(this, _multiFieldValidatorMessagesAggregator2).messagesChanges.subscribe(
      () => {
        var _a;
        (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
      }
    );
    __privateGet(this, _finalizerManager2).stateChanges.subscribe(() => {
      var _a;
      __privateGet(this, _submissionManager).clearMessage();
      (_a = this.stateChanges) == null ? void 0 : _a.next(this.state);
    });
    __privateGet(this, _submissionManager).submissionStateChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
      if (this.submissionStateChanges)
        this.submissionStateChanges.next(this.submissionState);
    });
    this.submissionStateChanges = new BehaviorSubject16(this.submissionState);
    this.stateChanges = new BehaviorSubject16(this.state);
  }
  get state() {
    const messages = this.aggregateMessages();
    return copyObject(__spreadProps(__spreadValues({}, __privateGet(this, _finalizerManager2).state), {
      messages
    }));
  }
  get firstNonValidFormElement() {
    return __privateGet(this, _firstNonValidFormElementTracker2).firstNonValidFormElement;
  }
  get firstNonValidFormElementChanges() {
    return __privateGet(this, _firstNonValidFormElementTracker2).firstNonValidFormElementChanges;
  }
  get submissionState() {
    return {
      submissionAttempted: __privateGet(this, _submissionManager).submissionState.submissionAttempted
    };
  }
  submit() {
    return __async(this, null, function* () {
      return __privateGet(this, _submissionManager).submit(this.state);
    });
  }
  reset() {
    __privateGet(this, _submissionManager).reset();
    for (const fieldName in this.userFacingFields) {
      this.userFacingFields[fieldName].reset();
    }
  }
  aggregateMessages() {
    const messages = [
      ...__privateGet(this, _multiFieldValidatorMessagesAggregator2).messages,
      ...__privateGet(this, _finalizerManager2).state.messages
    ];
    if (__privateGet(this, _submissionManager).submissionState.message)
      messages.push(__privateGet(this, _submissionManager).submissionState.message);
    return messages;
  }
};
_firstNonValidFormElementTracker2 = new WeakMap();
_finalizerManager2 = new WeakMap();
_multiFieldValidatorMessagesAggregator2 = new WeakMap();
_submissionManager = new WeakMap();

// src/model/templates/forms/root-form-template-parser.interface.ts
var RootFormTemplateParserKey = "RootFormTemplateParser";

// src/model/templates/forms/root-form-template-parser-impl.ts
var _formElementTemplateDictionaryParser2, _multiFieldValidatorsTemplateParser2, _finalizerTemplateDictionaryParser2, _submissionManagerFactory;
var RootFormTemplateParserImpl = class {
  constructor(formElementTemplateDictionaryParser, multiFieldValidatorsTemplateParser, finalizerTemplateDictionaryParser, submissionManagerFactory) {
    __privateAdd(this, _formElementTemplateDictionaryParser2, void 0);
    __privateAdd(this, _multiFieldValidatorsTemplateParser2, void 0);
    __privateAdd(this, _finalizerTemplateDictionaryParser2, void 0);
    __privateAdd(this, _submissionManagerFactory, void 0);
    __privateSet(this, _formElementTemplateDictionaryParser2, formElementTemplateDictionaryParser);
    __privateSet(this, _multiFieldValidatorsTemplateParser2, multiFieldValidatorsTemplateParser);
    __privateSet(this, _finalizerTemplateDictionaryParser2, finalizerTemplateDictionaryParser);
    __privateSet(this, _submissionManagerFactory, submissionManagerFactory);
  }
  parseTemplate(template) {
    var _a, _b;
    const [baseFields, firstNonValidFormElementTracker] = __privateGet(this, _formElementTemplateDictionaryParser2).parseTemplate(template.fields);
    const multiFieldValidatorsTemplate = (_a = template.multiFieldValidators) != null ? _a : {};
    const [
      userFacingFields,
      finalizerFacingFields,
      multiInputValidatorMessagesAggregator
    ] = __privateGet(this, _multiFieldValidatorsTemplateParser2).parseTemplate(
      multiFieldValidatorsTemplate,
      baseFields
    );
    const finalizedFields = (_b = template.finalizedFields) != null ? _b : {};
    const finalizerManager = __privateGet(this, _finalizerTemplateDictionaryParser2).parseTemplate(
      finalizedFields,
      finalizerFacingFields
    );
    const submissionManager = __privateGet(this, _submissionManagerFactory).createSubmissionManager(template.submitFn);
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
_formElementTemplateDictionaryParser2 = new WeakMap();
_multiFieldValidatorsTemplateParser2 = new WeakMap();
_finalizerTemplateDictionaryParser2 = new WeakMap();
_submissionManagerFactory = new WeakMap();
var RootFormTemplateParserService = autowire21(RootFormTemplateParserImpl, RootFormTemplateParserKey, [
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
import { autowire as autowire22 } from "undecorated-di";
var _baseFieldTemplateParser, _controlledFieldTemplateParser, _nestedFormTemplateParser, _trackerFactory;
var FormElementDictionaryParserImpl = class {
  constructor(baseFieldTemplateParser, controlledFieldTemplateParser, nestedFormTemplateParser, trackerFactory) {
    __privateAdd(this, _baseFieldTemplateParser, void 0);
    __privateAdd(this, _controlledFieldTemplateParser, void 0);
    __privateAdd(this, _nestedFormTemplateParser, void 0);
    __privateAdd(this, _trackerFactory, void 0);
    __privateSet(this, _baseFieldTemplateParser, baseFieldTemplateParser);
    __privateSet(this, _controlledFieldTemplateParser, controlledFieldTemplateParser);
    __privateSet(this, _nestedFormTemplateParser, nestedFormTemplateParser);
    __privateSet(this, _trackerFactory, trackerFactory);
  }
  parseTemplate(template) {
    const formElementDictionary = {};
    const firstNonValidFormElementTracker = __privateGet(this, _trackerFactory).createFirstNonValidFormElementTracker();
    const controlledFields = /* @__PURE__ */ new Set();
    for (const [fieldName, formElementTemplate] of Object.entries(template)) {
      const formElement = this.isNestedForm(formElementTemplate) ? __privateGet(this, _nestedFormTemplateParser).parseTemplate(formElementTemplate) : __privateGet(this, _baseFieldTemplateParser).parseTemplate(formElementTemplate);
      formElementDictionary[fieldName] = formElement;
      firstNonValidFormElementTracker.trackFormElementValidity(
        fieldName,
        formElement
      );
      if (this.isControlledField(formElementTemplate))
        controlledFields.add(fieldName);
    }
    for (const fieldName of controlledFields) {
      const formElementTemplate = template instanceof Map ? template.get(fieldName) : template[fieldName];
      formElementDictionary[fieldName] = __privateGet(this, _controlledFieldTemplateParser).parseTemplateAndDecorateField(
        formElementDictionary[fieldName],
        formElementTemplate,
        formElementDictionary
      );
    }
    return [formElementDictionary, firstNonValidFormElementTracker];
  }
  isNestedForm(template) {
    return typeof template === "object" && "fields" in template;
  }
  isControlledField(template) {
    return typeof template === "object" && ("asyncStateControlFn" in template || "syncStateControlFn" in template || "asyncValueControlFn" in template || "syncValueControlFn" in template);
  }
};
_baseFieldTemplateParser = new WeakMap();
_controlledFieldTemplateParser = new WeakMap();
_nestedFormTemplateParser = new WeakMap();
_trackerFactory = new WeakMap();
var FormElementTemplateDictionaryParserService = autowire22(FormElementDictionaryParserImpl, FormElementTemplateDictionaryParserKey, [
  BaseFieldTemplateParserKey,
  ControlledFieldTemplateParserKey,
  NestedFormTemplateParserKey,
  TrackerFactoryKey
]);

// src/model/templates/fields/base/base-field-template-parser-impl.ts
import { autowire as autowire23 } from "undecorated-di";

// src/model/templates/fields/base/base-field-parsing-error.ts
var BaseFieldParsingError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "BaseFieldParsingError";
  }
};

// src/model/templates/fields/base/base-field-template-parser-impl.ts
var _baseFieldFactory;
var BaseFieldTemplateParserImpl = class {
  constructor(baseFieldFactory) {
    __privateAdd(this, _baseFieldFactory, void 0);
    __privateSet(this, _baseFieldFactory, baseFieldFactory);
  }
  parseTemplate(template) {
    if (typeof template === "string")
      return this.parseString(template);
    else {
      const templateType = this.determineTemplateType(template);
      if (templateType === "DUAL_FIELD" /* DUAL_FIELD */) {
        return this.parseDualFieldTemplate(template);
      } else
        return this.parseFieldTemplate(template);
    }
  }
  parseString(template) {
    return __privateGet(this, _baseFieldFactory).createField(template, false, [], []);
  }
  determineTemplateType(template) {
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
  parseFieldTemplate(template) {
    if (typeof template.defaultValue !== "string") {
      throw new BaseFieldParsingError(
        "BaseFieldTemplateParser received a template object whose defaultValue was not of type 'string'"
      );
    }
    this.validateBaseFieldTemplate(template);
    const baseFieldProps = this.extractBaseFieldProperties(template);
    return __privateGet(this, _baseFieldFactory).createField(
      template.defaultValue,
      ...baseFieldProps,
      template.pendingAsyncValidatorMessage
    );
  }
  parseDualFieldTemplate(template) {
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
    this.validateBaseFieldTemplate(template);
    const extractBaseFieldProperties = this.extractBaseFieldProperties(template);
    return __privateGet(this, _baseFieldFactory).createDualField(
      template.primaryDefaultValue,
      template.secondaryDefaultValue,
      ...extractBaseFieldProperties,
      template.pendingAsyncValidatorMessage
    );
  }
  validateBaseFieldTemplate(template) {
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
  extractBaseFieldProperties(template) {
    var _a, _b, _c;
    const omitByDefault = (_a = template.omitByDefault) != null ? _a : false;
    const syncValidators = (_b = template.syncValidators) != null ? _b : [];
    const asyncValidators = (_c = template.asyncValidators) != null ? _c : [];
    return [omitByDefault, syncValidators, asyncValidators];
  }
};
_baseFieldFactory = new WeakMap();
var BaseFieldTemplateParserService = autowire23(BaseFieldTemplateParserImpl, BaseFieldTemplateParserKey, [
  BaseFieldFactoryKey
]);

// src/model/templates/fields/controlled/controlled-field-template-parser-impl.ts
import { autowire as autowire24 } from "undecorated-di";

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
var _controlledFieldFactory;
var ControlledFieldTemplateParserImpl = class {
  constructor(controlledFieldFactory) {
    __privateAdd(this, _controlledFieldFactory, void 0);
    __privateSet(this, _controlledFieldFactory, controlledFieldFactory);
  }
  parseTemplateAndDecorateField(baseField, template, fields) {
    if (!(baseField instanceof AbstractField)) {
      throw new ControlledFieldTemplateParsingError(
        "ControlledFieldTemplateParser expected instanceof AbstractField."
      );
    }
    const controlFnType = this.getControlFnType(template);
    switch (controlFnType) {
      case "syncStateControlFn" /* SYNC_STATE_CONTROL_FN */:
        return __privateGet(this, _controlledFieldFactory).createStateControlledFieldWithSyncAdapter(
          baseField,
          template.syncStateControlFn,
          fields
        );
      case "asyncStateControlFn" /* ASYNC_STATE_CONTROL_FN */:
        return __privateGet(this, _controlledFieldFactory).createStateControlledFieldWithAsyncAdapter(
          baseField,
          template.asyncStateControlFn,
          fields
        );
      case "syncValueControlFn" /* SYNC_VALUE_CONTROL_FN */:
        return __privateGet(this, _controlledFieldFactory).createValueControlledFieldWithSyncAdapter(
          baseField,
          template.syncValueControlFn,
          fields
        );
      case "asyncValueControlFn" /* ASYNC_VALUE_CONTROL_FN */:
        return __privateGet(this, _controlledFieldFactory).createValueControlledFieldWithAsyncAdapter(
          baseField,
          template.asyncValueControlFn,
          fields
        );
    }
  }
  getControlFnType(template) {
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
_controlledFieldFactory = new WeakMap();
var ControlledFieldTemplateParserService = autowire24(ControlledFieldTemplateParserImpl, ControlledFieldTemplateParserKey, [
  ControlledFieldFactoryKey
]);

// src/model/templates/finalizers/finalizer-template-dictionary-parser-impl.ts
import { autowire as autowire25 } from "undecorated-di";
var _finalizerFnFactory, _finalizerFactory, _finalizerManagerFactory;
var FinalizerTemplateDictionaryParserImpl = class {
  constructor(finalizerFnFactory, finalizerFactory, finalizerManagerFactory) {
    __privateAdd(this, _finalizerFnFactory, void 0);
    __privateAdd(this, _finalizerFactory, void 0);
    __privateAdd(this, _finalizerManagerFactory, void 0);
    __privateSet(this, _finalizerFnFactory, finalizerFnFactory);
    __privateSet(this, _finalizerFactory, finalizerFactory);
    __privateSet(this, _finalizerManagerFactory, finalizerManagerFactory);
  }
  parseTemplate(template, finalizerFacingFields) {
    const finalizers = {};
    let originalFieldsToPreserve = /* @__PURE__ */ new Set();
    for (const [finalizerName, finalizerTemplate] of Object.entries(template)) {
      if (finalizerTemplate.syncFinalizerFn) {
        const finalizerFn = __privateGet(this, _finalizerFnFactory).createSyncFinalizerFn(
          finalizerTemplate.syncFinalizerFn
        );
        const finalizer = __privateGet(this, _finalizerFactory).createSyncFinalizer(
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
        const finalizerFn = __privateGet(this, _finalizerFnFactory).createAsyncFinalizerFn(
          finalizerTemplate.asyncFinalizerFn
        );
        const finalizer = __privateGet(this, _finalizerFactory).createAsyncFinalizer(
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
        finalizers[fieldName] = __privateGet(this, _finalizerFactory).createDefaultFinalizer(field);
      }
    }
    return __privateGet(this, _finalizerManagerFactory).createFinalizerManager(finalizers);
  }
};
_finalizerFnFactory = new WeakMap();
_finalizerFactory = new WeakMap();
_finalizerManagerFactory = new WeakMap();
var FinalizerTemplateDictionaryParserService = autowire25(FinalizerTemplateDictionaryParserImpl, FinalizerTemplateDictionaryParserKey, [
  FinalizerFnFactoryKey,
  FinalizerFactoryKey,
  FinalizerManagerFactoryKey
]);

// src/model/auto-transforms/auto-transformer-impl.ts
import { autowire as autowire26 } from "undecorated-di";

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
var AutoTransformerService = autowire26(AutoTransformerImpl, AutoTransformerKey);

// src/model/fields/auto-transformed/auto-transformed-field-factory-impl.ts
import { autowire as autowire27 } from "undecorated-di";

// src/model/fields/auto-transformed/auto-transformed-field.ts
import { BehaviorSubject as BehaviorSubject17 } from "rxjs";
var _baseField3, _autoTransformer;
var AutoTransformedField = class extends AbstractField {
  constructor(baseField, autoTransformer17) {
    super();
    __privateAdd(this, _baseField3, void 0);
    __privateAdd(this, _autoTransformer, void 0);
    __privateSet(this, _baseField3, baseField);
    __privateSet(this, _autoTransformer, autoTransformer17);
    __privateGet(this, _baseField3).stateChanges.subscribe(() => {
      if (this.stateChanges)
        this.stateChanges.next(this.state);
    });
    this.stateChanges = new BehaviorSubject17(this.state);
  }
  get omit() {
    return __privateGet(this, _baseField3).omit;
  }
  set omit(omit) {
    __privateGet(this, _baseField3).omit = omit;
  }
  get state() {
    return __spreadProps(__spreadValues({}, __privateGet(this, _baseField3).state), {
      value: __privateGet(this, _autoTransformer).transform(__privateGet(this, _baseField3).state.value)
    });
  }
  setState(state) {
    __privateGet(this, _baseField3).setState(state);
  }
  setValue(value) {
    __privateGet(this, _baseField3).setValue(value);
  }
  reset() {
    __privateGet(this, _baseField3).reset();
  }
};
_baseField3 = new WeakMap();
_autoTransformer = new WeakMap();

// src/model/fields/auto-transformed/auto-transformed-field-factory-impl.ts
var _autoTransformer2;
var AutoTransformedFieldFactoryImpl = class {
  constructor(autoTransformer17) {
    __privateAdd(this, _autoTransformer2, void 0);
    __privateSet(this, _autoTransformer2, autoTransformer17);
  }
  createAutoTransformedField(baseField) {
    return new AutoTransformedField(baseField, __privateGet(this, _autoTransformer2));
  }
};
_autoTransformer2 = new WeakMap();
var AutoTransformedFieldFactoryService = autowire27(AutoTransformedFieldFactoryImpl, AutoTransformedFieldFactoryKey, [
  AutoTransformerKey
]);

// src/model/container.ts
var container = ContainerBuilder.createContainerBuilder().registerSingletonService(AdapterFactoryService).registerSingletonService(AggregatorFactoryService).registerSingletonService(EmitterFactoryService).registerSingletonService(BaseFieldFactoryService).registerSingletonService(BaseFieldTemplateParserService).registerSingletonService(ControlledFieldTemplateParserService).registerSingletonService(ControlledFieldFactoryService).registerSingletonService(ProxyProducerFactoryService).registerSingletonService(ReducerFactoryService).registerSingletonService(SubjectFactoryService).registerSingletonService(SingleInputValidatorSuiteFactoryService).registerSingletonService(InsertionOrderHeapFactoryService).registerSingletonService(TrackerFactoryService).registerSingletonService(MultiInputValidatorFactoryService).registerSingletonService(MultiInputValidatedFormElementFactoryService).registerSingletonService(MultiFieldValidatorsTemplateParserService).registerSingletonService(FinalizerFnFactoryService).registerSingletonService(FinalizerValidityTranslatorService).registerSingletonService(FinalizerFactoryService).registerSingletonService(FinalizerManagerFactoryService).registerSingletonService(FinalizerTemplateDictionaryParserService).registerSingletonService(SubmissionManagerFactoryService).registerSingletonService(FormElementTemplateDictionaryParserService).registerSingletonService(NestedFormTemplateParserService).registerSingletonService(RootFormTemplateParserService).registerSingletonService(AutoTransformerService).registerSingletonService(AutoTransformedFieldFactoryService).build();

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
import { useRef as useRef7, useMemo } from "react";

// src/hooks/use-form-state.ts
import { useState, useEffect, useRef } from "react";
function useFormState(form) {
  const [value, setValue] = useState(form.state.value);
  const [validity, setValidity] = useState(form.state.validity);
  const [messages, setMessages] = useState(form.state.messages);
  const subRef = useRef(null);
  useEffect(() => {
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
import { useState as useState2, useEffect as useEffect2, useRef as useRef2 } from "react";
function useFirstNonValidFormElement(form) {
  const [firstNonValidFormElement, setFirstNonValidFormElement] = useState2(
    form.firstNonValidFormElement
  );
  const subRef = useRef2(null);
  useEffect2(() => {
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
import { useState as useState3, useEffect as useEffect3, useRef as useRef3 } from "react";
function useField(field) {
  const [value, setValue] = useState3(field.state.value);
  const [validity, setValidity] = useState3(field.state.validity);
  const [messages, setMessages] = useState3(field.state.messages);
  const stateChangesSubRef = useRef3(null);
  useEffect3(() => {
    stateChangesSubRef.current = field.stateChanges.subscribe((change) => {
      setValue(change.value);
      setValidity(change.validity);
      setMessages(change.messages);
    });
    return () => {
      var _a;
      return (_a = stateChangesSubRef.current) == null ? void 0 : _a.unsubscribe();
    };
  }, []);
  const updateValue = (value2) => {
    field.setValue(value2);
  };
  const reset = field.reset;
  return {
    value,
    validity,
    messages,
    updateValue,
    reset
  };
}

// src/hooks/use-switch-to-secondary-field.ts
import { useRef as useRef4, useEffect as useEffect4, useState as useState4 } from "react";
function useSwitchToSecondaryField(dualField) {
  const [useSecondaryField, _setUseSecondaryField] = useState4(dualField.useSecondaryField);
  const stateChangesSubRef = useRef4(null);
  useEffect4(() => {
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
  return {
    usePrimaryField,
    useSecondaryField,
    useSwitchToSecondaryField: useSwitchToSecondaryField2
  };
}

// src/hooks/use-omittable-form-element.ts
import { useState as useState5, useEffect as useEffect5, useRef as useRef5 } from "react";
function useOmittableFormElement(formElement) {
  const [omitFormElement, _setOmitFormElement] = useState5(formElement.omit);
  const subRef = useRef5(null);
  useEffect5(() => {
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
  const { reset } = form;
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
import { useState as useState6, useEffect as useEffect6, useRef as useRef6 } from "react";
function useSubmissionAttempted(form) {
  const [submissionAttempted, setSubmissionAttempted] = useState6(
    form.submissionState.submissionAttempted
  );
  const subRef = useRef6(null);
  useEffect6(() => {
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
  const form = useMemo(() => rootFormTemplateParser.parseTemplate(template), [template]);
  const formRef = useRef7(form);
  const useSubmissionAttempted2 = () => useSubmissionAttempted(formRef.current);
  const { submit } = formRef.current;
  return __spreadProps(__spreadValues({}, useForm(formRef.current)), {
    useSubmissionAttempted: useSubmissionAttempted2,
    submit
  });
}

// src/components/field-messages.component.tsx
import React3, { useContext } from "react";

// src/components/form-context.ts
import { createContext } from "react";
var FormContext = createContext(null);

// src/components/messages.component.tsx
import React2, { useState as useState7, useEffect as useEffect7 } from "react";

// src/components/default-message.component.tsx
import React from "react";
var DefaultMessage = ({ className, type, text }) => {
  return /* @__PURE__ */ React.createElement("span", { className, "data-type": type }, text);
};

// src/components/messages.component.tsx
function Messages({
  messages,
  messagesContainerClassName = "messages",
  messageClassName = "message",
  MessageComponent = DefaultMessage
}) {
  const [statefulMessages, setStatefulMessages] = useState7(messages);
  useEffect7(() => {
    setStatefulMessages(messages);
  }, [messages]);
  return /* @__PURE__ */ React2.createElement("div", { className: messagesContainerClassName }, statefulMessages.map((message, index) => {
    return /* @__PURE__ */ React2.createElement(MessageComponent, { type: message.type, text: message.text, className: messageClassName, key: index.toString() });
  }));
}

// src/components/field-messages.component.tsx
function FieldMessages({
  fieldName,
  messagesContainerClassName,
  messageClassName,
  MessageComponent
}) {
  const formCtx = useContext(FormContext);
  if (formCtx === null)
    throw new Error("FieldMessages cannot access useField property of null FormContext");
  else {
    const { useField: useField2 } = formCtx;
    const { messages } = useField2(fieldName);
    return /* @__PURE__ */ React3.createElement(Messages, { messages, messagesContainerClassName, messageClassName, MessageComponent });
  }
}

// src/components/form-messages.component.tsx
import React4, { useContext as useContext2 } from "react";
function FormMessages({
  messagesContainerClassName,
  messageClassName,
  MessageComponent
}) {
  const formCtx = useContext2(FormContext);
  if (formCtx === null)
    throw new Error("FieldMessages cannot access useField property of null FormContext");
  else {
    const { messages } = formCtx.useFormState();
    return /* @__PURE__ */ React4.createElement(Messages, { messages, messagesContainerClassName, messageClassName, MessageComponent });
  }
}

// src/components/input-group.component.tsx
import React7 from "react";

// src/components/label.component.tsx
import React5, { useContext as useContext3 } from "react";

// src/components/util/validity-to-string.ts
function validityToString(validity) {
  switch (validity) {
    case 0 /* ERROR */:
      return "error";
    case 1 /* INVALID */:
      return "invalid";
    case 2 /* PENDING */:
      return "pending";
    case 3 /* VALID_UNFINALIZABLE */:
    case 4 /* VALID_FINALIZABLE */:
      return "valid";
  }
}

// src/components/label.component.tsx
function Label({ fieldName, labelText, labelClassName = "label" }) {
  const formCtx = useContext3(FormContext);
  if (formCtx === null)
    throw new Error("Input cannot access property useField of null FormContext");
  else {
    const { useField: useField2 } = formCtx;
    const { validity } = useField2(fieldName);
    return /* @__PURE__ */ React5.createElement("label", { htmlFor: fieldName, className: labelClassName, "data-validity": validityToString(validity) }, labelText);
  }
}

// src/components/input.component.tsx
import React6, { useContext as useContext4 } from "react";
function Input({ fieldName, inputType, inputClassName, readOnly = false }) {
  const formCtx = useContext4(FormContext);
  if (formCtx === null)
    throw new Error("Input cannot access property useField of null FormContext");
  else {
    const { useField: useField2 } = formCtx;
    const { value, validity, updateValue } = useField2(fieldName);
    return /* @__PURE__ */ React6.createElement("input", { id: fieldName, type: inputType, className: inputClassName, readOnly, "data-validity": validityToString(validity), value, onChange: (e) => {
      console.log(e.target.value);
      updateValue(e.target.value);
    } });
  }
}

// src/components/input-group.component.tsx
function InputGroup({ fieldName, inputGroupClassName, inputClassName, inputType, readOnly, labelText, labelClassName, messageClassName, messagesContainerClassName, MessageComponent }) {
  return /* @__PURE__ */ React7.createElement("div", { className: inputGroupClassName }, /* @__PURE__ */ React7.createElement(Label, { fieldName, labelText, labelClassName }), /* @__PURE__ */ React7.createElement(Input, { fieldName, inputClassName, inputType, readOnly }), /* @__PURE__ */ React7.createElement(FieldMessages, { fieldName, messagesContainerClassName, messageClassName, MessageComponent }));
}

// src/components/nested-form-provider.component.tsx
import React8, { useContext as useContext5 } from "react";
function NestedFormProvider({ fieldName, children }) {
  const formCtx = useContext5(FormContext);
  if (formCtx === null)
    throw new Error("NestedFormProvider cannot access useNestedForm property of null context.");
  else {
    const { useNestedForm } = formCtx;
    const nestedForm = useNestedForm(fieldName);
    return /* @__PURE__ */ React8.createElement(FormContext.Provider, { value: nestedForm }, children);
  }
}

// src/components/reset-button.component.tsx
import React9, { useContext as useContext6, useEffect as useEffect8, useState as useState8 } from "react";
function ResetButton(props) {
  const [disabled, setDisabled] = useState8(props.disabled);
  const formCtx = useContext6(FormContext);
  useEffect8(() => {
    setDisabled(props.disabled);
  }, [props.disabled]);
  if (formCtx === null)
    throw new Error("Reset button cannot read property reset of null FormContext");
  else {
    const { reset } = formCtx;
    return /* @__PURE__ */ React9.createElement("button", { onClick: reset, className: props.className, disabled }, "Reset");
  }
}

// src/components/root-form-provider.component.tsx
import React10, { createContext as createContext2 } from "react";
var RootFormContext = createContext2(null);
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
  return /* @__PURE__ */ React10.createElement(RootFormContext.Provider, { value: rootFormCtxValue }, /* @__PURE__ */ React10.createElement(FormContext.Provider, { value: formCtxValue }, children));
}

// src/components/submit-button.component.tsx
import React11, { useContext as useContext7 } from "react";
function SubmitButton({ className }) {
  const rootFormCtx = useContext7(RootFormContext);
  const formCtx = useContext7(FormContext);
  if (rootFormCtx === null)
    throw new Error("Cannot render SubmitButton inside null RootFormContext");
  if (formCtx === null)
    throw new Error("Cannot Render SubmitButton inside null FormContext");
  const { submit } = rootFormCtx;
  const { validity } = formCtx.useFormState();
  return /* @__PURE__ */ React11.createElement("button", { className, onClick: submit, disabled: validity < 4 /* VALID_FINALIZABLE */ }, "Submit");
}
export {
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
};
//# sourceMappingURL=index.js.map