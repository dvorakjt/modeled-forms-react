import { CSSProperties } from "react";

export interface FormProps {
  acceptCharset? : string;
  autoCapitalize? : 'none' | 'sentences' | 'words';
  autoComplete? : 'on' | 'off';
  name? : string;
  id? : string;
  className? : string;
  style? : CSSProperties; 
}