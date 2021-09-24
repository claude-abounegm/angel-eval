const Evaluatable = require("./Evaluatable");
const { evaluateNode } = require("./utils");

class Negation extends Evaluatable {
  constructor(node) {
    super();

    this.node = node;
  }

  evaluate(context) {
    return !evaluateNode(this.node, context);
  }
}

module.exports = Negation;
