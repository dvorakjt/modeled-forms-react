import type { ValidatorSuiteResult } from "./validator-suite-result.interface"

export type State<T> = ValidatorSuiteResult<T> & { omit? : boolean };