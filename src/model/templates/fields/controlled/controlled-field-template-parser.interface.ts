import { AbstractField } from "../../../fields/base/abstract-field";
import { AbstractDualField } from "../../../fields/base/abstract-dual-field";
import { StateControlledDualField } from "../../../fields/controlled/state-controlled-dual-field";
import { StateControlledField } from "../../../fields/controlled/state-controlled-field";
import { ValueControlledDualField } from "../../../fields/controlled/value-controlled-dual-field";
import { ValueControlledField } from "../../../fields/controlled/value-controlled-field";
import { ControlledFieldTemplateVariations } from "./controlled-field-template-variations.type";
import { FormElementMap } from "../../../form-elements/form-element-map.type";

interface ControlledFieldTemplateParser {
  parseTemplateAndDecorateField(
    baseField : AbstractField | AbstractDualField, 
    template : ControlledFieldTemplateVariations,
    fields : FormElementMap
  ) : 
    StateControlledField | StateControlledDualField | ValueControlledField | ValueControlledDualField;
}
const ControlledFieldTemplateParserKey = 'ControlledFieldTemplateParser';
type ControlledFieldTemplateParserKeyType = typeof ControlledFieldTemplateParserKey;

export { ControlledFieldTemplateParserKey, type ControlledFieldTemplateParser, type ControlledFieldTemplateParserKeyType };