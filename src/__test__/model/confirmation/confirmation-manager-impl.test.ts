import { describe, test, expect, beforeEach, vi } from 'vitest';
import { ConfirmationManagerImpl } from '../../../model/confirmation/confirmation-manager-impl';
import { MessageType, Validity } from '../../../model';

describe('ConfirmationManagerImpl', () => {
  let confirmationManager: ConfirmationManagerImpl;

  beforeEach(() => {
    confirmationManager = new ConfirmationManagerImpl();
  });

  test('tryConfirm sets confirmationState.confirmationAttempted to true.', () => {
    confirmationManager.tryConfirm({ validity: Validity.VALID_FINALIZABLE });
    expect(confirmationManager.confirmationState.confirmationAttempted).toBe(
      true,
    );
  });

  test('tryConfirm sets confirmationState.message to undefined.', () => {
    confirmationManager.tryConfirm({ validity: Validity.VALID_FINALIZABLE });
    expect(confirmationManager.confirmationState.message).toBeUndefined();
  });

  test('when tryConfirm() is called and validity is less than validFinalizable, onError is called if passed in as an argument.', () => {
    const onError = vi.fn();
    confirmationManager.tryConfirm({ validity: Validity.INVALID, onError });
    expect(onError).toHaveBeenCalledOnce();
  });

  test('when tryConfirm() is called and validity is less than validFinalizable, confirmationState.message is set to the errorMessage if provided.', () => {
    const expectedErrorMessageText = 'there were invalid or pending fields.';
    confirmationManager.tryConfirm({
      validity: Validity.INVALID,
      errorMessage: expectedErrorMessageText,
    });
    expect(confirmationManager.confirmationState.message).toStrictEqual({
      text: expectedErrorMessageText,
      type: MessageType.INVALID,
    });
  });

  test('when tryConfirm() is called and validity is Validity.VALID_FINALIZABLE, onSuccess is called.', () => {
    const onSuccess = vi.fn();
    confirmationManager.tryConfirm({
      validity: Validity.VALID_FINALIZABLE,
      onSuccess,
    });
    expect(onSuccess).toHaveBeenCalledOnce();
  });
});
