import React from "react";
import { render } from "@testing-library/react";

import ReactMultiCropForm from "./ReactMultiCropForm";

describe("Test Component", () => {

  const renderComponent = () => render(<ReactMultiCropForm />);

  it("it should render correctly", () => {
    const component = renderComponent();
    expect(component).toBeTruthy();
  });
});
