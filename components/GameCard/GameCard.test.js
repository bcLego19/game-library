import React from "react";
import { shallow } from "enzyme";
import GameCard from "./GameCard";

describe("GameCard", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<GameCard />);
    expect(wrapper).toMatchSnapshot();
  });
});
