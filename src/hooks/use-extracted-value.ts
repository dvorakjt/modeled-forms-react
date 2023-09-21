import { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";
import { Adapter } from "../model/adapters/adapter.interface";

export function useExtractedValue<V>(adapter : Adapter<V>) {
  const [value, setValue] = useState<V>();
  const adapterSubRef = useRef<Subscription>();

  useEffect(() => {
    adapterSubRef.current = adapter.stream.subscribe((v) => {
      setValue(v);
    });
    return () => adapterSubRef.current?.unsubscribe();
  });

  return value;
}