import Evaluatable from "../Evaluatable";
import { evaluateNode } from "../utils";

class ConditionalExpression extends Evaluatable {
  constructor(leftNode, rightNode, operator) {
    super();

    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.operator = operator;
  }

  evaluate(context) {
    const left = evaluateNode(this.leftNode, context);
    const right = evaluateNode(this.rightNode, context);

    switch (this.operator) {
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

    throw new Error(this.operator + " not implemented");
  }
}

export default ConditionalExpression;
