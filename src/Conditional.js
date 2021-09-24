const Evaluatable = require("./Evaluatable");
const { evaluateNode } = require("./utils");

class Conditional extends Evaluatable {
  constructor(left, right, op) {
    super();

    this.left = left;
    this.right = right;
    this.op = op;
  }

  evaluate(context) {
    const left = evaluateNode(this.left, context);
    const right = evaluateNode(this.right, context);

    switch (this.op) {
      // case "==":
      //   return left == right;

      // case "!=":
      //   return left != right;

      case "===":
        return left === right;

      case "!==":
        return left !== right;

      case "<=":
        return left <= right;

      case "<":
        return left < right;

      case ">=":
        return left >= right;

      case ">":
        return left > right;

      case "&&":
        return left && right;

      case "||":
        return left || right;
    }

    throw new Error(this.op + " not implemented");
  }
}

module.exports = Conditional;
