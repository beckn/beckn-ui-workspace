import React from "react";
import { shallow, render, mount } from "enzyme";
import appFooter from "./appFooter";

describe("appFooter", () => {
  let props;
  let shallowappFooter;
  let renderedappFooter;
  let mountedappFooter;

  const shallowTestComponent = () => {
    if (!shallowappFooter) {
      shallowappFooter = shallow(<appFooter {...props} />);
    }
    return shallowappFooter;
  };

  const renderTestComponent = () => {
    if (!renderedappFooter) {
      renderedappFooter = render(<appFooter {...props} />);
    }
    return renderedappFooter;
  };

  const mountTestComponent = () => {
    if (!mountedappFooter) {
      mountedappFooter = mount(<appFooter {...props} />);
    }
    return mountedappFooter;
  };

  beforeEach(() => {
    props = {};
    shallowappFooter = undefined;
    renderedappFooter = undefined;
    mountedappFooter = undefined;
  });

  // Shallow / unit tests begin here

  // Render / mount / integration tests begin here
});
