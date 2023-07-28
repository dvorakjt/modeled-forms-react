import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { NestedFormImpl } from '../../../model/forms/nested-form-impl';
import type { NestedForm } from '../../../model/types/forms/nested-form.interface';
import { SubscriptionManagerImpl } from '../../../model/subscriptions/subscription-manager-impl';
import { FormStateManagerStub } from '../stub/form-state-manager.stub';
import { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';

describe('NestedFormImpl', () => {
  let nestedForm: NestedForm;
  let subscriptionManager: SubscriptionManager;
  let formStateManagerStub: FormStateManagerStub;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
    formStateManagerStub = new FormStateManagerStub(subscriptionManager);
    nestedForm = new NestedFormImpl(
      formStateManagerStub,
      subscriptionManager,
      false,
    );
  });

  afterEach(() => {
    subscriptionManager.unsubscribeAll();
  });

  test('stateChanges emits a new value when omit is set.', () => {
    let stateChangesReceived = 0;
    nestedForm.stateChanges?.subscribe(() => {
      stateChangesReceived++;
    });
    nestedForm.omit = true;
    expect(stateChangesReceived).toBe(2);
    expect(nestedForm.omit).toBe(true);
  });

  test('reset() should set omit to omitByDefault and call formStateManager.reset when called.', () => {
    nestedForm.omit = true;
    vi.spyOn(formStateManagerStub, 'reset');
    nestedForm.reset();
    expect(nestedForm.omit).toBe(false);
    expect(formStateManagerStub.reset).toHaveBeenCalled();
  });
});
