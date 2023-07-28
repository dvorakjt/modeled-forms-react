import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { RootFormImpl } from '../../../model/forms/root-form-impl';
import { SubscriptionManagerImpl } from '../../../model/subscriptions/subscription-manager-impl';
import { FormStateManagerStub } from '../stub/form-state-manager.stub';
import { SubmissionManagerStub } from '../stub/submission-manager.stub';
import { RootForm } from '../../../model/types/forms/root-form.interface';
import { MessageType } from '../../../model/types/state/messages/message-type.enum';
import { Validity } from '../../../model/types/state/validity.enum';
import { SubscriptionManager } from '../../../model/types/subscriptions/subscription-manager.interface';
import { ManagedSubject } from '../../../model/subscriptions/managed-subject';
import type { State } from '../../../model/types/state/state.interface';

describe('RootFormImpl', () => {
  let rootForm: RootForm;
  let subscriptionManager: SubscriptionManager;
  let formStateManagerStub: FormStateManagerStub;
  let submissionManagerStub: SubmissionManagerStub;

  beforeEach(() => {
    subscriptionManager = new SubscriptionManagerImpl();
    formStateManagerStub = new FormStateManagerStub(subscriptionManager);
    submissionManagerStub = new SubmissionManagerStub(subscriptionManager);
    rootForm = new RootFormImpl(
      formStateManagerStub,
      submissionManagerStub,
      subscriptionManager,
    );
  });

  afterEach(() => {
    rootForm.unsubscribeAll();
  });

  test('getting state returns the union of formStateManager.state and RootForm.aggregateMessages().', () => {
    const messages = [
      {
        type: MessageType.VALID,
        text: 'This is a test of formStateManager messages.',
      },
    ];
    const formStateWithMessages = {
      value: {},
      validity: Validity.PENDING,
      messages,
    };
    formStateManagerStub.state = formStateWithMessages;
    const subManagerMessage = {
      type: MessageType.VALID,
      text: 'This is a test of submissionManager messages.',
    };
    submissionManagerStub.message = subManagerMessage;
    const expectedState = {
      ...FormStateManagerStub.defaultState,
      messages: [...messages, subManagerMessage],
    };
    expect(rootForm.state).toStrictEqual(expectedState);
  });

  test('submissionChanges should emit a new value when hasSubmitted is updated to a value that does not match its previous value.', async () => {
    let submissionChangesReceived = 0;
    rootForm.submissionChanges.subscribe(() => {
      submissionChangesReceived++;
    });
    rootForm.submit();
    rootForm.reset();
    expect(submissionChangesReceived).toBe(3);
  });

  test('stateChanges should be initialized to a ManagedSubject upon instantiation', () => {
    expect(rootForm.stateChanges).toBeInstanceOf(ManagedSubject<State<any>>);
  });

  test('stateChanges should emit a new state value when submissionManager.submissionChanges emits an event.', () => {
    let stateChangesReceived = 0;
    rootForm.stateChanges?.subscribe(() => {
      stateChangesReceived++;
    });
    submissionManagerStub.submissionChanges.next();
    expect(stateChangesReceived).toBe(2);
  });
});
