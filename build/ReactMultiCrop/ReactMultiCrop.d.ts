import React, { Component } from "react";
import { fabric } from "fabric";
import {
  ReactMultiCropProps,
  ReactMultiCropStates,
} from "./ReactMultiCrop.types";
export default class ReactMultiCrop extends Component<
  ReactMultiCropProps,
  ReactMultiCropStates
> {
  static defaultProps: ReactMultiCropProps;
  state: ReactMultiCropStates;
  constructor(props: ReactMultiCropProps);
  componentDidMount(): void;
  componentDidUpdate(): void;
  changeImage(): void;
  loadImage(img: fabric.Image): void;
  initialImage(): void;
  initialObjects(): void;
  initialCanvas(): void;
  handleNewShape(): void;
  doubleClickEvent(options: any): void;
  createObjectByAttribute(attribute: any): fabric.Rect;
  shapetoStructureData(element: fabric.Object): any;
  handleDeleteShape(): void;
  setOutput(): void;
  createObject(canvas: fabric.Canvas, coor: any): fabric.Rect;
  handleMultiSelect(): void;
  handleDiscardActiveObject(): void;
  handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>): void;
  render(): JSX.Element;
}
