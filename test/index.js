import ConditionalExpression from "../src/interpreter/ConditionalExpression";
import ShouldNotBeReachedError from "./ShouldNotBeReachedError";
import "./evaluate";

describe("ConditionalExpression", function () {
  it("should throw on invalid op", function () {
    const cond = new ConditionalExpression("", "", "^^");

    try {
      cond.evaluate();
      throw new ShouldNotBeReachedError();
    } catch (e) {
      if (e instanceof ShouldNotBeReachedError) {
        throw e;
      }
    }
  });

  // it('should always return ')
});
