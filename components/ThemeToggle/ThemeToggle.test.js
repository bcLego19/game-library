import React from "react";
import { shallow } from "enzyme";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<ThemeToggle />);
    expect(wrapper).toMatchSnapshot();
  });
});
