import React from "react";
import { shallow, render, mount } from "enzyme";
import appHeader from "./AppHeader";

describe("appHeader", () => {
  let props;
  let shallowappHeader;
  let renderedappHeader;
  let mountedappHeader;

  const shallowTestComponent = () => {
    if (!shallowappHeader) {
      shallowappHeader = shallow(<appHeader {...props} />);
    }
    return shallowappHeader;
  };

  const renderTestComponent = () => {
    if (!renderedappHeader) {
      renderedappHeader = render(<appHeader {...props} />);
    }
    return renderedappHeader;
  };

  const mountTestComponent = () => {
    if (!mountedappHeader) {
      mountedappHeader = mount(<appHeader {...props} />);
    }
    return mountedappHeader;
  };

  beforeEach(() => {
    props = {};
    shallowappHeader = undefined;
    renderedappHeader = undefined;
    mountedappHeader = undefined;
  });

  // Shallow / unit tests begin here

  // Render / mount / integration tests begin here
});
