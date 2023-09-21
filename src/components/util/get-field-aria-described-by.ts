import { getFieldMessageIdPrefix } from "./get-field-message-id-prefix";

export function getFieldAriaDescribedBy(fieldName : string, messageCount : number) {
  const describedBy = [];
  for(let i = 0; i < messageCount; i++) {
    describedBy.push(`${getFieldMessageIdPrefix(fieldName)}-${i}`);
  }
  return describedBy.join(' ');
}