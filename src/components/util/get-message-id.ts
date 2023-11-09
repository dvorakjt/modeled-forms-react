import { getFieldMessageIdPrefix } from './get-field-message-id-prefix';

export function getMessageId(fieldName: string, id: number) {
  return `${getFieldMessageIdPrefix(fieldName)}-${id}`;
}
