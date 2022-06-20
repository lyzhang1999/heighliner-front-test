/**
 * Define common type
 */

import { CSSProperties, ReactChild } from "react";

// Common props type used by a component
export interface CommonProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactChild | ReactChild[];
}
