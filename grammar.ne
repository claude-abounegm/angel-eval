@builtin "number.ne"
@builtin "string.ne"
@builtin "postprocessors.ne"

@{%
const Variable = require('./interpreter/Variable').default;
const ConditionalExpression = require('./interpreter/ConditionalExpression').default;
const NegationExpression = require('./interpreter/NegationExpression').default;
const BooleanConstant = require('./interpreter/BooleanConstant').default;
const NullConstant = require('./interpreter/NullConstant').default;
const NumberConstant = require('./interpreter/NumberConstant').default;
const StringConstant = require('./interpreter/StringConstant').default;

const arrayify = item => Array.isArray(item) ? item : [item];
const joinFirst =
  (seperator = "") =>
  ([items]) =>
    items.join(seperator);

const joinAll =
  (seperator = "") =>
  (items) =>
    items.join(seperator);

const toConditionalExpression = (items) => new ConditionalExpression(items[0], items[4], items[2]);
%}

main -> expression {% id %}

expression -> booleanExpression {% id %}

booleanExpression -> 
        equalityExpression {% id %}
        | equalityExpression _ booleanOperator _ booleanExpression {% toConditionalExpression %}
booleanOperator -> "&&" {% id %} | "||" {% id %}

equalityExpression -> 
        relationalExpression {% id %}
        | relationalExpression _ equalityOperator _ equalityExpression {% toConditionalExpression %}
equalityOperator -> "===" {% id %} | "!==" {% id %}
                # | "==" {% id %} | "!=" {% id %}

relationalExpression ->
        unaryExpression {% id %}
        | unaryExpression _ relationalOperator _ relationalExpression {% toConditionalExpression %}
relationalOperator -> ">=" {% id %} | ">" {% id %} | "<" {% id %} | "<=" {% id %}

unaryExpression ->
        boolean {% ([value]) => new BooleanConstant(value) %}
        | nullLiteral {% ([value]) => new NullConstant(value) %}
        | number {% ([value]) => new NumberConstant(value) %}
        | string {% ([value]) => new StringConstant(value) %}
        | variablePath {% ([path]) => new Variable(path)  %}
        | "!" _ expression {% ([,,node]) => new NegationExpression(node) %}
        | "(" _ expression _ ")" {% d => d[2] %}

variablePath ->
        variable {% id %}
        | variablePath _ "." _ variableAfterDot {% d => [...arrayify(d[0]), d[4]] %}
        | variablePath _ "[" _ expression _ "]" {% d => [...arrayify(d[0]), d[4]] %}

variable -> variableFirstLetter variableAfterDot {% joinAll() %}
variableFirstLetter -> [a-zA-Z_] {% id %}
variableAfterDot -> [a-zA-Z0-9_]:* {% joinFirst('') %}

nullLiteral -> "null" {% _ => null %}
boolean -> "true" {% _ => true %} | "false" {% _ => false %}
number -> jsonfloat {% id %}
string ->
        dqstring {% id %}
        | sqstring {% id %}
        # | backTickstring {% id %}

# backTickstring -> "`" pieces "`" {% d => d[1] %}

# variable ->
#        "${" _ expression _ "}" {% d => d[2] %}

_ -> [\s]:* {% () => null %}

# string -> "\"" (([^\n\\"] | "\\" ["\\ntbfr]):* {% joinFirst() %}) "\"" {% d => d[1] %}
#                 | "'" (([^\n\\'] | "\\" ['\\ntbfr]):* {% joinFirst() %}) "'" {% d => d[1] %}