const Conditional = require("../src/Conditional");
const ShouldNotBeReachedError = require("./ShouldNotBeReachedError");

require("./evaluate");

describe("Conditional", function () {
  it("should throw on invalid op", function () {
    const cond = new Conditional("", "", "^^");

    try {
      cond.evaluate();
      throw new ShouldNotBeReachedError();
    } catch (e) {
      if (e instanceof ShouldNotBeReachedError) {
        throw e;
      }
    }
  });
});
