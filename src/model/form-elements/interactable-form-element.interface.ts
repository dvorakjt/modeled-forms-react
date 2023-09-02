import type { Subject } from "rxjs";
import type { Interactions } from "../state/interactions.interface";

export interface InteractableFormElement {
  interactions : Interactions;
  interactionsChanges : Subject<Interactions>;
}