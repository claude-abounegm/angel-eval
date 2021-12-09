import memoize from "lodash/memoize";
import isString from "lodash/isString";
import isBoolean from "lodash/isBoolean";
import { Grammar, Parser } from "nearley";
import Evaluatable from "./Evaluatable";

const grammar = Grammar.fromCompiled(require("./grammar.js"));

function createParser() {
  return new Parser(grammar);
}

/**
 * Parses the given expression and returns an
 * `Evaluatable` that can be evaluated with a context.
 *
 * @param {string} expression
 * @returns {Evaluatable}
 */
const _parse = (expression) => {
  if (!isString(expression) || expression.length === 0) {
    throw new Error("expression needs to be a non-empty string");
  }

  const parser = createParser();

  try {
    parser.feed(expression);

    const [node] = parser.results;

    // if (!(node instanceof Evaluatable)) {
    //   throw new Error("Result needs to be an instance of Evaluatable");
    // }

    return node;
  } catch (e) {
    const segments = e.message.split(/\r?\n/g).slice(0, 4);

    segments[2] = segments[2].substring(1);
    segments[3] = segments[3].substring(1);

    throw new Error(segments.join("\n"));
  }
};

/**
 * Parses the given expression and returns an
 * `Evaluatable` that can be evaluated with a context.
 *
 * This function is memoized for optimization.
 *
 * You can access the function's cache using `parse.cache`.
 */
export const parse = memoize(_parse);

/**
 * Evaluates the given expression using the context provided.
 *
 * @param {string} expression
 * @param {{ [key: string]: any }} [context]
 * @param {boolean} [strictBoolean] Whether to always return a boolean.
 * @returns {boolean}
 */
export function evaluate(expression, context = {}, strictBoolean = true) {
  const node = parse(expression);

  // console.dir(node, { depth: 100 });

  let value = node.evaluate(context);
  if (!isBoolean(value) && strictBoolean) {
    value = !!value;
  }

  return value;
}

export default {
  createParser,
  _parse,

  // public methods
  parse,
  evaluate,
};
