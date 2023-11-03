import { createContext } from 'react';
import { useForm } from '../../hooks/use-form';

export type FormContextType = ReturnType<typeof useForm>;

export const FormContext = createContext<FormContextType | null>(null);