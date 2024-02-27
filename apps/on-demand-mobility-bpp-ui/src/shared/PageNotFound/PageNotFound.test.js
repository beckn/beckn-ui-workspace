import React from "react";
import { shallow, render, mount } from "enzyme";
import PageNotFound from "./PageNotFound";

describe("PageNotFound", () => {
  let props;
  let shallowPageNotFound;
  let renderedPageNotFound;
  let mountedPageNotFound;

  const shallowTestComponent = () => {
    if (!shallowPageNotFound) {
      shallowPageNotFound = shallow(<PageNotFound {...props} />);
    }
    return shallowPageNotFound;
  };

  const renderTestComponent = () => {
    if (!renderedPageNotFound) {
      renderedPageNotFound = render(<PageNotFound {...props} />);
    }
    return renderedPageNotFound;
  };

  const mountTestComponent = () => {
    if (!mountedPageNotFound) {
      mountedPageNotFound = mount(<PageNotFound {...props} />);
    }
    return mountedPageNotFound;
  };

  beforeEach(() => {
    props = {};
    shallowPageNotFound = undefined;
    renderedPageNotFound = undefined;
    mountedPageNotFound = undefined;
  });

  // Shallow / unit tests begin here

  // Render / mount / integration tests begin here
});
