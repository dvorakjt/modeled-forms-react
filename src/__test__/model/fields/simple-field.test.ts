import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { SimpleField } from "../../../model/fields/simple-field";
import { Field } from "../../../model/types/fields/field.interface";
import { SubscriptionManagerImpl } from "../../../model/subscriptions/subscription-manager-impl";
import { SingleInputValidatorSuiteStub } from "../stub/single-input-validator-suite.stub";
import { Validity } from "../../../model/types/state/validity.enum";
import { SubscriptionManager } from "../../../model/types/subscriptions/subscription-manager.interface";
import type { SingleInputValidatorSuite } from "../../../model/types/validators/single-input/single-input-validator-suite.interface";

describe('SimpleField', () => {
  let field : Field;
  let subscriptionManager : SubscriptionManager;
  let validatorSuite : SingleInputValidatorSuite<string>;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
    validatorSuite = new SingleInputValidatorSuiteStub<string>(
      subscriptionManager,
      {
        value : "",
        validity: Validity.VALID_FINALIZABLE,
        messages: []
      }
    );
    field = new SimpleField(validatorSuite, "", subscriptionManager, false);
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('setting omit should update field.omit', () => {
    field.omit = true;
    expect(field.omit).toBe(true);
  });

  test('calling reset should set omit and call setValue with the default value.', () => {
    field.setValue("some new value");
    field.omit = true;
    field.reset();
    expect(field.omit).toBe(false);
    expect(field.state.value).toBe("");
  }); 
});