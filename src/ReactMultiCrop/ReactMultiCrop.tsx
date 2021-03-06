import React, { Component } from "react";
import { fabric } from "fabric";
import { Button, Grid } from "@material-ui/core";
import {
  ReactMultiCropProps,
  ReactMultiCropStates,
} from "./ReactMultiCrop.types";

export default class ReactMultiCrop extends Component<
  ReactMultiCropProps,
  ReactMultiCropStates
> {
  public static defaultProps: ReactMultiCropProps = {
    id: "canvas",
    color: "grey",
    opacity: 0.5,
    strokeColor: "yellow",
    strokeDashArray: [5, 5],
    strokeWidth: 5,
    record: [],
    input: {
      value: "",
      name: "",
      onChange: function () {},
    },
  };

  state: ReactMultiCropStates = {
    canvas: null,
    initial: true,
  };

  constructor(props: ReactMultiCropProps) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleNewShape = this.handleNewShape.bind(this);
    this.handleDeleteShape = this.handleDeleteShape.bind(this);
    this.handleMultiSelect = this.handleMultiSelect.bind(this);
    this.handleDiscardActiveObject = this.handleDiscardActiveObject.bind(this);
  }

  componentDidMount(): void {
    this.initialCanvas();
  }

  componentDidUpdate(): void {
    this.changeImage();
  }

  changeImage(): void {
    const { record } = this.props;
    const setImage = this.loadImage.bind(this);
    fabric.Image.fromURL(record.image, setImage);
  }

  loadImage(img: fabric.Image): void {
    const { initial, canvas } = this.state;
    if (!canvas) {
      return;
    }
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: canvas.getWidth() / (img.width || 1),
      scaleY: canvas.getHeight() / (img.height || 1),
    });
    if (initial) {
      this.setState({ initial: false }, this.initialObjects.bind(this));
    }
  }

  initialImage(): void {
    const { record } = this.props;
    const loadImageNow = this.loadImage.bind(this);
    fabric.Image.fromURL(record.image, loadImageNow);
  }

  initialObjects(): void {
    const { canvas } = this.state;
    if (!canvas) {
      return;
    }
    const { record } = this.props;
    const setOutput = this.setOutput.bind(this);
    const setStateOf = this.setState.bind(this);
    const inputObject = record.clippings;
    const createObject = this.createObject.bind(this);
    if (inputObject !== undefined) {
      inputObject.forEach(function (coord: any) {
        const rect = createObject(canvas, coord);
        canvas.add(rect);
      });
    }
    canvas.renderAll();
    setStateOf({ canvas }, setOutput);
  }

  initialCanvas(): void {
    const canvas = new fabric.Canvas(this.props.id);
    canvas.uniScaleTransform = true;
    const doubleClickEvent = this.doubleClickEvent.bind(this);
    const objectModifiedEvent = this.setOutput.bind(this);
    canvas.on("mouse:dblclick", doubleClickEvent);
    canvas.on("object:modified", objectModifiedEvent);
    const initialImg = this.initialImage.bind(this);
    this.setState({ canvas }, initialImg);
  }

  handleNewShape(): void {
    const { canvas } = this.state;
    if (!canvas) {
      return;
    }
    const coor: any = {};
    coor.id = null;
    coor.rect = { x1: 0, y1: 0, x2: 0.2, y2: 0.2 };
    const rect = this.createObject(canvas, coor);
    rect.lockRotation = true;
    canvas.add(rect);
    canvas.renderAll();
    this.setState({ canvas }, this.setOutput);
  }

  doubleClickEvent(options: any): void {
    if (options.target) {
      const { canvas } = this.state;
      if (!canvas) {
        return;
      }
      const left = options.target.left;
      const top = options.target.top;
      const width = options.target.width;
      const height = options.target.height;
      const attribute: any = {};
      attribute.left = left + 5;
      attribute.top = top + 5;
      attribute.width = width * options.target.scaleX;
      attribute.height = height * options.target.scaleY;
      const rect = this.createObjectByAttribute(attribute);
      rect.lockRotation = true;
      canvas.add(rect);
      canvas.renderAll();
      this.setState({ canvas }, this.setOutput);
    }
  }

  createObjectByAttribute(attribute: any): fabric.Rect {
    const {
      color,
      opacity,
      strokeDashArray,
      strokeColor,
      strokeWidth,
    } = this.props;
    return new fabric.Rect({
      left: attribute.left,
      top: attribute.top,
      width: attribute.width,
      height: attribute.height,
      fill: color,
      opacity: opacity,
      data: null,
      strokeDashArray: strokeDashArray,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
    });
  }

  shapetoStructureData(element: fabric.Object): any {
    const { canvas } = this.state;
    if (!canvas) {
      return;
    }
    const coord: any = {};
    coord.id = element.data;
    const left = element.left || 0;
    const top = element.top || 0;
    const width = element.width || 0;
    const height = element.height || 0;
    const scaleX = element.scaleX || 0;
    const scaleY = element.scaleY || 0;
    const x1 = left / canvas.getWidth();
    const y1 = top / canvas.getHeight();
    const x2 = (left + width * scaleX) / canvas.getWidth();
    const y2 = (top + height * scaleY) / canvas.getHeight();
    const rectangle = { x1: x1, y1: y1, x2: x2, y2: y2 };
    coord.rect = JSON.stringify(rectangle);
    if (canvas.backgroundImage instanceof fabric.Image) {
      const imgWidth = canvas.backgroundImage.width || 0;
      const imgHeight = canvas.backgroundImage.height || 0;
      const x1Px = x1 * imgWidth;
      const x2Px = x2 * imgWidth;
      const y1Px = y1 * imgHeight;
      const y2Px = y2 * imgHeight;
      const rectanglePx = { x1: x1Px, y1: y1Px, x2: x2Px, y2: y2Px };
      coord.rectPx = JSON.stringify(rectanglePx);
    }
    coord.deletedAt = "-1";
    return coord;
  }

  handleDeleteShape(): void {
    const { canvas } = this.state;
    if (canvas) {
      canvas.getActiveObjects().forEach(function (element: fabric.Object) {
        canvas.remove(element);
      });
      this.setState({ canvas }, this.setOutput);
    }
  }

  setOutput(): void {
    const { canvas } = this.state;
    if (!canvas) {
      return;
    }
    const shapeToStructureData = this.shapetoStructureData.bind(this);
    const outputValue: Array<any> = [];
    const cropcoords = canvas.getObjects();
    cropcoords.forEach(function (element: fabric.Object) {
      outputValue.push(shapeToStructureData(element));
    });
    // let stringOut = JSON.stringify(outputValue)
    this.props.input.onChange(outputValue);
  }

  createObject(canvas: fabric.Canvas, coor: any): fabric.Rect {
    const {
      color,
      opacity,
      strokeDashArray,
      strokeColor,
      strokeWidth,
    } = this.props;
    let rectangle;
    if (typeof coor.rect === "string") {
      rectangle = JSON.parse(coor.rect);
    } else {
      rectangle = coor.rect;
    }
    const left = canvas.getWidth() * rectangle.x1;
    const top = canvas.getHeight() * rectangle.y1;
    const right = canvas.getWidth() * rectangle.x2;
    const bottom = canvas.getHeight() * rectangle.y2;
    const width = right - left;
    const height = bottom - top;
    return new fabric.Rect({
      left: left,
      top: top,
      width: width,
      height: height,
      fill: color,
      opacity: opacity,
      data: coor.id,
      strokeDashArray: strokeDashArray,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
    });
  }

  handleMultiSelect(): void {
    const { canvas } = this.state;
    if (!canvas) {
      return;
    }
    canvas.discardActiveObject();
    const sel = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  }

  handleDiscardActiveObject(): void {
    const { canvas } = this.state;
    if (!canvas) {
      return;
    }
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Delete") {
      // Handle Delete
      this.handleDeleteShape();
    }
  }

  render(): JSX.Element {
    const {
      input: { value, name },
      ...otherProps
    } = this.props;

    return (
      <div data-testid="canvas-wrapper" id="canvas-wrapper">
        <p>{name}</p>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={8}
        >
          <Grid item xs onKeyDown={this.handleKeyPress} tabIndex={0}>
            <canvas
              width="800"
              height="800"
              style={{ border: "1px solid #aaa" }}
              {...otherProps}
            />
          </Grid>
          <Grid
            container
            item
            xs
            direction="column"
            justify="flex-start"
            alignItems="flex-start"
            spacing={8}
          >
            <Grid item xs>
              <Button
                variant="contained"
                id="addmore"
                color="primary"
                onClick={this.handleNewShape}
              >
                {" "}
                Add More Shapes
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                variant="contained"
                id="deleteselected"
                color="primary"
                onClick={this.handleDeleteShape}
              >
                {" "}
                Delete Selected Object{" "}
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                variant="contained"
                id="multiselect"
                color="primary"
                onClick={this.handleMultiSelect}
              >
                {" "}
                Select All{" "}
              </Button>
            </Grid>
            <Grid item xs>
              <Button
                variant="contained"
                id="discard"
                color="primary"
                onClick={this.handleDiscardActiveObject}
              >
                {" "}
                Discard Selection
              </Button>
            </Grid>
          </Grid>
          <input type="hidden" value={value} />
        </Grid>
      </div>
    );
  }
}
