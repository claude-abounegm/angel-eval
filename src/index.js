const memoize = require("lodash/memoize");
const isBoolean = require("lodash/isBoolean");
const { Grammar, Parser } = require("nearley");

const Evaluatable = require("./Evaluatable.js");
const grammar = Grammar.fromCompiled(require("./compiledGrammar.js"));

function createParser() {
  return new Parser(grammar);
}

/**
 * Parses the given expression.
 *
 * @param {string} expression
 * @returns {Evaluatable | boolean | string | number}
 */
const _parse = (expression) => {
  const parser = createParser();

  try {
    if (expression) {
      parser.feed(expression);
    }

    const [node] = parser.results;

    return node;
  } catch (e) {
    const segments = e.message.split(/\r?\n/g).slice(0, 4);

    segments[2] = segments[2].substring(1);
    segments[3] = segments[3].substring(1);

    throw new Error(segments.join("\n"));
  }
};

/**
 * Parses the given expression. This function is memoized for optimization.
 */
const parse = memoize(_parse);

/**
 * Evaluates the given expression using the context provided.
 *
 * @param {string} expression
 * @param {{ [key: string]: any }} [context]
 * @param {boolean} [strictBoolean] Whether to always return a boolean.
 * @returns {boolean}
 */
function evaluate(expression, context = {}, strictBoolean = true) {
  let node = parse(expression);

  // console.dir(node, { depth: 100 });

  if (node instanceof Evaluatable) {
    node = node.evaluate(context);
  }

  if (!isBoolean(node) && strictBoolean) {
    node = !!node;
  }

  return node;
}

module.exports = {
  createParser,
  _parse,
  parse,
  evaluate,
};
