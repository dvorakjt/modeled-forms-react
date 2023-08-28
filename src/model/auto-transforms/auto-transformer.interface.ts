interface AutoTransformer {
  transform(value: string): string;
}
const AutoTransformerKey = 'AutoTransformer';
type AutoTransformerKeyType = typeof AutoTransformerKey;

export {
  AutoTransformerKey,
  type AutoTransformer,
  type AutoTransformerKeyType,
};
