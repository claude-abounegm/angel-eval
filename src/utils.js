import Evaluatable from "./Evaluatable";

export function evaluateNode(node, context) {
  if (node instanceof Evaluatable) {
    return node.evaluate(context);
  }

  return node;
}

export default {
  evaluateNode,
};
