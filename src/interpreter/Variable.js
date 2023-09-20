import isArray from "lodash/isArray";
import get from "lodash/get";
import Evaluatable from "../Evaluatable";
import { evaluateNode } from "../utils";

class Variable extends Evaluatable {
  constructor(name) {
    super();

    this.variableName = name;
  }

  evaluateVariableName(variableName, context) {
    if (isArray(variableName)) {
      // console.log(variableName);
      // we can have nested variables
      return variableName.map((n) => evaluateNode(n, context));
    }

    return variableName;
  }

  evaluate(context) {
    const variableName = this.evaluateVariableName(this.variableName, context);

    return get(context, variableName);
  }
}

export default Variable;
