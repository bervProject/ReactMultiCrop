import React from "react";
import { render } from "@testing-library/react";

import ReactMultiCrop from "./ReactMultiCrop";
import { ReactMultiCropProps } from "./ReactMultiCrop.types";

describe("Test Component", () => {
  let props: ReactMultiCropProps;

  beforeEach(() => {
    props = {
      id: "canvas",
      color: "red",
      strokeColor: "white",
      opacity: 0.8,
      strokeDashArray: [5, 5],
      strokeWidth: 5,
      record: [],
      input: {
        value: "",
        name: "react",
        onChange: function () {},
      },
    };
  });

  const renderComponent = () => render(<ReactMultiCrop {...props} />);

  it("should have primary className with default props", () => {
    const { getByTestId } = renderComponent();

    const testComponent = getByTestId("canvas-wrapper");

    expect(testComponent).toBeTruthy();
  });

  it("should have secondary className with theme set as secondary", () => {
    props.id = "new-canvas";
    const { getByTestId } = renderComponent();

    const testComponent = getByTestId("canvas-wrapper");

    expect(testComponent).toBeTruthy();
  });
});
