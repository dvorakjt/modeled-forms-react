import React, { CSSProperties } from "react";

interface MessageComponentProps {
  className? : string;
  style? : CSSProperties;
  validity : string;
  text : string;
  id : string;
}

export function Message({className, style, validity, text, id} : MessageComponentProps) {
  return <small className={className} style={style} data-validity={validity} id={id}>{text}</small>
}