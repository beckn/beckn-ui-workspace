import React from "react";
import { shallow, render, mount } from "enzyme";
import SignInPassword from "./SignInPassword";

describe("SignInPassword", () => {
  let props;
  let shallowLanding;
  let renderedLanding;
  let mountedLanding;

  const shallowTestComponent = () => {
    if (!shallowLanding) {
      shallowLanding = shallow(<SignInPassword {...props} />);
    }
    return shallowLanding;
  };

  const renderTestComponent = () => {
    if (!renderedLanding) {
      renderedLanding = render(<SignInPassword {...props} />);
    }
    return renderedLanding;
  };

  const mountTestComponent = () => {
    if (!mountedLanding) {
      mountedLanding = mount(<SignInPassword {...props} />);
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
