import React, { Component, useState, useEffect } from "react";
import { fabric } from "fabric";
import { useInput } from "react-admin";
import { Button, Grid } from "@material-ui/core";
import {
  ReactMultiCropProps
} from "./ReactMultiCrop.types";

const defaultProps: ReactMultiCropProps = {
  id: "canvas",
  source: "crop",
  color: "grey",
  opacity: 0.5,
  strokeColor: "yellow",
  strokeDashArray: [5, 5],
  strokeWidth: 5,
  record: [],
};


const ReactMultiCrop: React.FC<ReactMultiCropProps> = (props: ReactMultiCropProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [initial, setInitial] = useState(true);
  const {
    input: { value, name },
    ...anotherProp
  } = useInput(props);

  function createObject(canvas: fabric.Canvas, coor: any): fabric.Rect {
    const {
      color,
      opacity,
      strokeDashArray,
      strokeColor,
      strokeWidth,
    } = props;
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

  function handleNewShape(): void {
    if (!canvas) {
      return;
    }
    const coor: any = {};
    coor.id = null;
    coor.rect = { x1: 0, y1: 0, x2: 0.2, y2: 0.2 };
    const rect = createObject(canvas, coor);
    rect.lockRotation = true;
    canvas.add(rect);
    canvas.renderAll();
    setOutput();
  }

  function handleMultiSelect(): void {
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

  function doubleClickEvent(options: any): void {
    if (options.target) {
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
      const rect = createObjectByAttribute(attribute);
      rect.lockRotation = true;
      canvas.add(rect);
      canvas.renderAll();
      setOutput();
    }
  }

  function createObjectByAttribute(attribute: any): fabric.Rect {
    const {
      color,
      opacity,
      strokeDashArray,
      strokeColor,
      strokeWidth,
    } = props;
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

  function shapetoStructureData(element: fabric.Object): any {
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

  function handleDeleteShape(): void {
    if (canvas) {
      canvas.getActiveObjects().forEach(function (element: fabric.Object) {
        canvas.remove(element);
      });
      setOutput();
      //this.setState({ canvas }, this.setOutput);
    }
  }

  function setOutput(): void {
    if (!canvas) {
      return;
    }
    const outputValue: Array<any> = [];
    const cropcoords = canvas.getObjects();
    cropcoords.forEach(function (element: fabric.Object) {
      outputValue.push(shapetoStructureData(element));
    });
    // let stringOut = JSON.stringify(outputValue)
    if (props.input) {
      props.input.onChange(outputValue);
    }
  }



  function handleDiscardActiveObject(): void {
    if (!canvas) {
      return;
    }
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Delete") {
      // Handle Delete
      handleDeleteShape();
    }
  }

  function changeImage(): void {
    const { record } = props;
    fabric.Image.fromURL(record.image, loadImage);
  }

  function loadImage(img: fabric.Image): void {
    if (!canvas) {
      return;
    }
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: canvas.getWidth() / (img.width || 1),
      scaleY: canvas.getHeight() / (img.height || 1),
    });
    if (initial) {
      setInitial(false);
      initialObjects();
    }
  }

  function initialObjects(): void {
    if (!canvas) {
      return;
    }
    const { record } = props;
    //const setOutput = this.setOutput.bind(this);
    //const setStateOf = this.setState.bind(this);
    const inputObject = record.clippings;
    //const createObject = this.createObject.bind(this);
    if (inputObject !== undefined) {
      inputObject.forEach(function (coord: any) {
        const rect = createObject(canvas, coord);
        canvas.add(rect);
      });
    }
    canvas.renderAll();
    //setCanvas(canvas);
    //setStateOf({ canvas }, setOutput);
  }

  function initialImage(): void {
    const { record } = props;
    fabric.Image.fromURL(record.image, loadImage);
  }

  function initialCanvas(): void {
    let newCanvas = new fabric.Canvas(props.id || "canvas");
    newCanvas.uniScaleTransform = true;
    newCanvas.on("mouse:dblclick", doubleClickEvent);
    newCanvas.on("object:modified", setOutput);
    setCanvas(newCanvas);
    initialImage();
  }

  useEffect(() => {
    initialCanvas();
  }, []);

  return (
    <div id="canvas-wrapper">
      <p>{name}</p>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={8}
      >
        <Grid item xs onKeyDown={handleKeyPress} tabIndex={0}>
          <canvas
            width="800"
            height="800"
            style={{ border: "1px solid #aaa" }}
            {...anotherProp}
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
              onClick={handleNewShape}
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
              onClick={handleDeleteShape}
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
              onClick={handleMultiSelect}
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
              onClick={handleDiscardActiveObject}
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

ReactMultiCrop.defaultProps = defaultProps;

export default ReactMultiCrop;