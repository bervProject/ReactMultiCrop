export type ReactMultiCropProps = {
  id: string;
  color?: string;
  opacity?: number;
  strokeColor?: string;
  strokeDashArray?: Array<number>;
  strokeWidth?: number;
  record?: any;
  input?: any;
};

export type ReactMultiCropStates = {
  canvas: fabric.Canvas | null;
  initial: boolean;
};
