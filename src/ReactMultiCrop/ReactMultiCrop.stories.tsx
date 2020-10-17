import React from "react";
import ReactMultiCrop from "./ReactMultiCrop";

export default {
  title: "ReactMultiCrop"
};

export const Canvas = () => <ReactMultiCrop id="canvas" input={{ name: 'canvas', value: '' }} record={[]} />;
