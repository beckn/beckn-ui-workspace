import React from "react";
import { shallow, render, mount } from "enzyme";
import Login from "./Login";

describe("Login", () => {
  let props;
  let shallowLanding;
  let renderedLanding;
  let mountedLanding;

  const shallowTestComponent = () => {
    if (!shallowLanding) {
      shallowLanding = shallow(<Login {...props} />);
    }
    return shallowLanding;
  };

  const renderTestComponent = () => {
    if (!renderedLanding) {
      renderedLanding = render(<Login {...props} />);
    }
    return renderedLanding;
  };

  const mountTestComponent = () => {
    if (!mountedLanding) {
      mountedLanding = mount(<Login {...props} />);
    }
    return mountedLanding;
  };

  beforeEach(() => {
    props = {};
    shallowLanding = undefined;
    renderedLanding = undefined;
    mountedLanding = undefined;
  });

  // Shallow / unit tests begin here

  // Render / mount / integration tests begin here
});
