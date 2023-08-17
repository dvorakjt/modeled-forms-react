import { AbstractField } from './abstract-field';

export abstract class AbstractDualField extends AbstractField {
  abstract primaryField: AbstractField;
  abstract secondaryField: AbstractField;
  abstract useSecondaryField : boolean;
}
