const Evaluatable = require("./Evaluatable");

function evaluateNode(node, context) {
  if (node instanceof Evaluatable) {
    return node.evaluate(context);
  }

  return node;
}

module.exports = {
  evaluateNode,
};
