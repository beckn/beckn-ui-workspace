import React from "react";
import { shallow, render, mount } from "enzyme";
import SignInPhone from "./SignInPhone";

describe("SignInPhone", () => {
  let props;
  let shallowLanding;
  let renderedLanding;
  let mountedLanding;

  const shallowTestComponent = () => {
    if (!shallowLanding) {
      shallowLanding = shallow(<SignInPhone {...props} />);
    }
    return shallowLanding;
  };

  const renderTestComponent = () => {
    if (!renderedLanding) {
      renderedLanding = render(<SignInPhone {...props} />);
    }
    return renderedLanding;
  };

  const mountTestComponent = () => {
    if (!mountedLanding) {
      mountedLanding = mount(<SignInPhone {...props} />);
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
