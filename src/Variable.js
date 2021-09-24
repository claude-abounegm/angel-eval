const isArray = require("lodash/isArray");
const get = require("lodash/get");
const Evaluatable = require("./Evaluatable");
const { evaluateNode } = require("./utils");

class Variable extends Evaluatable {
  constructor(name) {
    super();

    this.variableName = name;
  }

  evaluateVariableName(context) {
    const { variableName } = this;

    if (isArray(variableName)) {
      return variableName.map((n) => evaluateNode(n, context));
    }

    return variableName;
  }

  evaluate(context) {
    const variableName = this.evaluateVariableName(context);

    return get(context, variableName);
  }

  static parse(item) {
    if (item === "true") {
      return true;
    }

    if (item === "false") {
      return false;
    }

    if (item === "null") {
      return null;
    }

    return new this(item);
  }
}

module.exports = Variable;
