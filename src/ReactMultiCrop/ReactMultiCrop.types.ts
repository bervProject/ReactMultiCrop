import { InputProps } from "react-admin";

export interface ReactMultiCropProps extends InputProps {
  id?: string;
  color?: string;
  opacity?: number;
  strokeColor?: string;
  strokeDashArray?: Array<number>;
  strokeWidth?: number;
  record?: any;
};
