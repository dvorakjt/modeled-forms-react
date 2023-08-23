import { AsyncBaseFinalizerFn } from "../../finalizers/finalizer-functions/async-base-finalizer-fn.type";

export type AsyncFinalizerTemplate = {
  asyncFinalizerFn : AsyncBaseFinalizerFn;
  syncFinalizerFn? : undefined;
  preserveOriginalFields? : boolean;
}