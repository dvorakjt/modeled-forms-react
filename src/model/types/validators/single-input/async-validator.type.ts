import type { ValidatorResult } from './validator-result.interface';

export type AsyncValidator<T> = (value: T) => Promise<ValidatorResult>;
