import { DualField } from '../../fields/base/dual-field.interface';
import { Field } from '../../fields/base/field.interface';
import { StateControlledDualField } from '../../fields/controlled/state-controlled-dual-field';
import { StateControlledField } from '../../fields/controlled/state-controlled-field';
import { ValueControlledDualField } from '../../fields/controlled/value-controlled-dual-field';
import { ValueControlledField } from '../../fields/controlled/value-controlled-field';
import { ControlledFieldTemplateVariations } from './raw/controlled/controlled-field-template-variations.type';

interface ControlledFieldTemplateParser {
  parseTemplateAndDecorateField(
    baseField: Field | DualField,
    template: ControlledFieldTemplateVariations,
  ):
    | StateControlledField
    | StateControlledDualField
    | ValueControlledField
    | ValueControlledDualField;
}
const ControlledFieldTemplateParserKey = 'ControlledFieldTemplateParser';
type ControlledFieldTemplateParserKeyType =
  typeof ControlledFieldTemplateParserKey;

export {
  ControlledFieldTemplateParserKey,
  type ControlledFieldTemplateParser,
  type ControlledFieldTemplateParserKeyType,
};
