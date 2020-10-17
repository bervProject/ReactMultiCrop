import React, { Component } from "react";
import { fabric } from "fabric";
import { Grid, Button } from "@material-ui/core";

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function (d, b) {
  extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (d, b) {
        d.__proto__ = b;
      }) ||
    function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };
  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype =
    b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
}

var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
  return __assign.apply(this, arguments);
};

var ReactMultiCrop = (function (_super) {
  __extends(ReactMultiCrop, _super);
  function ReactMultiCrop(props) {
    var _this = _super.call(this, props) || this;
    _this.state = {
      canvas: null,
      initial: true,
    };
    _this.handleKeyPress = _this.handleKeyPress.bind(_this);
    _this.handleNewShape = _this.handleNewShape.bind(_this);
    _this.handleDeleteShape = _this.handleDeleteShape.bind(_this);
    _this.handleMultiSelect = _this.handleMultiSelect.bind(_this);
    _this.handleDiscardActiveObject = _this.handleDiscardActiveObject.bind(
      _this
    );
    return _this;
  }
  ReactMultiCrop.prototype.componentDidMount = function () {
    this.initialCanvas();
  };
  ReactMultiCrop.prototype.componentDidUpdate = function () {
    this.changeImage();
  };
  ReactMultiCrop.prototype.changeImage = function () {
    var record = this.props.record;
    var setImage = this.loadImage.bind(this);
    fabric.Image.fromURL(record.image, setImage);
  };
  ReactMultiCrop.prototype.loadImage = function (img) {
    var _a = this.state,
      initial = _a.initial,
      canvas = _a.canvas;
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
  };
  ReactMultiCrop.prototype.initialImage = function () {
    var record = this.props.record;
    var loadImageNow = this.loadImage.bind(this);
    fabric.Image.fromURL(record.image, loadImageNow);
  };
  ReactMultiCrop.prototype.initialObjects = function () {
    var canvas = this.state.canvas;
    if (!canvas) {
      return;
    }
    var record = this.props.record;
    var setOutput = this.setOutput.bind(this);
    var setStateOf = this.setState.bind(this);
    var inputObject = record.clippings;
    var createObject = this.createObject.bind(this);
    if (inputObject !== undefined) {
      inputObject.forEach(function (coord) {
        var rect = createObject(canvas, coord);
        canvas.add(rect);
      });
    }
    canvas.renderAll();
    setStateOf({ canvas: canvas }, setOutput);
  };
  ReactMultiCrop.prototype.initialCanvas = function () {
    var canvas = new fabric.Canvas(this.props.id);
    canvas.uniScaleTransform = true;
    var doubleClickEvent = this.doubleClickEvent.bind(this);
    var objectModifiedEvent = this.setOutput.bind(this);
    canvas.on("mouse:dblclick", doubleClickEvent);
    canvas.on("object:modified", objectModifiedEvent);
    var initialImg = this.initialImage.bind(this);
    this.setState({ canvas: canvas }, initialImg);
  };
  ReactMultiCrop.prototype.handleNewShape = function () {
    var canvas = this.state.canvas;
    if (!canvas) {
      return;
    }
    var coor = {};
    coor.id = null;
    coor.rect = { x1: 0, y1: 0, x2: 0.2, y2: 0.2 };
    var rect = this.createObject(canvas, coor);
    rect.lockRotation = true;
    canvas.add(rect);
    canvas.renderAll();
    this.setState({ canvas: canvas }, this.setOutput);
  };
  ReactMultiCrop.prototype.doubleClickEvent = function (options) {
    if (options.target) {
      var canvas = this.state.canvas;
      if (!canvas) {
        return;
      }
      var left = options.target.left;
      var top_1 = options.target.top;
      var width = options.target.width;
      var height = options.target.height;
      var attribute = {};
      attribute.left = left + 5;
      attribute.top = top_1 + 5;
      attribute.width = width * options.target.scaleX;
      attribute.height = height * options.target.scaleY;
      var rect = this.createObjectByAttribute(attribute);
      rect.lockRotation = true;
      canvas.add(rect);
      canvas.renderAll();
      this.setState({ canvas: canvas }, this.setOutput);
    }
  };
  ReactMultiCrop.prototype.createObjectByAttribute = function (attribute) {
    var _a = this.props,
      color = _a.color,
      opacity = _a.opacity,
      strokeDashArray = _a.strokeDashArray,
      strokeColor = _a.strokeColor,
      strokeWidth = _a.strokeWidth;
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
  };
  ReactMultiCrop.prototype.shapetoStructureData = function (element) {
    var canvas = this.state.canvas;
    if (!canvas) {
      return;
    }
    var coord = {};
    coord.id = element.data;
    var left = element.left || 0;
    var top = element.top || 0;
    var width = element.width || 0;
    var height = element.height || 0;
    var scaleX = element.scaleX || 0;
    var scaleY = element.scaleY || 0;
    var x1 = left / canvas.getWidth();
    var y1 = top / canvas.getHeight();
    var x2 = (left + width * scaleX) / canvas.getWidth();
    var y2 = (top + height * scaleY) / canvas.getHeight();
    var rectangle = { x1: x1, y1: y1, x2: x2, y2: y2 };
    coord.rect = JSON.stringify(rectangle);
    if (canvas.backgroundImage instanceof fabric.Image) {
      var imgWidth = canvas.backgroundImage.width || 0;
      var imgHeight = canvas.backgroundImage.height || 0;
      var x1Px = x1 * imgWidth;
      var x2Px = x2 * imgWidth;
      var y1Px = y1 * imgHeight;
      var y2Px = y2 * imgHeight;
      var rectanglePx = { x1: x1Px, y1: y1Px, x2: x2Px, y2: y2Px };
      coord.rectPx = JSON.stringify(rectanglePx);
    }
    coord.deletedAt = "-1";
    return coord;
  };
  ReactMultiCrop.prototype.handleDeleteShape = function () {
    var canvas = this.state.canvas;
    if (canvas) {
      canvas.getActiveObjects().forEach(function (element) {
        canvas.remove(element);
      });
      this.setState({ canvas: canvas }, this.setOutput);
    }
  };
  ReactMultiCrop.prototype.setOutput = function () {
    var canvas = this.state.canvas;
    if (!canvas) {
      return;
    }
    var shapeToStructureData = this.shapetoStructureData.bind(this);
    var outputValue = [];
    var cropcoords = canvas.getObjects();
    cropcoords.forEach(function (element) {
      outputValue.push(shapeToStructureData(element));
    });
    this.props.input.onChange(outputValue);
  };
  ReactMultiCrop.prototype.createObject = function (canvas, coor) {
    var _a = this.props,
      color = _a.color,
      opacity = _a.opacity,
      strokeDashArray = _a.strokeDashArray,
      strokeColor = _a.strokeColor,
      strokeWidth = _a.strokeWidth;
    var rectangle;
    if (typeof coor.rect === "string") {
      rectangle = JSON.parse(coor.rect);
    } else {
      rectangle = coor.rect;
    }
    var left = canvas.getWidth() * rectangle.x1;
    var top = canvas.getHeight() * rectangle.y1;
    var right = canvas.getWidth() * rectangle.x2;
    var bottom = canvas.getHeight() * rectangle.y2;
    var width = right - left;
    var height = bottom - top;
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
  };
  ReactMultiCrop.prototype.handleMultiSelect = function () {
    var canvas = this.state.canvas;
    if (!canvas) {
      return;
    }
    canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  };
  ReactMultiCrop.prototype.handleDiscardActiveObject = function () {
    var canvas = this.state.canvas;
    if (!canvas) {
      return;
    }
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };
  ReactMultiCrop.prototype.handleKeyPress = function (event) {
    if (event.keyCode === 46) {
      this.handleDeleteShape();
    }
  };
  ReactMultiCrop.prototype.render = function () {
    var _a = this.props.input,
      value = _a.value,
      name = _a.name;
    return React.createElement(
      "div",
      { id: "canvas-wrapper" },
      React.createElement("p", null, name),
      React.createElement(
        Grid,
        {
          container: true,
          direction: "row",
          justify: "flex-start",
          alignItems: "flex-start",
          spacing: 8,
        },
        React.createElement(
          Grid,
          { item: true, xs: true, onKeyDown: this.handleKeyPress, tabIndex: 0 },
          React.createElement(
            "canvas",
            __assign(
              {
                width: "800",
                height: "800",
                style: { border: "1px solid #aaa" },
              },
              this.props
            )
          )
        ),
        React.createElement(
          Grid,
          {
            container: true,
            item: true,
            xs: true,
            direction: "column",
            justify: "flex-start",
            alignItems: "flex-start",
            spacing: 8,
          },
          React.createElement(
            Grid,
            { item: true, xs: true },
            React.createElement(
              Button,
              {
                variant: "contained",
                id: "addmore",
                color: "primary",
                onClick: this.handleNewShape,
              },
              " ",
              "Add More Shapes"
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: true },
            React.createElement(
              Button,
              {
                variant: "contained",
                id: "deleteselected",
                color: "primary",
                onClick: this.handleDeleteShape,
              },
              " ",
              "Delete Selected Object",
              " "
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: true },
            React.createElement(
              Button,
              {
                variant: "contained",
                id: "multiselect",
                color: "primary",
                onClick: this.handleMultiSelect,
              },
              " ",
              "Select All",
              " "
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: true },
            React.createElement(
              Button,
              {
                variant: "contained",
                id: "discard",
                color: "primary",
                onClick: this.handleDiscardActiveObject,
              },
              " ",
              "Discard Selection"
            )
          )
        ),
        React.createElement("input", { type: "hidden", value: value })
      )
    );
  };
  ReactMultiCrop.defaultProps = {
    id: "canvas",
    color: "grey",
    opacity: 0.5,
    strokeColor: "yellow",
    strokeDashArray: [5, 5],
    strokeWidth: 5,
    record: [],
    input: null,
  };
  return ReactMultiCrop;
})(Component);

export { ReactMultiCrop };
//# sourceMappingURL=index.esm.js.map
