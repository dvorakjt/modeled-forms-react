import type { Subject } from "rxjs";

export interface Adapter<T> {
  stream: Subject<T>;
}
