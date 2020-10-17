export interface ReactMultiCropProps {
  id: string;
  color?: string;
  opacity?: number;
  strokeColor?: string;
  strokeDashArray?: Array<number>;
  strokeWidth?: number;
  record?: any;
  input?: any;
}
export interface ReactMultiCropStates {
  canvas: fabric.Canvas | null;
  initial: boolean;
}
